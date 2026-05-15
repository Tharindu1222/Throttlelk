export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function apiFetch(
  path: string,
  init?: RequestInit & { token?: string | null },
): Promise<Response> {
  const headers = new Headers(init?.headers);
  const body = init?.body;
  if (
    body &&
    typeof body === 'string' &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }
  const token = init?.token;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const { token: _omit, ...rest } = init ?? {};
  return fetch(`${API_BASE.replace(/\/$/, '')}${path}`, {
    ...rest,
    headers,
  });
}
