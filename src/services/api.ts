const API_URLS = ['http://localhost:8080', 'http://10.40.28.92:8080'];

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  let lastError: Error | null = null;
  for (const baseUrl of API_URLS) {
    try {
      const response = await fetch(`${baseUrl}${path}`, options);
      if (!response.ok) {
        throw new Error(`API_ERROR_${response.status}`);
      }
      return (await response.json()) as Promise<T>;
    } catch (error) {
      lastError = error as Error;
      // Continua para a próxima URL da lista se houver erro de rede/conexão
    }
  }
  throw lastError || new Error('API_ERROR_CONNECTION_FAILED');
}
