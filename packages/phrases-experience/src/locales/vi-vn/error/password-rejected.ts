import { type PasswordRejectionCode } from '@logto/core-kit';

type BreakdownKeysToObject<Key extends string> = {
  [K in Key as K extends `${infer A}.${string}` ? A : K]: K extends `${string}.${infer B}`
    ? BreakdownKeysToObject<B>
    : string;
};

type RejectionPhrases = BreakdownKeysToObject<PasswordRejectionCode>;

const password_rejected = {
  too_short: 'Độ dài tối thiểu là {{min}}.',
  too_long: 'Độ dài tối đa là {{max}}.',
  character_types: 'Cần ít nhất {{min}} loại ký tự.',
  unsupported_characters: 'Phát hiện ký tự không được hỗ trợ.',
  pwned: 'Tránh dùng mật khẩu đơn giản, dễ đoán.',
  restricted_found: 'Tránh lạm dụng {{list, list}}.',
  restricted: {
    repetition: 'ký tự lặp lại',
    sequence: 'ký tự liên tiếp',
    user_info: 'thông tin cá nhân của bạn',
    words: 'nội dung liên quan sản phẩm',
  },
} satisfies RejectionPhrases & {
  // Use for displaying a list of restricted issues
  restricted_found: string;
};

export default Object.freeze(password_rejected);
