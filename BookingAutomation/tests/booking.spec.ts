import fs from 'node:fs';
import { expect, test } from '@playwright/test';
import { csvPath, loadConfig, resultsFile } from '../lib/config';
import { readRows, rowTitle } from '../lib/csv';
import { describe, fillField, locate } from '../lib/fields';

const config = loadConfig();
const rows = readRows(csvPath());

const csvCell = (s: string) => `"${s.replace(/"/g, '""').replace(/\s+/g, ' ').trim()}"`;
function record(id: string, line: string, status: string, reference = '', error = '') {
  fs.appendFileSync(resultsFile, [id, line, status, reference, error].map(csvCell).join(',') + '\n');
}

for (const row of rows) {
  test(`booking ${rowTitle(row)}`, async ({ page }) => {
    if (row.skip) {
      record(row.id ?? '', row.__line, 'skipped', '', row.skip);
      test.skip(true, `skip column: ${row.skip}`);
    }

    let reference = '';
    try {
      await page.goto(config.startPath);

      for (const step of config.steps) {
        await test.step(step.name, async () => {
          if (step.waitFor) await expect(locate(page, step.waitFor)).toBeVisible();
          for (const field of step.fields) {
            await test.step(`${describe(field)}${field.column ? ` ← ${field.column}` : ''}`, () =>
              fillField(page, field, row, config),
            );
          }
          if (step.next) await locate(page, step.next).click();
        });
      }

      await test.step('Submit', async () => {
        await locate(page, config.submit).click();
        await expect(locate(page, config.success.waitFor)).toBeVisible({ timeout: 30_000 });
        if (config.success.reference) reference = (await locate(page, config.success.reference).innerText()).trim();
      });

      if (reference) test.info().annotations.push({ type: 'booking reference', description: reference });
      record(row.id ?? '', row.__line, 'booked', reference);
    } catch (e) {
      record(row.id ?? '', row.__line, 'failed', reference, (e as Error).message.split('\n')[0]);
      throw e;
    }
  });
}
