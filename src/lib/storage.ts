export function resolveStorageUrl(url: string | null | undefined): string {
  if (!url) return "";
  try {
    const apiOrigin = new URL(process.env.NEXT_PUBLIC_API_URL ?? "").origin;
    const { pathname } = new URL(url);
    return `${apiOrigin}${pathname}`;
  } catch {
    return url;
  }
}
