// URLs de fallback para testar localhost (web) ou IP da rede local (celular)
const API_URLS = [
  'http://localhost:8080/api/v1',
  'http://10.40.28.92:8080/api/v1',
];

export class ApiError extends Error {
  constructor(public readonly status: number) {
    super(`API_ERROR_${status}`);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let lastError: Error | null = null;
  let response: Response | null = null;

  for (const baseUrl of API_URLS) {
    try {
      response = await fetch(`${baseUrl}${path}`, options);
      // Se a requisição obteve resposta da API (mesmo que 400 ou 404), interrompe o loop
      if (response) {
        break;
      }
    } catch {
      // Falha de rede/conexão com essa URL, tenta a próxima do array
    }
  }

  if (!response) {
    throw new Error('API_CONNECTION_ERROR');
  }

  if (!response.ok) {
    throw new ApiError(response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function get<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export function put<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export function del<T = void>(path: string): Promise<T> {
  return request<T>(path, { method: 'DELETE' });
}
