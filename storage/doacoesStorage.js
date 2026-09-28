import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@instituto_mao_amiga:doacoes';
const STORAGE_RASCUNHO = '@instituto_mao_amiga:rascunho';

// Lista todas as doações salvas
export async function listarDoacoes() {
  try {
    const dados = await AsyncStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error('Erro ao listar doações:', error);
    return [];
  }
}

// Salva uma nova doação
export async function salvarDoacao(doacao) {
  try {
    const doacoesAtuais = await listarDoacoes();

    const novaDoacao = {
      id: String(new Date().getTime()),
      tipoItem: doacao.tipoItem,
      quantidade: doacao.quantidade,
      pontoDestino: doacao.pontoDestino,
      criadoEm: new Date().toISOString(),
    };

    const doacoesAtualizadas = [novaDoacao, ...doacoesAtuais];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(doacoesAtualizadas));
  } catch (error) {
    console.error('Erro ao salvar doação:', error);
  }
}

// GERENCIAMENTO DE RASCUNHOS
export async function salvarRascunho(rascunho) {
  try {
    await AsyncStorage.setItem(STORAGE_RASCUNHO, JSON.stringify(rascunho));
  } catch (error) {
    console.error('Erro ao salvar o rascunho:', error);
  }
}

export async function carregarRascunho() {
  try {
    const dados = await AsyncStorage.getItem(STORAGE_RASCUNHO);
    return dados ? JSON.parse(dados) : null;
  } catch (error) {
    console.error('Erro ao carregar o rascunho:', error);
    return null;
  }
}

export async function limparRascunho() {
  try {
    await AsyncStorage.removeItem(STORAGE_RASCUNHO);
  } catch (error) {
    console.error('Erro ao limpar o rascunho:', error);
  }
}
