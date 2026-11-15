import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_FAVORITOS = '@instituto-mao-amiga/pontos-favoritos';
let filaDeAtualizacao: Promise<void> = Promise.resolve();

export async function listarIdsFavoritos(): Promise<string[]> {
  const valor = await AsyncStorage.getItem(CHAVE_FAVORITOS);
  if (!valor) return [];

  try {
    const ids: unknown = JSON.parse(valor);
    return Array.isArray(ids)
      ? ids.filter((id): id is string => typeof id === 'string')
      : [];
  } catch {
    return [];
  }
}

export async function salvarIdsFavoritos(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(
    CHAVE_FAVORITOS,
    JSON.stringify([...new Set(ids)]),
  );
}

function atualizarIdsFavoritos(
  atualizar: (ids: string[]) => string[],
): Promise<void> {
  filaDeAtualizacao = filaDeAtualizacao
    .catch(() => undefined)
    .then(async () => {
      const ids = await listarIdsFavoritos();
      await salvarIdsFavoritos(atualizar(ids));
    });
  return filaDeAtualizacao;
}

export function adicionarFavorito(id: string): Promise<void> {
  return atualizarIdsFavoritos((ids) =>
    ids.includes(id) ? ids : [...ids, id],
  );
}

export function removerFavorito(id: string): Promise<void> {
  return atualizarIdsFavoritos((ids) =>
    ids.filter((favoritoId) => favoritoId !== id),
  );
}

export function removerFavoritos(idsParaRemover: string[]): Promise<void> {
  const removidos = new Set(idsParaRemover);
  return atualizarIdsFavoritos((ids) => ids.filter((id) => !removidos.has(id)));
}
