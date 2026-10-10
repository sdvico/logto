import { parseCsv, toCsv } from './csv';

describe('parseCsv', () => {
  it('reads quoted cells with commas, quotes and line breaks', () => {
    const text = '﻿"a","b, c","say ""hi"""\r\n"line\nbreak",x,\n';

    expect(parseCsv(text)).toEqual([
      ['a', 'b, c', 'say "hi"'],
      ['line\nbreak', 'x', ''],
    ]);
  });

  it('rejects a stray quote instead of dropping characters', () => {
    expect(() => parseCsv('1,ab"c,3')).toThrow('dòng 1');
    expect(() => parseCsv('a,b\n"open,c')).toThrow('dòng 2');
  });

  it('skips blank lines', () => {
    expect(parseCsv('a,b\n\n,\nc,d')).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });
});

describe('toCsv', () => {
  it('round-trips through parseCsv', () => {
    const rows = [
      ['username', 'note'],
      ['nguyen_a', 'đổi "tên", xuống\ndòng'],
    ];

    expect(parseCsv(toCsv(rows))).toEqual(rows);
  });
});
