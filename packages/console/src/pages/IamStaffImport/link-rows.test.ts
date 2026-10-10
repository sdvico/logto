import { userIndexesOf } from './lookup';
import {
  type DraftRow,
  checkRows,
  draftFromRow,
  hasBlockingIssue,
  parseStaffFile,
} from './staff-rows';
import { codesOf, fileOf, lookup, reviewOf } from './test-fixtures';

/** Dòng như người duyệt bấm "Nối vào người đã có". */
const linkOf = (draft: DraftRow) => checkRows([{ ...draft, action: 'link' }], lookup)[0]!;

describe('linking to an existing IAM user', () => {
  it('links by default on a username match, keeping orgs and roles out of the review', () => {
    const [draft] = reviewOf({ account_id: 'a1', username: 'taken', units: 'KN_VUNG' });

    expect(draft?.action).toBe('link');
    expect(draft?.match?.user.id).toBe('user-taken');
    expect(draft?.match?.reasons).toEqual(['username']);
    expect(codesOf(draft!)).toEqual(['LINK_MATCHED']);
    expect(draft?.issues[0]?.message).toContain('đã nối iuu');
  });

  it('only suggests a match by email or phone, and warns when the reviewer links it', () => {
    const [draft] = reviewOf({
      account_id: 'a1',
      username: 'new_name',
      email: 'used@example.com',
      units: 'CHI_CUC:22',
      password_bcrypt: 'x',
    });

    expect(draft?.action).toBe('create');
    expect(codesOf(linkOf(draft!))).toEqual([
      'LINK_MATCHED',
      'LINK_WITHOUT_USERNAME',
      'LINK_NOT_IN_SYNC',
    ]);
  });

  it('blocks linking when the email belongs to several IAM users', () => {
    const [draft] = reviewOf({ account_id: 'a1', username: 'x', email: 'shared@example.com' });

    expect(draft?.match?.isAmbiguous).toBe(true);
    expect(hasBlockingIssue(linkOf(draft!))).toBe(true);
    expect(codesOf(linkOf(draft!))).toContain('LINK_AMBIGUOUS');
  });

  it('blocks linking a user who already carries another account of the same system', () => {
    const [draft] = reviewOf({ account_id: 'a1', username: 'linked' });

    expect(codesOf(draft!)).toContain('LINK_TAKEN');
    expect(hasBlockingIssue(draft!)).toBe(true);
  });

  it('blocks two rows linking to the same IAM user', () => {
    const [first, second] = reviewOf(
      { account_id: 'a1', username: 'taken' },
      { account_id: 'a2', username: 'x', email: 'shared@example.com' }
    );
    const [linkedFirst] = checkRows(
      [first!, { ...second!, action: 'link', match: first!.match }],
      lookup
    );

    expect(codesOf(linkedFirst!)).toContain('LINK_DUPLICATE_IN_FILE');
  });

  it('blocks a source id that already sits on several IAM users', () => {
    const [draft] = reviewOf({ account_id: 'dup-mkn', username: 'whoever' });

    expect(codesOf(draft!)).toContain('SOURCE_ID_ON_MANY_USERS');
    expect(hasBlockingIssue(draft!)).toBe(true);
  });

  it('does not auto-link when two IAM users share the username in different case', () => {
    const caseLookup = {
      ...lookup,
      ...userIndexesOf(
        [
          { id: 'u-1', name: 'A', username: 'Same', externalIds: {}, isInSync: true },
          { id: 'u-2', name: 'B', username: 'same', externalIds: {}, isInSync: true },
        ],
        'mkn'
      ),
    };
    const [row] = parseStaffFile(fileOf({ account_id: 'a1', username: 'same' })).rows;
    const [draft] = checkRows([draftFromRow(row!, caseLookup)], caseLookup);

    expect(draft?.match?.isAmbiguous).toBe(true);
    expect(codesOf(draft!)).toContain('LINK_AMBIGUOUS');
  });
});

describe('checkRows', () => {
  it('keeps the same row object when nothing changed, so cards do not re-render', () => {
    const drafts = reviewOf(
      { account_id: 'a1', username: 'x' },
      { account_id: 'a2', username: 'y' }
    );
    const again = checkRows(drafts, lookup);

    expect(again[0]).toBe(drafts[0]);
    expect(again[1]).toBe(drafts[1]);
  });

  it('treats a lowercase active status as active', () => {
    const [draft] = reviewOf({ account_id: 'a1', username: 'x', status: 'active' });

    expect(codesOf(draft!)).not.toContain('SUSPENDED');
  });
});
