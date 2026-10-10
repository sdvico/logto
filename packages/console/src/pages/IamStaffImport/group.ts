/**
 * SDVICO: gom theo khoá trong một lượt (O(n)). Bản `reduce` sao chép cả Map ở mỗi phần tử thành O(n²),
 * chậm rõ khi tệp, danh sách người dùng tới hàng nghìn dòng.
 */

/** Khoá → các id mang khoá đó; khoá trống bỏ qua. */
export const groupIds = (entries: ReadonlyArray<readonly [string | undefined, string]>) => {
  const index = new Map<string, string[]>();
  for (const [key, id] of entries) {
    if (key) {
      index.set(key, [...(index.get(key) ?? []), id]);
    }
  }
  return index;
};

/** Khoá → số lần xuất hiện; khoá trống bỏ qua. */
export const countKeys = (keys: readonly string[]) => {
  const count = new Map<string, number>();
  for (const key of keys) {
    if (key) {
      count.set(key, (count.get(key) ?? 0) + 1);
    }
  }
  return count;
};
