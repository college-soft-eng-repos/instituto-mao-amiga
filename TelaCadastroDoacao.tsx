import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from './App';
import { pontosMock } from './TelaListaPontos';
import { useConteudoResponsivo } from './useConteudoResponsivo';
import { 
  salvarDoacao, 
  listarDoacoes, 
  atualizarDoacao, 
  carregarRascunho, 
  salvarRascunho, 
  limparRascunho 
} from './storage/doacoesStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroDoacao'>;

export default function TelaCadastroDoacao({ route, navigation }: Props) {
  const { conteudoStyle } = useConteudoResponsivo();
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestinoId, setPontoDestinoId] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(true);
  
  const inputQuantidadeRef = useRef<TextInput>(null);
  
  // Captura o ID da doação se veio pela navegação de detalhe
  const doacaoId = route.params?.doacaoId;
  const [isEdicao, setIsEdicao] = useState(false);
  const [criadoEmOriginal, setCriadoEmOriginal] = useState<string | null>(null);

  // Inicialização: Se for edição, busca os dados. Se for novo, tenta carregar o rascunho.
  useEffect(() => {
    async function inicializarTela() {
      try {
        if (doacaoId) {
          setIsEdicao(true);
          const lista = await listarDoacoes();
          const encontrada = lista.find((item: any) => String(item.id) === String(doacaoId));
          if (encontrada) {
            setTipoItem(encontrada.tipoItem || '');
            setQuantidade(String(encontrada.quantidade || ''));
            setCriadoEmOriginal(encontrada.criadoEm);
            
            // Encontra o ID do ponto pelo nome salvo
            const pontoEncontrado = pontosMock.find((p) => p.nome === encontrada.pontoDestino);
            if (pontoEncontrado) {
              setPontoDestinoId(pontoEncontrado.id);
            }
          }
        } else {
          // Apenas carrega rascunho se for criação nova
          const rascunho = await carregarRascunho();
          if (rascunho) {
            setTipoItem(rascunho.tipoItem || '');
            setQuantidade(rascunho.quantidade || '');
            setPontoDestinoId(rascunho.pontoDestinoId || '');
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar formulário:', error);
      } finally {
        setCarregando(false);
      }
    }
    inicializarTela();
  }, [doacaoId]);

  // Salva rascunho automaticamente apenas se NÃO estiver no modo edição
  useEffect(() => {
    if (carregando || isEdicao) return;

    async function persistirRascunho() {
      await salvarRascunho({ tipoItem, quantidade, pontoDestinoId });
    }
    persistirRascunho();
  }, [tipoItem, quantidade, pontoDestinoId, carregando, isEdicao]);

  async function validarESalvar() {
    setSucesso('');

    if (tipoItem.trim() === '') {
      setErro('Informe o tipo do item (ex.: arroz, roupa, leite).');
      return;
    }

    const quantidadeNumerica = Number(quantidade.trim());
    if (
      quantidade.trim() === '' ||
      isNaN(quantidadeNumerica) ||
      !Number.isInteger(quantidadeNumerica) ||
      quantidadeNumerica < 1
    ) {
      setErro('A quantidade precisa ser um número inteiro maior que zero.');
      return;
    }

    if (pontoDestinoId === '') {
      setErro('Selecione o ponto de destino da doação.');
      return;
    }

    const ponto = pontosMock.find((p) => p.id === pontoDestinoId);
    const nomePontoDestino = ponto?.nome ?? 'Ponto não especificado';

    try {
      if (isEdicao && doacaoId) {
        // Atualiza a doação existente mantendo o ID e a data de criação original
        await atualizarDoacao({
          id: doacaoId,
          tipoItem: tipoItem.trim(),
          quantidade: quantidadeNumerica,
          pontoDestino: nomePontoDestino,
          criadoEm: criadoEmOriginal || new Date().toISOString(),
        });
        
        Keyboard.dismiss();
        navigation.goBack();
      } else {
        // Salva nova doação
        await salvarDoacao({
          tipoItem: tipoItem.trim(),
          quantidade: quantidadeNumerica,
          pontoDestino: nomePontoDestino,
        });

        setErro('');
        setSucesso(
          `Doação registrada: ${quantidadeNumerica}x ${tipoItem.trim()} → ${nomePontoDestino}.`
        );
        
        setTipoItem('');
        setQuantidade('');
        setPontoDestinoId('');
        Keyboard.dismiss();

        await limparRascunho();
      }
    } catch (error) {
      console.error('Erro ao salvar/atualizar a doação:', error);
      setErro('Erro ao processar a doação.');
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.conteudo, conteudoStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Título dinâmico conforme critério de aceite */}
          <Text style={styles.titulo}>
            {isEdicao ? 'Editar doação' : 'Cadastrar doação'}
          </Text>

          <Text style={styles.rotulo}>Tipo do item</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: arroz, roupa, leite"
            placeholderTextColor="#888888"
            value={tipoItem}
            onChangeText={setTipoItem}
            returnKeyType="next"
            onSubmitEditing={() => inputQuantidadeRef.current?.focus()}
          />

          <Text style={styles.rotulo}>Quantidade</Text>
          <TextInput
            ref={inputQuantidadeRef}
            style={styles.input}
            placeholder="Ex.: 10"
            placeholderTextColor="#888888"
            value={quantidade}
            onChangeText={setQuantidade}
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={validarESalvar}
          />

          <Text style={styles.rotulo}>Ponto de destino</Text>
          {pontosMock.map((ponto) => (
            <TouchableOpacity
              key={ponto.id}
              style={[
                styles.pontoOpcao,
                pontoDestinoId === ponto.id && styles.pontoSelecionado,
              ]}
              onPress={() => setPontoDestinoId(ponto.id)}
            >
              <Text
                style={[
                  styles.pontoNome,
                  pontoDestinoId === ponto.id && styles.pontoNomeSelecionado,
                ]}
              >
                {ponto.nome}
              </Text>
            </TouchableOpacity>
          ))}

          {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
          {sucesso !== '' && <Text style={styles.sucesso}>{sucesso}</Text>}

          <TouchableOpacity style={styles.botao} onPress={validarESalvar}>
            <Text style={styles.botaoTexto}>
              {isEdicao ? 'Salvar alterações' : 'Registrar doação'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.botaoSecundarioTexto}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  conteudo: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 20,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FFFFFF',
    minHeight: 44,
  },
  pontoOpcao: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  pontoSelecionado: {
    borderColor: '#1B3A5C',
    backgroundColor: '#E8EEF4',
  },
  pontoNome: {
    fontSize: 14,
    color: '#333333',
    flexShrink: 1,
  },
  pontoNomeSelecionado: {
    fontWeight: '600',
    color: '#1B3A5C',
  },
  erro: {
    color: '#C62828',
    fontSize: 14,
    marginTop: 12,
  },
  sucesso: {
    color: '#2E7D32',
    fontSize: 14,
    marginTop: 12,
  },
  botao: {
    backgroundColor: '#1B3A5C',
    padding: 12,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  botaoSecundario: {
    padding: 12,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  botaoSecundarioTexto: {
    color: '#666666',
    fontWeight: '600',
    fontSize: 16,
  },
});