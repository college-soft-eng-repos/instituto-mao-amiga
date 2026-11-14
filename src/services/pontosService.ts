import type { PageResponse } from '../types/api';
import type { Ponto } from '../types/ponto';
import { apiFetch } from './api';

export function listarPontos(
  page = 0,
  size = 20,
  filtro = '',
): Promise<PageResponse<Ponto>> {
  const pageSize = Math.min(Math.max(size, 1), 50);
  const params = new URLSearchParams({
    filtro: filtro,
    page: String(page),
    size: String(pageSize),
    sort: 'nome,asc',
  });

  // Alterado de /pontos para /pontos/filtro para corresponder ao Page do Spring Boot
  return apiFetch<PageResponse<PontoApi>>(
    `/pontos/filtro?${params.toString()}`,
  ).then((pagina) => ({
    ...pagina,
    content: pagina.content.map(normalizarPonto),
  }));
}

export function buscarPontoPorId(id: string): Promise<Ponto> {
  return apiFetch<PontoApi>(`/pontos/${encodeURIComponent(id)}`).then(
    normalizarPonto,
  );
}

type PontoApi = Omit<Ponto, 'id'> & { id: string | number };

function normalizarPonto(ponto: PontoApi): Ponto {
  return {
    ...ponto,
    id: String(ponto.id),
  };
}
