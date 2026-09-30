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

// Exclui uma doação
export async function excluirDoacao(idParaExcluir) {
  try {
    const doacoesAtuais = await listarDoacoes();

    const doacoesFiltradas = doacoesAtuais.filter(
      (item) => String(item.id) !== String(idParaExcluir),
    );

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(doacoesFiltradas));
    return doacoesFiltradas;
  } catch (error) {
    throw error;
  }
}

// Atualiza uma doação existente
export async function atualizarDoacao(doacaoAtualizada) {
  try {
    const doacoesAtuais = await listarDoacoes();
    const doacoesAtualizadas = doacoesAtuais.map((item) =>
      String(item.id) === String(doacaoAtualizada.id) ? doacaoAtualizada : item,
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(doacoesAtualizadas));
    return doacoesAtualizadas;
  } catch (error) {
    console.error('Erro ao atualizar doação:', error);
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
