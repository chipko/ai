import { defineBooking } from '../lib/types';

/**
 * Journey for the real HealthHub test environment.
 *
 * ⚠️  STARTER TEMPLATE. The labels, button names and paths below are placeholders modelled on a typical
 * booking flow: the site wasn't reachable when this was written. Fix them against the real screens:
 *
 *   1. npx playwright codegen http://test-healthhub.ramsayhealth.co.uk
 *   2. Click through one booking by hand. Codegen prints a locator for every click, e.g.
 *        page.getByLabel('Forename')                          ->  { label: 'Forename', ... }
 *        page.getByRole('combobox', { name: 'Site' })         ->  { role: 'combobox', name: 'Site', ... }
 *        page.getByRole('button', { name: 'Next' })           ->  next: { role: 'button', name: 'Next' }
 *        page.locator('#ctl00_Main_ddlSpecialty')            ->  { selector: '#ctl00_Main_ddlSpecialty', ... }
 *   3. Copy them in here, then run one row headed:  npx playwright test --headed -g "line 2"
 *
 * See configs/mock.config.ts for a working example of every field type.
 */
export default defineBooking({
  baseURL: process.env.BASE_URL ?? 'http://test-healthhub.ramsayhealth.co.uk',
  startPath: '/', // TODO: path of the "new booking" page
  csvDateFormat: 'DD/MM/YYYY',

  // Credentials come from environment variables, never from the CSV or this file.
  login: {
    path: '/', // TODO: login page path
    fields: [
      { label: /user ?name|email/i, type: 'text', env: 'HEALTHHUB_USER' },
      { label: /password/i, type: 'text', env: 'HEALTHHUB_PASSWORD' },
    ],
    submit: { role: 'button', name: /sign in|log in/i },
    success: { role: 'button', name: /log ?out|sign ?out/i }, // TODO: something only visible when logged in
  },

  steps: [
    {
      name: 'Patient details',
      fields: [
        { label: 'Title', type: 'select', column: 'title' },
        { label: 'First name', type: 'text', column: 'first_name', required: true },
        { label: 'Last name', type: 'text', column: 'last_name', required: true },
        { label: 'Date of birth', type: 'date', column: 'dob', format: 'DD/MM/YYYY', required: true },
        { type: 'radio', group: 'Sex', column: 'sex' },
        { label: 'NHS number', type: 'text', column: 'nhs_number' },
        { label: 'Email', type: 'text', column: 'email' },
        { label: 'Mobile', type: 'text', column: 'phone' },
        { label: 'Postcode', type: 'text', column: 'postcode' },
      ],
      next: { role: 'button', name: /next|continue/i },
    },
    {
      name: 'Appointment',
      fields: [
        { label: 'Hospital', type: 'combobox', column: 'hospital', required: true },
        { label: 'Specialty', type: 'combobox', column: 'specialty', required: true },
        { label: 'Consultant', type: 'combobox', column: 'consultant' },
        { label: 'Appointment type', type: 'select', column: 'appointment_type' },
        { label: 'Funding', type: 'select', column: 'funding' },
        { label: 'Insurer', type: 'autocomplete', column: 'insurer' },
        { label: 'Policy number', type: 'text', column: 'policy_number' },
        { label: 'Date', type: 'date', column: 'appointment_date', format: 'DD/MM/YYYY' },
        { type: 'choice', column: 'time' },
      ],
      next: { role: 'button', name: /next|continue/i },
    },
    {
      name: 'Review',
      fields: [{ label: 'Notes', type: 'text', column: 'notes' }],
    },
  ],

  submit: { role: 'button', name: /confirm|book|submit/i },
  success: {
    waitFor: { selector: 'text=/booking (confirmed|complete)/i' },
    // reference: { selector: '#booking-reference' }, // TODO: element showing the booking number
  },
});
