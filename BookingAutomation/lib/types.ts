/**
 * Shape of a booking config. A config describes the booking journey once;
 * every row of the CSV is then pushed through it.
 */

/** How to find an element. Use exactly one. `label` is preferred — it survives restyling. */
export interface Target {
  /** Accessible label text, e.g. "First name" (Playwright getByLabel). */
  label?: string | RegExp;
  /** Any Playwright selector: CSS, `text=…`, `xpath=…`, `[data-testid=…]`. */
  selector?: string;
  /** data-testid value (Playwright getByTestId). */
  testId?: string;
  /** ARIA role + accessible name, e.g. { role: 'button', name: 'Next' }. */
  role?: Parameters<import('@playwright/test').Page['getByRole']>[0];
  name?: string | RegExp;
}

export type FieldType =
  /** Plain <input>/<textarea>. */
  | 'text'
  /** Native <select>. Matches the CSV value against option label, then option value. */
  | 'select'
  /**
   * Custom dropdown (React-Select, MUI, Angular Material, ng-select, Kendo…):
   * click the trigger, optionally type to filter, then click the option whose text matches.
   */
  | 'combobox'
  /** Type-ahead search box (patient lookup, GP search…): type, wait for results, click the match. */
  | 'autocomplete'
  /** Radio button whose label is the CSV value. */
  | 'radio'
  /** Checkbox; ticked for yes/y/true/1/x, unticked for no/n/false/0. */
  | 'checkbox'
  /** Date. CSV dates are converted from `csvDateFormat` to the field's `format`. */
  | 'date'
  /** Click a button/tile/slot whose visible text is the CSV value (e.g. time-slot grids). */
  | 'choice';

export interface Field extends Target {
  type: FieldType;
  /** CSV column holding the value. */
  column?: string;
  /** Fixed value (used when no column is given). */
  value?: string;
  /** Environment variable holding the value (for credentials — never put passwords in CSVs). */
  env?: string;
  /** Fail the row if the value is blank. Otherwise blank cells are skipped. */
  required?: boolean;
  /** combobox: type the value into the dropdown to filter long lists before picking. (autocomplete always types.) */
  typeToFilter?: boolean;
  /** combobox/autocomplete/choice: where options render. Default: `[role=option]` anywhere on the page. */
  optionSelector?: string;
  /** date: format the field expects. 'iso' = YYYY-MM-DD (native <input type=date>). Default 'iso'. */
  format?: 'iso' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
  /** radio: restrict to a group (fieldset/radiogroup) with this accessible name. */
  group?: string | RegExp;
  /** Pause after filling, for fields that trigger slow dependent loads (ms). */
  settleMs?: number;
}

export interface Step {
  name: string;
  /** Optional: wait for this to be visible before filling (e.g. the step heading). */
  waitFor?: Target;
  fields: Field[];
  /** Button that moves to the next step. Omit on the last step if `submit` handles it. */
  next?: Target;
}

export interface BookingConfig {
  baseURL: string;
  /** Page the booking journey starts on, relative to baseURL. */
  startPath: string;
  /** Optional login performed once and reused by every row. */
  login?: {
    path: string;
    fields: Field[];
    submit: Target;
    /** Something visible only once logged in. */
    success: Target;
  };
  steps: Step[];
  submit: Target;
  success: {
    /** Visible on the confirmation page. */
    waitFor: Target;
    /** Element holding the booking reference; its text goes into the results CSV. */
    reference?: Target;
  };
  /** CSV date format used in the data file. Default 'DD/MM/YYYY'. */
  csvDateFormat?: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'iso';
}

export const defineBooking = (c: BookingConfig) => c;
