import type { PageResponse } from '../types/api';
import type { Ponto, PontoRequest } from '../types/ponto';
import { del, get, post, put } from './api';

const TAMANHO_PAGINA = 10;

export function listarPontos(): Promise<PageResponse<Ponto>> {
  return buscarPaginaPontos(0, TAMANHO_PAGINA, '');
}

export function listarTodosPontos(): Promise<Ponto[]> {
  return get<Ponto[]>('/pontos');
}

export function buscarPaginaPontos(
  page = 0,
  size = TAMANHO_PAGINA,
  filtro = '',
): Promise<PageResponse<Ponto>> {
  const params = new URLSearchParams({
    filtro: filtro.trim(),
    page: String(page),
    size: String(size),
  });

  return get<PageResponse<Ponto>>(`/pontos/filtro?${params.toString()}`);
}

export function buscarPontoPorId(id: string): Promise<Ponto> {
  return get<Ponto>(`/pontos/${encodeURIComponent(id)}`);
}

export function cadastrarPonto(dados: PontoRequest): Promise<Ponto> {
  return post<Ponto>('/pontos', dados);
}

export function editarPonto(id: string, dados: PontoRequest): Promise<Ponto> {
  return put<Ponto>(`/pontos/${encodeURIComponent(id)}`, dados);
}

export function excluirPonto(id: string): Promise<void> {
  return del<void>(`/pontos/${encodeURIComponent(id)}`);
}
