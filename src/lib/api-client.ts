/* Shared REST client for the `ไปด้วยกัน` backend (share-seets-be).
   The backend wraps successful payloads in `{ data }` and errors in
   `{ code, message, fieldErrors }` — see `docs/API_CONTRACT.md`. */

export interface ApiErrorShape {
  code?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

export class ApiError extends Error {
  code: string;
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(status: number, shape: ApiErrorShape = {}) {
    super(shape.message || `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.code = shape.code || "UNKNOWN";
    this.fieldErrors = shape.fieldErrors;
  }
}

export function apiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "http://localhost:4000";
}

const ACCESS_TOKEN_KEY = "pdk-access-token";

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    // Server-side render or unavailable storage — treat as logged out.
    return null;
  }
}

export function setAccessToken(token: string) {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // Ignore storage errors; API calls will just be unauthenticated.
  }
}

export function clearAccessToken() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // Ignore storage errors.
  }
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  const json = await parseJsonSafe(res);

  if (!res.ok) {
    const shape = (json ?? {}) as ApiErrorShape;
    throw new ApiError(res.status, shape);
  }

  // Backend convention: `{ data: ... }`. Fall back to raw body if unwrapped.
  if (json !== null && typeof json === "object" && "data" in (json as Record<string, unknown>)) {
    return (json as { data: T }).data;
  }
  return json as T;
}

export function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

export function toQuery(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
