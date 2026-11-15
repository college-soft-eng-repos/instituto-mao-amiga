import type { PageResponse } from '../types/api';
import type { Doacao, NovaDoacao } from '../types/doacao';
import { del, get, post, put } from './api';

const TAMANHO_PAGINA = 10;

export function listarDoacoes(
  page = 0,
  size = TAMANHO_PAGINA,
  filtro = '',
): Promise<PageResponse<Doacao>> {
  const params = new URLSearchParams({
    filtro: filtro.trim(),
    page: String(page),
    size: String(size),
  });

  return get<PageResponse<Doacao>>(`/doacoes/filtro?${params.toString()}`);
}

export function buscarDoacaoPorId(id: string): Promise<Doacao> {
  return get<Doacao>(`/doacoes/${encodeURIComponent(id)}`);
}

export function cadastrarDoacao(dados: NovaDoacao): Promise<Doacao> {
  return post<Doacao>('/doacoes', dados);
}

export function editarDoacao(id: string, dados: NovaDoacao): Promise<Doacao> {
  return put<Doacao>(`/doacoes/${encodeURIComponent(id)}`, dados);
}

export function excluirDoacao(id: string): Promise<void> {
  return del<void>(`/doacoes/${encodeURIComponent(id)}`);
}
