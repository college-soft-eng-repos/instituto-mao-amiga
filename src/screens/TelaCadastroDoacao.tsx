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
import type { RootStackParamList } from '../App';
import { pontosMock } from './TelaListaPontos';
import ScreenContainer from '../components/ScreenContainer';
import ScreenHeader from '../components/ScreenHeader';
import CustomButton from '../components/CustomButton';
import { 
  salvarDoacao, 
  listarDoacoes, 
  atualizarDoacao, 
  carregarRascunho, 
  salvarRascunho, 
  limparRascunho 
} from '../services/doacoesStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroDoacao'>;

export default function TelaCadastroDoacao({ route, navigation }: Props) {
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestinoId, setPontoDestinoId] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(true);
  
  const inputQuantidadeRef = useRef<TextInput>(null);
  
  const doacaoId = route.params?.doacaoId;
  const [isEdicao, setIsEdicao] = useState(false);
  const [criadoEmOriginal, setCriadoEmOriginal] = useState<string | null>(null);

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
            
            const pontoEncontrado = pontosMock.find((p) => p.nome === encontrada.pontoDestino);
            if (pontoEncontrado) {
              setPontoDestinoId(pontoEncontrado.id);
            }
          }
        } else {
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
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.conteudo}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Título dinâmico usando ScreenHeader */}
          <ScreenHeader title={isEdicao ? 'Editar doação' : 'Cadastrar doação'} />

          <Text style={styles.rotulo}>Tipo do item</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: arroz, roupa, leite"
            placeholderTextColor="#8C98A4"
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
            placeholderTextColor="#8C98A4"
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

          <View style={styles.containerBotoes}>
            <CustomButton
              title={isEdicao ? 'Salvar alterações' : 'Registrar doação'}
              onPress={validarESalvar}
              variant="primary"
              icon={isEdicao ? 'check' : 'plus-circle'}
            />

            <CustomButton
              title="Cancelar"
              onPress={() => navigation.goBack()}
              variant="outline"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  conteudo: {
    paddingTop: 16,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8C98A4',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#212529',
    backgroundColor: '#FFFFFF',
    minHeight: 46,
  },
  pontoOpcao: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    minHeight: 46,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  pontoSelecionado: {
    borderColor: '#1B3A5C',
    backgroundColor: '#E8EEF4',
  },
  pontoNome: {
    fontSize: 14,
    color: '#4A5568',
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
  containerBotoes: {
    marginTop: 24,
    gap: 8,
  },
});