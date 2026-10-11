/** SDVICO: số điện thoại từ tệp của hệ tích hợp, đổi về dạng Logto lưu (chữ số, có mã nước). */
import { phoneRegEx } from '@logto/core-kit';
import { isValidPhoneNumber } from 'libphonenumber-js';

const vietnamCallingCode = '84';
/** Số di động Việt Nam đã mất số 0 đầu (Excel xoá khi mở rồi lưu lại tệp). */
const mobileWithoutZeroLength = 9;
/** Số di động 11 chữ số trước năm 2018, bỏ số 0 đầu. */
const oldMobileLength = 10;

/** Đầu số di động cũ (bỏ số 0) → đầu số mới, theo đợt chuyển đổi năm 2018. */
const oldMobilePrefixes: Readonly<Record<string, string>> = Object.freeze({
  '120': '70',
  '121': '79',
  '122': '77',
  '126': '76',
  '128': '78',
  '123': '83',
  '124': '84',
  '125': '85',
  '127': '81',
  '129': '82',
  '162': '32',
  '163': '33',
  '164': '34',
  '165': '35',
  '166': '36',
  '167': '37',
  '168': '38',
  '169': '39',
  '186': '56',
  '188': '58',
  '199': '59',
});

/**
 * Ngăn giữa các số trong một ô: mọi ký tự khác chữ số, dấu cách, chấm, gạch, `+` (chữ "hoặc", `/`, `,`,
 * dấu nháy Excel, ký tự vô hình), hai dấu cách trở lên, hoặc gạch có cách hai bên.
 */
const separator = /[^\d\s+.-]+|\s{2,}|\s-\s/;

/**
 * Đổi chữ số sang dạng Logto lưu: máy chủ đọc mọi số như số quốc tế, nên số nội địa Việt Nam `09…` bị
 * từ chối còn `9…` thành số nước khác.
 */
const toLogtoPhone = (digits: string) => {
  if (digits.startsWith('0')) {
    const local = digits.slice(1);
    const newPrefix =
      local.length === oldMobileLength ? oldMobilePrefixes[local.slice(0, 3)] : undefined;
    return `${vietnamCallingCode}${newPrefix ? `${newPrefix}${local.slice(3)}` : local}`;
  }

  return digits.length === mobileWithoutZeroLength ? `${vietnamCallingCode}${digits}` : digits;
};

/** Số hợp lệ trong `text` (bỏ mọi ký tự khác chữ số), hoặc không có; kiểm giống máy chủ (thêm `+`). */
const phoneOf = (text: string) => {
  const phone = toLogtoPhone(text.replaceAll(/\D/g, ''));
  return phoneRegEx.test(phone) && isValidPhoneNumber(`+${phone}`) ? phone : undefined;
};

/** Mọi số hợp lệ, không lặp, trong một ô (ô có thể ghi "a / b", "a hoặc b", "a b"). */
export const phonesIn = (raw: string) => {
  const phones = raw.split(separator).flatMap((part) => {
    const whole = phoneOf(part);
    return whole ? [whole] : part.split(/\s/).flatMap((word) => phoneOf(word) ?? []);
  });
  return [...new Set(phones)];
};

/** Số sẽ lưu cho một ô: cả ô nếu là một số, không thì số hợp lệ đầu tiên; trống nếu không có số nào. */
export const normalizePhone = (raw: string) => phoneOf(raw) ?? phonesIn(raw)[0] ?? '';
