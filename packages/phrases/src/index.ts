import type { LanguageTag } from '@logto/language-kit';
import { languages, findSupportedLanguageTag } from '@logto/language-kit';
import type { DeepPartial, NormalizeKeyPaths } from '@silverhand/essentials';
import { z } from 'zod';

import en from './locales/en/index.js';
// Các locale gốc của Logto (ar, de, es, fa-ir, fr, it, ja, ko, pl-pl, pt-br, pt-pt, ru, th, tr-tr,
// zh-cn, zh-hk, zh-tw) vẫn còn file dịch trên đĩa nhưng KHÔNG import/expose ở đây — sdvico chỉ
// hỗ trợ 2 chế độ ngôn ngữ: English / Tiếng Việt. Khôi phục dễ dàng bằng cách import lại khi cần.
import viVN from './locales/vi-vn/index.js';
import type { LocalePhrase } from './types.js';

export type { LocalePhrase } from './types.js';

export type DefaultLocale = 'en';
export type I18nKey = NormalizeKeyPaths<typeof en.translation>;

export const builtInLanguages = ['en', 'vi-VN'] as const;

export const builtInLanguageOptions = builtInLanguages.map((languageTag) => ({
  value: languageTag,
  title: languages[languageTag],
}));

export const builtInLanguageTagGuard = z.enum(builtInLanguages);

export type BuiltInLanguageTag = z.infer<typeof builtInLanguageTagGuard>;

export type Errors = typeof en.errors;
export type LogtoErrorCode = NormalizeKeyPaths<Errors>;
export type LogtoErrorI18nKey = `errors:${LogtoErrorCode}`;

export type AdminConsoleKey = NormalizeKeyPaths<typeof en.translation.admin_console>;

export const getDefaultLanguageTag = (language: string): LanguageTag =>
  builtInLanguageTagGuard.parse(
    findSupportedLanguageTag(language ? [language] : [], builtInLanguages)
  );

export const isBuiltInLanguageTag = (language: string): language is BuiltInLanguageTag =>
  builtInLanguageTagGuard.safeParse(language).success;

export type Resource = Record<
  Exclude<BuiltInLanguageTag, DefaultLocale>,
  DeepPartial<LocalePhrase>
> & {
  [key in DefaultLocale]: LocalePhrase;
};

const resource: Resource = {
  en,
  'vi-VN': viVN,
};

export default resource;
