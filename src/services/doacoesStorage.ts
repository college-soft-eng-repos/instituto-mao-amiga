import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Doacao, NovaDoacao, RascunhoDoacao } from '../types/doacao';

const STORAGE_KEY = '@instituto_mao_amiga:doacoes';
const STORAGE_RASCUNHO = '@instituto_mao_amiga:rascunho';

export async function listarDoacoes(): Promise<Doacao[]> {
  try {
    const dados = await AsyncStorage.getItem(STORAGE_KEY);
    if (!dados) {
      return [];
    }

    const valor: unknown = JSON.parse(dados);
    return Array.isArray(valor) ? (valor as Doacao[]) : [];
  } catch (error) {
    console.error('Erro ao listar doações:', error);
    return [];
  }
}

export async function salvarDoacao(doacao: NovaDoacao): Promise<void> {
  try {
    const doacoesAtuais = await listarDoacoes();
    const novaDoacao: Doacao = {
      id: String(new Date().getTime()),
      ...doacao,
      criadoEm: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([novaDoacao, ...doacoesAtuais]),
    );
  } catch (error) {
    console.error('Erro ao salvar doação:', error);
  }
}

export async function excluirDoacao(idParaExcluir: string): Promise<Doacao[]> {
  const doacoesAtuais = await listarDoacoes();
  const doacoesFiltradas = doacoesAtuais.filter(
    (item) => String(item.id) !== String(idParaExcluir),
  );

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(doacoesFiltradas));
  return doacoesFiltradas;
}

export async function atualizarDoacao(doacaoAtualizada: Doacao): Promise<Doacao[]> {
  const doacoesAtuais = await listarDoacoes();
  const doacoesAtualizadas = doacoesAtuais.map((item) =>
    String(item.id) === String(doacaoAtualizada.id) ? doacaoAtualizada : item,
  );

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(doacoesAtualizadas));
  return doacoesAtualizadas;
}

export async function salvarRascunho(rascunho: RascunhoDoacao): Promise<void> {
  await AsyncStorage.setItem(STORAGE_RASCUNHO, JSON.stringify(rascunho));
}

export async function carregarRascunho(): Promise<RascunhoDoacao | null> {
  const dados = await AsyncStorage.getItem(STORAGE_RASCUNHO);
  if (!dados) {
    return null;
  }

  return JSON.parse(dados) as RascunhoDoacao;
}

export async function limparRascunho(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_RASCUNHO);
}