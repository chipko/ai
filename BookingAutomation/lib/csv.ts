import fs from 'node:fs';
import { parse } from 'csv-parse/sync';

export type Row = Record<string, string> & { __line: string };

/**
 * Reads the bookings CSV. Header row = column names. Special columns:
 *   id    – used as the test title (defaults to the line number)
 *   skip  – any non-empty value skips the row
 * Lines starting with # are comments.
 */
export function readRows(file: string): Row[] {
  const records: { record: Record<string, string>; info: { lines: number } }[] = parse(fs.readFileSync(file), {
    columns: (header: string[]) => header.map((h) => h.trim()),
    skip_empty_lines: true,
    comment: '#',
    comment_no_infix: true, // only whole-line comments, so "Flat #3" survives
    trim: true,
    bom: true,
    info: true,
  });
  return records.map(({ record, info }) => ({ ...record, __line: String(info.lines) }));
}

/** Ids for test titles must be unique or Playwright refuses to run. */
export function rowTitle(row: Row): string {
  return row.id ? `${row.id} (line ${row.__line})` : `line ${row.__line}`;
}
