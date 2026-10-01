# CSV → HealthHub booking automation (Playwright)

Fill in a spreadsheet, run one command, and every row becomes a booking made through the real UI.
There's no clicking or dragging by hand: Playwright drives a real browser through the dropdowns, date
pickers and time slots.

```
data/bookings.csv  ──►  configs/healthhub.config.ts  ──►  browser  ──►  results/results.csv
(one row = booking)     (which column → which field)                    (booked / failed + reference)
```

## Quick start

```bash
cd BookingAutomation
npm ci
npx playwright install chromium

# 1. See it working end-to-end against the bundled mock booking site
npm run test:mock

# 2. Run against HealthHub test
export HEALTHHUB_USER=...  HEALTHHUB_PASSWORD=...
npm test                       # all rows, headless
npm run test:headed            # watch it in a browser
npx playwright test --headed -g "line 3"    # just one row
npx playwright test --ui       # step-through debugger with time-travel
npm run report                 # HTML report, with screenshot/video/trace for failures
```

Other data files: `BOOKINGS_CSV=data/regression.csv npm test`.
Another environment: `BASE_URL=https://uat-healthhub... npm test`.

## The CSV

* Header row = column names. Each name must match a `column:` in the config.
* **Blank cell = leave that field alone**, so optional fields just stay empty. Mark a field `required: true` to fail the row instead.
* Values are what you *see* on screen: `Mr`, `Clifton Park Hospital`, `Self-pay`, `10:15`. Matching is case- and whitespace-insensitive.
* Dates are written `DD/MM/YYYY` (or `D/M/YYYY`) and converted to whatever the field expects.
* Checkboxes: `yes` / `no` (also `y`, `true`, `1`, `x`).
* `id` column: names the test. `skip` column: anything in it skips the row (the reason goes into the results file).
* Lines starting with `#` are comments.
* Never put passwords in the CSV; they come from environment variables (`env:` in the config).

After a run, `results/results.csv` lists each row as `booked` (with its booking reference), `failed` (with a readable reason)
or `skipped`. For example:

```
"wrong-specialty","3","failed","","No option ""Ophthalmology"" for combobox ""Specialty"". Visible options: Orthopaedics | Cardiology | Dermatology"
```

## The config: describe the journey once

`configs/healthhub.config.ts` lists the booking steps in order. Each step lists its fields and the button that moves on:

```ts
{
  name: 'Appointment',
  fields: [
    { label: 'Hospital',   type: 'combobox', column: 'hospital', required: true },
    { label: 'Specialty',  type: 'combobox', column: 'specialty' },     // waits for it to load after Hospital
    { label: 'Consultant', type: 'select',   column: 'consultant' },
    { label: 'Date',       type: 'date',     column: 'appointment_date', format: 'DD/MM/YYYY' },
    { type: 'choice', column: 'time' },                                  // click the "10:15" slot
  ],
  next: { role: 'button', name: 'Continue' },
}
```

### Field types

| type | for | what it does |
|---|---|---|
| `text` | inputs, textareas | types the value |
| `select` | native `<select>` | picks the option by visible text (then by value); waits for dependent options to load |
| `combobox` | custom dropdowns (React-Select, MUI, Angular Material, ng-select, Kendo…) | clicks to open, waits for the list, clicks the matching option. Add `typeToFilter: true` for long lists |
| `autocomplete` | type-ahead search (GP, insurer, patient lookup) | types the value, waits for results, clicks the match |
| `radio` | radio buttons | ticks the radio labelled with the value; `group:` narrows it to one question |
| `checkbox` | checkboxes | `yes` ticks, `no` unticks |
| `date` | date inputs and date pickers with a text box | converts the date, types it, tabs out to close the calendar |
| `choice` | time-slot grids, tiles, button groups | clicks the button/option whose text is the value |

If a custom dropdown renders options without `role="option"`, add `optionSelector: '.dropdown-item'` (or whatever codegen shows).
For a field that triggers a slow reload, add `settleMs: 1000`.

### Finding elements

Use one of these on any field, `next`, `submit` or `success`:

* `label: 'First name'`: the visible label. Preferred, because it survives redesigns. Substring match, so `'First name'` also finds `First name *`.
* `role: 'button', name: 'Next'`: anything with an ARIA role (buttons, links, headings, comboboxes, groups).
* `testId: 'patient-dob'`: if the devs add `data-testid` attributes. Ask for these; they're the most stable option.
* `selector: '#ctl00_Main_ddlSpecialty'`: any CSS/Playwright selector, as a last resort.

### Setting it up for HealthHub

The HealthHub config is a **starter template**: its labels and button names are guesses until checked against the real screens.

1. `npx playwright codegen http://test-healthhub.ramsayhealth.co.uk` opens a browser plus a recorder.
2. Make one booking by hand. Codegen prints a locator for every click: `getByLabel('Forename')` becomes `label: 'Forename'`,
   `getByRole('combobox', { name: 'Site' })` becomes `role: 'combobox', name: 'Site'`.
3. Put them in `configs/healthhub.config.ts`, adding a CSV column for each one you want to vary.
4. Run one row headed (`npx playwright test --headed -g "line 3"`) and fix whatever it reports.

`configs/mock.config.ts` + `data/mock-bookings.csv` + `mock-site/` are a complete working example covering every field type:
login, dependent dropdowns that load late, a type-ahead insurer search, a conditional section (insurer only when "Insured"),
DD/MM/YYYY dates, a time-slot grid and a confirmation reference.

## Notes

* Rows run **one at a time** by default, because parallel bookings can fight over the same slot. Use `--workers=4` once you know they don't.
* Login happens once per run (`tests/auth.setup.ts`) and the session is reused for every row.
* Use clearly fake test patients only (e.g. `Test Automation-One`, `07700 900xxx` numbers and `@example.com` emails, which are reserved for testing).
* Failures keep a screenshot, a video and a Playwright trace in the HTML report (`npm run report`), so you can see exactly where a row went wrong.
