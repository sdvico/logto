/**
 * SDVICO: chạy nhập cho các dòng đã chọn — GỌI LẠI Management API có sẵn cho từng dòng, giống
 * "Tạo hàng loạt" của MKN (fe-admin `bulk/runCreate.ts`). Tạo mới: tạo người → khoá nếu hệ nguồn không
 * ACTIVE → thêm vào tổ chức → gán chức danh. Nối: chỉ ghi `externalIds.<khoá hệ>` lên người đã có.
 *
 * Không làm endpoint `bulk` ở máy chủ: đường tạo người dùng đã có đủ kiểm trùng, băm mật khẩu, nhật ký.
 * Không có transaction bao cả lô: dòng hỏng thì hỏng một mình, màn hình cho chạy lại đúng dòng đó.
 * Chạy lại an toàn: dòng đã tạo người thì lần sau dùng lại id đó; thêm tổ chức, gán vai trò ở Logto
 * đều là `ON CONFLICT DO NOTHING`.
 */
import { type UserProfileResponse } from '@logto/schemas';
import { HTTPError, type KyInstance } from 'ky';

import { externalIdsOf } from './lookup';
import { isLinking, isSuspendedInSource } from './review-rules';
import { type DraftRow, type ImportLookup } from './staff-rows';

/** Số dòng chạy cùng lúc; đủ nhanh mà không dồn máy chủ. */
const concurrency = 4;

/** Việc đã làm với dòng: tạo mới, nối vào người đã có, bổ sung cho người đã nhập trước. */
export type RowOutcomeAction = 'create' | 'link' | 'update';

export type RowOutcome = {
  line: number;
  username: string;
  sourceAccountId: string;
  action: RowOutcomeAction;
  ok: boolean;
  userId?: string;
  /** Người đã được tạo nhưng bước sau hỏng: chạy lại sẽ tiếp tục từ người này. */
  createdUserId?: string;
  error?: string;
  /** Dòng vẫn đạt nhưng có mất mát, vd bỏ email vì Logto báo đã có người dùng. */
  warnings?: string[];
};

const errorMessageOf = async (error: unknown): Promise<string> => {
  if (error instanceof HTTPError) {
    try {
      const body = await error.response.json<{ code?: string; message?: string }>();
      return (
        [body.code, body.message].filter(Boolean).join(': ') || `HTTP ${error.response.status}`
      );
    } catch {
      return `HTTP ${error.response.status}`;
    }
  }

  return error instanceof Error ? error.message : String(error);
};

const errorCodeOf = async (error: unknown): Promise<string | undefined> => {
  if (!(error instanceof HTTPError)) {
    return undefined;
  }
  try {
    const body = await error.response.clone().json<{ code?: string }>();
    return body.code;
  } catch {
    return undefined;
  }
};

/**
 * Logto so trùng email, điện thoại kỹ hơn bước Soát (vd chuẩn hoá số điện thoại). Gặp trùng thì tạo
 * lại không kèm trường đó và ghi cảnh báo, thay vì làm hỏng cả dòng.
 */
const droppableFields: Readonly<Record<string, 'email' | 'phone'>> = Object.freeze({
  'user.email_already_in_use': 'email',
  'user.phone_already_in_use': 'phone',
});

const createUser = async (
  api: KyInstance,
  draft: DraftRow,
  sourceKey: string,
  dropped: ReadonlySet<'email' | 'phone'> = new Set()
): Promise<{ userId: string; warnings: string[] }> => {
  const { source } = draft;
  const email = dropped.has('email') ? undefined : draft.email;
  const phone = dropped.has('phone') ? undefined : draft.phone;
  // Tài khoản bị khoá ở hệ nguồn: không mang mật khẩu, để bước khoá có hỏng cũng không ai đăng nhập được.
  const digest = isSuspendedInSource(draft) ? undefined : source.passwordBcrypt;

  try {
    const user = await api
      .post('api/users', {
        json: {
          username: draft.username,
          name: source.fullName || draft.username,
          ...(email ? { primaryEmail: email } : {}),
          ...(phone ? { primaryPhone: phone } : {}),
          ...(digest ? { passwordDigest: digest, passwordAlgorithm: 'Bcrypt' } : {}),
          customData: { externalIds: { [sourceKey]: source.sourceAccountId } },
        },
      })
      .json<UserProfileResponse>();

    return {
      userId: user.id,
      warnings: [
        ...(dropped.has('email')
          ? [`Bỏ email "${draft.email ?? ''}": đã có người dùng trên IAM.`]
          : []),
        ...(dropped.has('phone')
          ? [`Bỏ số điện thoại "${draft.phone ?? ''}": đã có người dùng trên IAM.`]
          : []),
      ],
    };
  } catch (error: unknown) {
    const field = droppableFields[(await errorCodeOf(error)) ?? ''];
    if (field && !dropped.has(field)) {
      return createUser(api, draft, sourceKey, new Set([...dropped, field]));
    }
    throw error;
  }
};

