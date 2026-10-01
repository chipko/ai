import { expect, type Locator, type Page } from '@playwright/test';
import type { BookingConfig, Field, Target } from './types';
import type { Row } from './csv';

export function locate(page: Page, t: Target): Locator {
  // Substring, case-insensitive: "First name" also finds "First name *". Ambiguous matches fail loudly.
  if (t.label) return page.getByLabel(t.label);
  if (t.testId) return page.getByTestId(t.testId);
  if (t.role) return page.getByRole(t.role, t.name ? { name: t.name } : undefined);
  if (t.selector) return page.locator(t.selector);
  throw new Error(`Target needs one of label/testId/role/selector: ${JSON.stringify(t)}`);
}

export function describe(t: Target): string {
  return String(t.label ?? t.testId ?? (t.role ? `${t.role} "${t.name ?? ''}"` : t.selector));
}

export function valueFor(field: Field, row: Row | undefined): string {
  if (field.column) {
    if (!row) throw new Error(`Field ${describe(field)} uses column "${field.column}" outside a CSV row`);
    if (!(field.column in row)) throw new Error(`CSV has no column "${field.column}"`);
    return row[field.column];
  }
  if (field.env) {
    const v = process.env[field.env];
    if (v === undefined) throw new Error(`Environment variable ${field.env} is not set`);
    return v;
  }
  return field.value ?? '';
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Whole-text, case-insensitive, whitespace-tolerant match for option text. */
const exactText = (v: string) => new RegExp(`^\\s*${escapeRe(v).replace(/\s+/g, '\\s+')}\\s*$`, 'i');

const TRUE = ['yes', 'y', 'true', '1', 'x'];
const FALSE = ['no', 'n', 'false', '0'];

function convertDate(v: string, from: BookingConfig['csvDateFormat'], to: Field['format']): string {
  let y: string, m: string, d: string;
  if (from === 'iso' || /^\d{4}-\d{2}-\d{2}$/.test(v)) [y, m, d] = v.split('-');
  else {
    const parts = v.split(/[/.-]/);
    if (parts.length !== 3) throw new Error(`Unrecognised date "${v}"`);
    [d, m, y] = from === 'MM/DD/YYYY' ? [parts[1], parts[0], parts[2]] : parts;
  }
  m = m.padStart(2, '0');
  d = d.padStart(2, '0');
  if (y.length === 2) y = `20${y}`;
  switch (to ?? 'iso') {
    case 'iso': return `${y}-${m}-${d}`;
    case 'DD/MM/YYYY': return `${d}/${m}/${y}`;
    case 'MM/DD/YYYY': return `${m}/${d}/${y}`;
  }
}

/** Picks a visible option from an open dropdown/results list. */
async function pickOption(page: Page, field: Field, value: string) {
  const options = field.optionSelector ? page.locator(field.optionSelector) : page.getByRole('option');
  const option = options.filter({ hasText: exactText(value), visible: true }).first();
  try {
    await option.waitFor({ state: 'visible', timeout: 10_000 });
  } catch {
    const seen = await options.filter({ visible: true }).allInnerTexts();
    throw new Error(
      `No option "${value}" for ${describe(field)}. Visible options: ${seen.map((s) => s.trim()).join(' | ') || '(none)'}`,
    );
  }
  await option.click();
}

export async function fillField(page: Page, field: Field, row: Row | undefined, config: BookingConfig) {
  const value = valueFor(field, row);
  const name = describe(field);
  if (value === '') {
    if (field.required) throw new Error(`Required value for ${name} (column "${field.column}") is blank`);
    return;
  }

  switch (field.type) {
    case 'text': {
      const el = locate(page, field);
      await el.fill(value);
      break;
    }

    case 'select': {
      const el = locate(page, field);
      await expect(el, `${name} should be enabled`).toBeEnabled();
      // Options may load after a previous choice (hospital -> specialty -> consultant),
      // so give them a moment to appear. Match by label first, value second.
      let labels: string[] = [];
      let byLabel: string | undefined;
      await expect
        .poll(
          async () => {
            labels = (await el.locator('option').allInnerTexts()).map((s) => s.trim());
            byLabel = labels.find((l) => exactText(value).test(l));
            return byLabel ?? (await el.locator(`option[value="${value.replace(/"/g, '\\"')}"]`).count());
          },
          { timeout: 10_000 },
        )
        .toBeTruthy()
        .catch(() => {});
      if (byLabel) await el.selectOption({ label: byLabel });
      else {
        try {
          await el.selectOption(value, { timeout: 5_000 });
        } catch {
          throw new Error(`No option "${value}" in ${name}. Options: ${labels.join(' | ')}`);
        }
      }
      break;
    }

    case 'combobox': {
      const trigger = locate(page, field);
      await trigger.click();
      if (field.typeToFilter) await page.keyboard.type(value, { delay: 20 });
      await pickOption(page, field, value);
      break;
    }

    case 'autocomplete': {
      const el = locate(page, field);
      await el.fill('');
      await el.pressSequentially(value, { delay: 30 });
      await pickOption(page, field, value);
      break;
    }

    case 'radio': {
      const scope = field.group ? page.getByRole('radiogroup', { name: field.group }).or(page.getByRole('group', { name: field.group })) : page;
      await scope.getByRole('radio', { name: exactText(value) }).check();
      break;
    }

    case 'checkbox': {
      const el = locate(page, field);
      const v = value.toLowerCase();
      if (TRUE.includes(v)) await el.check();
      else if (FALSE.includes(v)) await el.uncheck();
      else throw new Error(`Checkbox ${name} needs yes/no, got "${value}"`);
      break;
    }

    case 'date': {
      const el = locate(page, field);
      await el.fill(convertDate(value, config.csvDateFormat ?? 'DD/MM/YYYY', field.format));
      // Close any pop-up calendar the field opened.
      await el.press('Tab');
      break;
    }

    case 'choice': {
      const scope = field.label || field.selector || field.testId || field.role ? locate(page, field) : page;
      const candidates = field.optionSelector
        ? scope.locator(field.optionSelector)
        : scope.getByRole('button').or(scope.getByRole('radio')).or(scope.getByRole('option'));
      const target = candidates.filter({ hasText: exactText(value), visible: true }).first();
      try {
        await target.waitFor({ state: 'visible', timeout: 10_000 });
      } catch {
        throw new Error(`Nothing clickable labelled "${value}" in ${name}`);
      }
      await target.click();
      break;
    }

    default:
      throw new Error(`Unknown field type "${(field as Field).type}"`);
  }

  if (field.settleMs) await page.waitForTimeout(field.settleMs);
}
