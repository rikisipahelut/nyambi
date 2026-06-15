const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://nyambi.test/api";
const TOKEN_KEY = "nyambi_token";

let _token: string | null = null;

export function setAccessToken(token: string | null) {
  _token = token;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export function loadStoredToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (_token) headers["Authorization"] = `Bearer ${_token}`;

  const res = await fetch(`${BASE}${endpoint}`, { ...options, headers });

  // Token expired — try silent refresh once using current token
  if (res.status === 401 && retry && _token) {
    const refreshed = await tryRefresh();
    if (refreshed) return request<T>(endpoint, options, false);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // Laravel error format: { error: { code, message } } or { message }
    const msg = body?.error?.message ?? body?.message ?? `HTTP ${res.status}`;
    throw new ApiError(res.status, msg);
  }

  if (res.status === 204) return {} as T;
  return res.json() as Promise<T>;
}

// JWT refresh: send current token in Authorization header
async function tryRefresh(): Promise<boolean> {
  if (!_token) return false;
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${_token}`,
      },
    });
    if (!res.ok) { setAccessToken(null); return false; }
    const data = await res.json();
    setAccessToken(data.access_token);
    return true;
  } catch {
    setAccessToken(null);
    return false;
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = {
  get:    <T>(url: string)               => request<T>(url),
  post:   <T>(url: string, body?: unknown) => request<T>(url, { method: "POST",   body: JSON.stringify(body) }),
  put:    <T>(url: string, body?: unknown) => request<T>(url, { method: "PUT",    body: JSON.stringify(body) }),
  delete: <T>(url: string)               => request<T>(url, { method: "DELETE" }),
};
