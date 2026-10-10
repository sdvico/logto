/**
 * SDVICO: đọc / ghi CSV theo RFC 4180 (ô có dấu phẩy, dấu nháy, xuống dòng thì bọc trong nháy kép).
 * Đủ cho tệp do `export-staff-to-iam.js` của MKN sinh ra; không cần thêm thư viện.
 */

const byteOrderMark = '﻿';

/** Một ô (bọc nháy hoặc không) và dấu kết thúc ô: phẩy, xuống dòng, hoặc hết tệp. */
const cellPattern = /("(?:[^"]|"")*"|[^\n\r",]*)(,|\r\n|\n|\r|$)/g;

const unquote = (raw: string) =>
  raw.startsWith('"') ? raw.slice(1, -1).replaceAll('""', '"') : raw;

/** `position`: chỗ ô kế tiếp phải bắt đầu; ô đọc được mà lệch chỗ nghĩa là có ký tự bị bỏ qua. */
type ParseState = { rows: readonly string[][]; row: readonly string[]; position: number };

/** Đọc CSV; dấu nháy kép đặt sai chỗ (không đóng, hoặc nằm giữa ô) thì ném lỗi kèm số dòng. */
export const parseCsv = (text: string): string[][] => {
  const source = text.startsWith(byteOrderMark) ? text.slice(1) : text;
  const { rows } = [...source.matchAll(cellPattern)].reduce<ParseState>(
    ({ rows, row, position }, match) => {
      const [whole, raw = '', delimiter] = match;
      if (match.index !== position) {
        throw new Error(
          `Tệp CSV sai định dạng ở dòng ${rows.length + 1}: dấu nháy kép (") đặt sai chỗ.`
        );
      }
      const cells = [...row, unquote(raw)];
      const next = position + whole.length;
      return delimiter === ','
        ? { rows, row: cells, position: next }
        : { rows: [...rows, cells], row: [], position: next };
    },
    { rows: [], row: [], position: 0 }
  );

  return rows.filter((cells) => cells.some((value) => value.trim() !== ''));
};

const quoteCell = (value: string) => `"${value.replaceAll('"', '""')}"`;

/** CSV có BOM để Excel đọc đúng tiếng Việt. */
export const toCsv = (rows: ReadonlyArray<readonly string[]>): string =>
  byteOrderMark +
  rows.map((cells) => cells.map((value) => quoteCell(value)).join(',')).join('\n') +
  '\n';
