import path from 'node:path';
import type { BookingConfig } from './types';

/** BOOKING_CONFIG picks the journey (default: the real HealthHub config). */
export const configPath = path.resolve(__dirname, '..', process.env.BOOKING_CONFIG ?? 'configs/healthhub.config.ts');

/** BOOKINGS_CSV picks the data file (default depends on the config). */
export function csvPath(): string {
  if (process.env.BOOKINGS_CSV) return path.resolve(process.cwd(), process.env.BOOKINGS_CSV);
  const isMock = path.basename(configPath).startsWith('mock');
  return path.resolve(__dirname, '..', 'data', isMock ? 'mock-bookings.csv' : 'bookings.csv');
}

export function loadConfig(): BookingConfig {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(configPath).default;
}

export const authFile = path.resolve(__dirname, '..', '.auth', 'state.json');
export const resultsFile = path.resolve(__dirname, '..', 'results', 'results.csv');
