export const API_URL = 'http://10.40.28.92:8080';

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(`API_ERROR_${response.status}`);
  }

  return response.json() as Promise<T>;
}