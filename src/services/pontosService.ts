import type { PageResponse } from '../types/api';
import type { Ponto } from '../types/ponto';
import { apiFetch } from './api';

export function listarPontos(page = 0, size = 20): Promise<PageResponse<Ponto>> {
  const pageSize = Math.min(Math.max(size, 1), 50);
  const params = new URLSearchParams({
    page: String(page),
    size: String(pageSize),
    sort: 'nome,asc',
  });

  return apiFetch<PageResponse<Ponto>>(`/pontos?${params.toString()}`);
}

export function buscarPontoPorId(id: string): Promise<Ponto> {
  return apiFetch<Ponto>(`/pontos/${encodeURIComponent(id)}`);
}