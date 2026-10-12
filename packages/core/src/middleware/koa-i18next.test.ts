import resources from '@logto/phrases';

import RequestError from '#src/errors/RequestError/index.js';
import initI18n from '#src/i18n/init.js';
import { i18next } from '#src/utils/i18n.js';
import { createContextWithRouteParameters } from '#src/utils/test-utils.js';

import koaI18next from './koa-i18next.js';

const { jest } = import.meta;

describe('koaI18next', () => {
  const next = jest.fn();

  beforeAll(async () => {
    await initI18n();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // The phrases package ships only `en` and `vi-VN`.
  it.each([
    ['vi', 'vi-VN'],
    ['vi-VN', 'vi-VN'],
    ['vi-vn', 'vi-VN'],
    ['en;q=0.5,vi;q=0.9', 'vi-VN'],
    ['vi;q=0.5,en;q=0.9', 'en'],
    ['xx-XX,vi;q=0.9', 'vi-VN'],
    ['fr-CA', 'en'],
    ['xx-XX', 'en'],
    ['*', 'en'],
    ['', 'en'],
  ] as const)('localizes API errors for Accept-Language %s to %s', async (language, expected) => {
    const ctx = {
      ...createContextWithRouteParameters({ headers: { 'accept-language': language } }),
      query: {},
    };

    await koaI18next()(ctx, next);

    expect(ctx.locale).toEqual(expected);
    expect(new RequestError('session.not_found').toBody(ctx.i18n)).toMatchObject({
      code: 'session.not_found',
      message: resources[expected].errors?.session?.not_found,
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('prioritizes the locale query over Accept-Language', async () => {
    const ctx = {
      ...createContextWithRouteParameters({ headers: { 'accept-language': 'en' } }),
      query: { locale: 'vi' },
    };

    await koaI18next()(ctx, next);

    expect(ctx.locale).toEqual('vi-VN');
  });

  it('keeps the language scoped to each request', async () => {
    const vietnameseContext = {
      ...createContextWithRouteParameters({ headers: { 'accept-language': 'vi' } }),
      query: {},
    };
    const englishContext = {
      ...createContextWithRouteParameters({ headers: { 'accept-language': 'en-US' } }),
      query: {},
    };

    await koaI18next()(vietnameseContext, next);
    await koaI18next()(englishContext, next);

    expect(vietnameseContext.i18n.language).toEqual('vi-VN');
    expect(englishContext.i18n.language).toEqual('en');
    expect(vietnameseContext.i18n).not.toBe(englishContext.i18n);
    expect(vietnameseContext.i18n).not.toBe(i18next);
    expect(i18next.language).toEqual('en');
  });
});
