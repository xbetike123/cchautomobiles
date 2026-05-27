// URL helpers for admin pages. Server components compose hrefs by merging
// updates into the current search params without losing other filters.

export type ParamUpdate = Record<string, string | null | undefined>;

export function buildHref(
  basePath: string,
  current: URLSearchParams | Record<string, string | undefined>,
  update: ParamUpdate,
): string {
  const params =
    current instanceof URLSearchParams
      ? new URLSearchParams(current)
      : new URLSearchParams(
          Object.entries(current).reduce<Record<string, string>>(
            (acc, [k, v]) => {
              if (v) acc[k] = v;
              return acc;
            },
            {},
          ),
        );
  for (const [key, value] of Object.entries(update)) {
    if (value === null || value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
