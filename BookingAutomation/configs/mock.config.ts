import { defineBooking } from '../lib/types';

/**
 * Journey for the local mock site (mock-site/). Also a worked example of every field type —
 * copy patterns from here into healthhub.config.ts.
 */
export default defineBooking({
  baseURL: 'http://localhost:4321',
  startPath: '/book',
  csvDateFormat: 'DD/MM/YYYY',

  login: {
    path: '/login',
    fields: [
      { label: 'Username', type: 'text', value: process.env.HEALTHHUB_USER ?? 'test.user' },
      { label: 'Password', type: 'text', value: process.env.HEALTHHUB_PASSWORD ?? 'not-a-real-password' },
    ],
    submit: { role: 'button', name: 'Sign in' },
    success: { role: 'link', name: 'New booking' },
  },

  steps: [
    {
      name: 'Patient details',
      waitFor: { role: 'heading', name: 'Patient details' },
      fields: [
        { label: 'Title', type: 'select', column: 'title', required: true },
        { label: 'First name', type: 'text', column: 'first_name', required: true },
        { label: 'Last name', type: 'text', column: 'last_name', required: true },
        { label: 'Date of birth', type: 'date', column: 'dob', format: 'iso', required: true },
        { type: 'radio', group: 'Sex', column: 'sex' },
        { label: 'NHS number', type: 'text', column: 'nhs_number' },
        { label: 'Email', type: 'text', column: 'email' },
        { label: 'Mobile', type: 'text', column: 'phone' },
      ],
      next: { role: 'button', name: 'Continue' },
    },
    {
      name: 'Appointment',
      waitFor: { role: 'heading', name: 'Appointment' },
      fields: [
        { role: 'combobox', name: 'Hospital', type: 'combobox', column: 'hospital', required: true },
        { role: 'combobox', name: 'Specialty', type: 'combobox', column: 'specialty', required: true },
        { label: 'Consultant', type: 'select', column: 'consultant' },
        { type: 'radio', group: 'Appointment type', column: 'appointment_type' },
        { label: 'Funding', type: 'select', column: 'funding', required: true },
        { label: 'Insurer', type: 'autocomplete', column: 'insurer' },
        { label: 'Policy number', type: 'text', column: 'policy_number' },
        { label: 'Preferred date (DD/MM/YYYY)', type: 'date', column: 'appointment_date', format: 'DD/MM/YYYY', required: true },
        { role: 'group', name: 'Available times', type: 'choice', column: 'time', required: true },
      ],
      next: { role: 'button', name: 'Continue' },
    },
    {
      name: 'Review',
      waitFor: { role: 'heading', name: 'Review and confirm' },
      fields: [
        { label: 'Referral notes', type: 'text', column: 'notes' },
        { label: 'Patient consents to treatment terms', type: 'checkbox', value: 'yes' },
        { label: 'Send SMS reminders', type: 'checkbox', column: 'sms_reminders' },
      ],
    },
  ],

  submit: { role: 'button', name: 'Confirm booking' },
  success: {
    waitFor: { role: 'heading', name: 'Booking confirmed' },
    reference: { selector: '#booking-ref' },
  },
});