/** Khoá (nếu cần), thêm vào tổ chức, gán chức danh cho một người đã có id. */
const grantAccess = async (
  api: KyInstance,
  draft: DraftRow,
  lookup: ImportLookup,
  userId: string
) => {
  // Chỉ khoá người do lượt nhập này tạo (kể cả lần chạy lại); người đã nhập trước giữ trạng thái IAM.
  if (!draft.existingUserId && isSuspendedInSource(draft)) {
    await api.patch(`api/users/${userId}/is-suspended`, { json: { isSuspended: true } });
  }

  const roleId = lookup.roleIdByCode.get(draft.role);
  for (const organization of draft.organizations) {
    // eslint-disable-next-line no-await-in-loop -- one membership must exist before its role is assigned
    await api.post(`api/organizations/${organization.id}/users`, { json: { userIds: [userId] } });
    if (roleId) {
      // eslint-disable-next-line no-await-in-loop -- same as above
      await api.post(`api/organizations/${organization.id}/users/${userId}/roles`, {
        json: { organizationRoleIds: [roleId] },
      });
    }
  }
};

/**
 * Ghi mã hệ nguồn lên người đã có. Đọc lại custom data ngay trước khi ghi (PATCH chỉ gộp ở cấp ngoài
 * cùng nên phải gửi đủ `externalIds`), và giữ luật 1–1: người đã mang mã khác của hệ này thì không ghi.
 */
const linkUser = async (api: KyInstance, userId: string, sourceKey: string, sourceId: string) => {
  const { customData } = await api.get(`api/users/${userId}`).json<UserProfileResponse>();
  const externalIds = externalIdsOf(customData);
  const current = externalIds[sourceKey];

  if (current && current !== sourceId) {
    throw new Error(
      `Người IAM này đã nối với tài khoản ${sourceKey} khác (${current}); không ghi đè.`
    );
  }

  await api.patch(`api/users/${userId}/custom-data`, {
    json: { customData: { externalIds: { ...externalIds, [sourceKey]: sourceId } } },
  });
};

type RunOptions = {
  api: KyInstance;
  lookup: ImportLookup;
  /** Người đã tạo ở lần chạy trước, theo số dòng. */
  createdUserIds: ReadonlyMap<number, string>;
  onProgress: (outcome: RowOutcome) => void;
};

const importRow = async (
  draft: DraftRow,
  { api, lookup, createdUserIds }: RunOptions
): Promise<RowOutcome> => {
  const base = {
    line: draft.source.line,
    username: draft.username,
    sourceAccountId: draft.source.sourceAccountId,
  };

  if (isLinking(draft)) {
    const userId = draft.match?.user.id;
    const linked = { ...base, action: 'link' as const, username: draft.match?.user.username ?? '' };
    if (!userId) {
      return { ...linked, ok: false, error: 'Không có người IAM nào để nối.' };
    }
    try {
      await linkUser(api, userId, lookup.source.key, draft.source.sourceAccountId);
      return { ...linked, ok: true, userId };
    } catch (error: unknown) {
      return { ...linked, ok: false, error: await errorMessageOf(error) };
    }
  }

  const action: RowOutcomeAction = draft.existingUserId ? 'update' : 'create';
  const knownUserId = createdUserIds.get(draft.source.line) ?? draft.existingUserId;

  const created = await (knownUserId
    ? { userId: knownUserId, warnings: [] }
    : createUser(api, draft, lookup.source.key).catch(async (error: unknown) => ({
        error: await errorMessageOf(error),
      })));

  if ('error' in created) {
    return { ...base, action, ok: false, error: created.error };
  }

  const { userId, warnings } = created;
  try {
    await grantAccess(api, draft, lookup, userId);
    return { ...base, action, ok: true, userId, warnings };
  } catch (error: unknown) {
    return {
      ...base,
      action,
      ok: false,
      createdUserId: userId,
      warnings,
      error: await errorMessageOf(error),
    };
  }
};

const chunk = <T>(items: readonly T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, (index + 1) * size)
  );

/** Chạy các dòng theo từng lô `concurrency` dòng; báo tiến độ sau mỗi dòng. */
export const runImport = async (
  drafts: readonly DraftRow[],
  options: RunOptions
): Promise<RowOutcome[]> =>
  chunk(drafts, concurrency).reduce<Promise<RowOutcome[]>>(
    async (previous, batch) => [
      ...(await previous),
      ...(await Promise.all(
        batch.map(async (draft) => {
          const outcome = await importRow(draft, options);
          options.onProgress(outcome);
          return outcome;
        })
      )),
    ],
    Promise.resolve([])
  );
