import { normalizePhone, phonesIn } from './phone';

describe('normalizePhone', () => {
  it('keeps digits only', () => {
    expect(normalizePhone('+84 912.345-678')).toBe('84912345678');
  });

  it('turns a Vietnamese local number into the +84 form', () => {
    expect(normalizePhone('0911122210')).toBe('84911122210');
    expect(normalizePhone('0912 345 678')).toBe('84912345678');
    expect(normalizePhone('024.3826.1234')).toBe('842438261234');
  });

  it('restores the leading zero a spreadsheet dropped from a mobile number', () => {
    expect(normalizePhone('911122210')).toBe('84911122210');
  });

  it('ignores quotes and stray marks a spreadsheet leaves around the number', () => {
    expect(normalizePhone("'0912345678")).toBe('84912345678');
    expect(normalizePhone('"0912.345.678')).toBe('84912345678');
    expect(normalizePhone('0912345678`')).toBe('84912345678');
    expect(normalizePhone(',0912345678')).toBe('84912345678');
    expect(normalizePhone('0912345678​')).toBe('84912345678');
  });

  it('moves an old 11-digit mobile number to its 2018 prefix', () => {
    expect(normalizePhone('01689123456')).toBe('84389123456');
    expect(normalizePhone('0123 456 7890')).toBe('84834567890');
    expect(normalizePhone('0199.123.4567')).toBe('84591234567');
  });

  it('takes the first number of a cell holding several', () => {
    expect(normalizePhone('0912345678/ 0987654321')).toBe('84912345678');
    expect(normalizePhone('0912 345 678 hoặc 0987654321')).toBe('84912345678');
    expect(normalizePhone('0912345678  0987654321')).toBe('84912345678');
    expect(normalizePhone('0912345678 0987654321')).toBe('84912345678');
    expect(normalizePhone("0912345678'0987654321")).toBe('84912345678');
    expect(normalizePhone('0912345678, số vợ0987654321')).toBe('84912345678');
  });

  it('returns nothing for a cell without a valid number', () => {
    for (const raw of ['', '9', '9999', '0912345', '0912 345 67', '12/05/1980', 'Nước ngoài']) {
      expect(normalizePhone(raw)).toBe('');
    }
  });
});

describe('phonesIn', () => {
  it('lists every distinct valid number of a cell', () => {
    expect(phonesIn('0912345678 hoặc 0987.654.321')).toEqual(['84912345678', '84987654321']);
    expect(phonesIn('0912345678 (0912 345 678)')).toEqual(['84912345678']);
    expect(phonesIn('không dùng ĐT')).toEqual([]);
  });
});
