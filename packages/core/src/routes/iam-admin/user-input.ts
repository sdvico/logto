import { randomInt } from 'node:crypto';

import { emailRegEx, phoneRegEx, usernameRegEx } from '@logto/core-kit';
import { z } from 'zod';

/** Mật khẩu tự nhập: tối thiểu 8 ký tự, có chữ và số (hợp đồng U6). */
const passwordGuard = z
  .string()
  .min(8)
  .max(256)
  .regex(/[A-Za-z]/)
  .regex(/\d/);

export const roleCodesGuard = z.string().min(1).array().min(1).max(20);

export const createUserBodyGuard = z.object({
  name: z.string().trim().min(1).max(128),
  username: z.string().regex(usernameRegEx).max(128),
  email: z.string().regex(emailRegEx).max(128).optional(),
  phone: z.string().regex(phoneRegEx).max(32).optional(),
  password: z.discriminatedUnion('mode', [
    z.object({ mode: z.literal('generate') }),
    z.object({ mode: z.literal('set'), value: passwordGuard }),
  ]),
  organization: z.object({ id: z.string().min(1), roleCodes: roleCodesGuard }).optional(),
});

export const updateUserBodyGuard = z
  .object({
    name: z.string().trim().min(1).max(128),
    username: z.string().regex(usernameRegEx).max(128),
    email: z.string().regex(emailRegEx).max(128).nullable(),
    phone: z.string().regex(phoneRegEx).max(32).nullable(),
  })
  .partial();

export const userParamsGuard = z.object({ id: z.string().min(1) });
export const membershipParamsGuard = z.object({ id: z.string().min(1), orgId: z.string().min(1) });

/** Không có ký tự dễ nhầm (0/O, 1/l/I) vì người dùng phải chép tay mật khẩu tạm. */
const temporaryPasswordAlphabet = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Mật khẩu tạm dạng `Kx7m-Qa42-tRw9`, luôn có chữ và số. */
export const generateTemporaryPassword = (): string => {
  const groups = Array.from({ length: 3 }, () =>
    Array.from(
      { length: 4 },
      () => temporaryPasswordAlphabet[randomInt(temporaryPasswordAlphabet.length)]
    ).join('')
  );
  const password = groups.join('-');

  return passwordGuard.safeParse(password).success ? password : generateTemporaryPassword();
};
