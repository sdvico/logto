import { type JsonObject } from '@logto/schemas';
import { generateStandardId } from '@logto/shared/universal';
import { object, string, z } from 'zod';

import RequestError from '#src/errors/RequestError/index.js';
import koaGuard from '#src/middleware/koa-guard.js';
import assertThat from '#src/utils/assert-that.js';
import { ssrfProtectedFetch } from '#src/utils/outbound-request.js';

import type PermissionAuditSnapshotQueries from '../queries/permission-audit-snapshots.js';

import type { ManagementApiRouter, RouterInitArgs } from './types.js';

/**
 * sdvico: audit quyen han cua tung ung dung nghiep vu (IUU/MKN/CBVMS) — CHỈ ĐỌC/QUAN SÁT.
 * KHÔNG bao giờ ghi vào organization_scopes/organization_roles thật. App không cần đăng ký/khai
 * báo gì trước — IAM chỉ cần biết URL manifest của app (lưu ở applications.custom_data) và tự
 * gọi ra định kỳ (hoặc gọi thủ công qua route bên dưới), lưu lại nguyên trạng mỗi lần lấy được.
 * Xem docs/permission-manifest-sync-design.md.
 */

const FETCH_TIMEOUT_MS = 10_000;

const manifestPayloadGuard = object({
  app: string(),
  organizations: z.array(z.record(z.unknown())).optional().default([]),
  roles: z.array(z.record(z.unknown())).optional().default([]),
  scopes: z.array(z.record(z.unknown())).optional().default([]),
  permissions: z.array(z.record(z.unknown())).optional().default([]),
});

const getPermissionAuditConfig = (customData: unknown) => {
  if (typeof customData !== 'object' || customData === null) {
    return undefined;
  }

  const { permissionAudit } = customData as Record<string, unknown>;

  if (typeof permissionAudit !== 'object' || permissionAudit === null) {
    return undefined;
  }

  const { manifestUrl, apiKey } = permissionAudit as Record<string, unknown>;

  return typeof manifestUrl === 'string'
    ? { manifestUrl, apiKey: typeof apiKey === 'string' ? apiKey : undefined }
    : undefined;
};

/** So sanh nong 2 payload (deep, khong quan tam thu tu key) de biet co doi gi khong. */
const isSamePayload = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export default function permissionAuditRoutes<T extends ManagementApiRouter>(
  ...[router, tenant]: RouterInitArgs<T>
) {
  const { queries } = tenant;
  const { applications, permissionAuditSnapshots } = queries;

  /**
   * Chạy audit ngay cho 1 app (thủ công, thay vì chờ lịch định kỳ). Yêu cầu app đã có
   * `custom_data.permissionAudit.manifestUrl` — xem docs/permission-manifest-sync-design.md mục 3.
   */
  router.post(
    '/permission-audit/:applicationId/run',
    koaGuard({
      params: object({ applicationId: string() }),
      status: [200, 400, 404],
    }),
    async (ctx, next) => {
      const { applicationId } = ctx.guard.params;
      const application = await applications.findApplicationById(applicationId);

      const config = getPermissionAuditConfig(application.customData);
      assertThat(
        config,
        new RequestError({
          code: 'entity.not_found',
          status: 400,
          message: `Application "${applicationId}" chưa cấu hình custom_data.permissionAudit.manifestUrl.`,
        })
      );

      const snapshot = await runAudit({
        applicationId,
        manifestUrl: config.manifestUrl,
        apiKey: config.apiKey,
        permissionAuditSnapshots,
      });

      ctx.body = snapshot;
      ctx.status = 200;

      return next();
    }
  );

  /** Xem lại lịch sử snapshot đã lấy được của 1 app, mới nhất trước. Chỉ đọc. */
  router.get(
    '/permission-audit/:applicationId/snapshots',
    koaGuard({
      params: object({ applicationId: string() }),
      status: [200],
    }),
    async (ctx, next) => {
      const { applicationId } = ctx.guard.params;
      const snapshots = await permissionAuditSnapshots.findByApplicationId(applicationId);

      ctx.body = { data: snapshots };

      return next();
    }
  );
}

type RunAuditArgs = {
  applicationId: string;
  manifestUrl: string;
  apiKey?: string;
  permissionAuditSnapshots: PermissionAuditSnapshotQueries;
};

/**
 * Gọi ra manifest URL của app, lưu lại nguyên trạng thành 1 snapshot mới, so với snapshot gần
 * nhất trước đó của cùng app để đánh dấu `changedFromPrevious`. KHÔNG đụng organization_scopes.
 */
export const runAudit = async ({
  applicationId,
  manifestUrl,
  apiKey,
  permissionAuditSnapshots,
}: RunAuditArgs) => {
  const previous = await permissionAuditSnapshots.findLatestByApplicationId(applicationId);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, FETCH_TIMEOUT_MS);

    const response = await ssrfProtectedFetch(manifestUrl, {
      headers: apiKey ? { authorization: `Bearer ${apiKey}` } : {},
      signal: controller.signal,
    }).finally(() => {
      clearTimeout(timeout);
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = manifestPayloadGuard.parse(await response.json());
    const changedFromPrevious = previous ? !isSamePayload(previous.payload, payload) : false;

    return permissionAuditSnapshots.insert({
      id: generateStandardId(),
      applicationId,
      payload: payload as JsonObject,
      changedFromPrevious,
      error: null,
    });
  } catch (error: unknown) {
    return permissionAuditSnapshots.insert({
      id: generateStandardId(),
      applicationId,
      payload: {},
      changedFromPrevious: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
