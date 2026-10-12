import { LogResult } from '@logto/schemas';
import { generateStandardId } from '@logto/shared';
import type { Context } from 'koa';

import RequestError from '#src/errors/RequestError/index.js';
import type Queries from '#src/tenants/Queries.js';
import assertThat from '#src/utils/assert-that.js';

import { getCallerClientId } from './auth.js';

const actorHeader = 'x-iam-actor';
const actorIdHeader = 'x-iam-actor-id';
const maxActorLength = 128;

type Actor = { username: string; id?: string };

/** Header chỉ nhận ASCII nên bên gọi gửi `encodeURIComponent(...)`; giải mã hỏng thì giữ nguyên. */
const decodeHeader = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const readHeader = (ctx: Context, name: string) => {
  const value = decodeHeader(ctx.get(name)).trim();
  return value.length > 0 ? value.slice(0, maxActorLength) : undefined;
};

/**
 * Người thao tác bên hệ gọi (vd tài khoản CBVMS), bắt buộc ở mọi lệnh ghi. `X-Iam-Actor-Id` không
 * bắt buộc. Xem docs/iam-admin-api-design.md mục 1.
 */
export const getActor = (ctx: Context): Actor => {
  const username = readHeader(ctx, actorHeader);

  assertThat(
    username,
    new RequestError({ code: 'guard.invalid_input', status: 400, type: 'header X-Iam-Actor' })
  );

  const id = readHeader(ctx, actorIdHeader);
  return id ? { username, id } : { username };
};

type IamAdminAction =
  | 'User.Create'
  | 'User.Update'
  | 'User.Suspend'
  | 'User.Unsuspend'
  | 'User.ResetPassword'
  | 'User.Delete'
  | 'User.SetOrganizationRoles'
  | 'User.LeaveOrganization'
  | 'System.Create'
  | 'System.Delete';

/**
 * Ghi một dòng `logs` với key `IamAdmin.<action>`, app gọi và người thao tác. Handler đọc `actor`
 * bằng `getActor` TRƯỚC khi ghi dữ liệu, để thiếu header thì không có gì bị đổi.
 */
export const writeIamAdminLog = async (
  queries: Queries,
  ctx: Context,
  {
    actor,
    action,
    payload,
  }: { actor: Actor; action: IamAdminAction; payload: Record<string, unknown> }
) => {
  const key = `IamAdmin.${action}`;

  await queries.logs.insertLog({
    id: generateStandardId(),
    key,
    payload: {
      key,
      result: LogResult.Success,
      applicationId: getCallerClientId(ctx),
      actor,
      ...payload,
    },
  });
};
