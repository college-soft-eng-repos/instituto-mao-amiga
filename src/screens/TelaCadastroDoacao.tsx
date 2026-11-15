import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import CustomButton from '../components/CustomButton';
import ModalHeader from '../components/ModalHeader';
import { ApiError } from '../services/api';
import { listarTodosPontos } from '../services/pontosService';
import { cadastrarDoacao } from '../services/doacoesService';
import type { RootStackParamList } from '../types/navigation';
import type { Ponto } from '../types/ponto';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastrarModal'>;

function mensagemErro(error: unknown) {
  if (error instanceof ApiError && error.status === 400) {
    return 'A API recusou os dados. Confira os campos e tente novamente.';
  }
  if (error instanceof ApiError) {
    return `A API respondeu com erro HTTP ${error.status}. Seus dados continuam no formulário.`;
  }
  return 'Não foi possível conectar à API. Confira se ela está ligada. Seus dados continuam no formulário.';
}

export default function TelaCadastroDoacao({ navigation }: Props) {
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestinoId, setPontoDestinoId] = useState('');
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [carregandoPontos, setCarregandoPontos] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erroPontos, setErroPontos] = useState('');
  const [erro, setErro] = useState('');
  const inputQuantidadeRef = useRef<TextInput>(null);

  useEffect(() => {
    let montado = true;

    async function carregarPontos() {
      try {
        const lista = await listarTodosPontos();
        if (montado) setPontos(lista);
      } catch (error) {
        if (montado) setErroPontos(mensagemErro(error));
      } finally {
        if (montado) setCarregandoPontos(false);
      }
    }

    carregarPontos();
    return () => {
      montado = false;
    };
  }, []);

  async function validarESalvar() {
    setErro('');

    const item = tipoItem.trim();
    if (item === '') {
      setErro('Informe o tipo do item (ex.: arroz, roupa, leite).');
      return;
    }

    const quantidadeNumerica = Number(quantidade.trim());
    if (
      quantidade.trim() === '' ||
      !Number.isInteger(quantidadeNumerica) ||
      quantidadeNumerica <= 0
    ) {
      setErro('A quantidade precisa ser um número inteiro maior que zero.');
      return;
    }

    const pontoSelecionado = pontos.find((ponto) => ponto.id === pontoDestinoId);
    if (!pontoSelecionado) {
      setErro('Selecione um ponto de destino.');
      return;
    }

    setSalvando(true);
    try {
      await cadastrarDoacao({
        tipoItem: item,
        quantidade: quantidadeNumerica,
        pontoDestino: pontoSelecionado.nome,
      });
      Keyboard.dismiss();
      navigation.goBack();
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => navigation.goBack()}>
      <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={(event) => event.stopPropagation()}>
        <ModalHeader title="Cadastrar doação" onClose={() => navigation.goBack()} />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            contentContainerStyle={styles.conteudo}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.rotulo}>Tipo do item</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: arroz, roupa, leite"
              placeholderTextColor="#94A3B8"
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
              placeholderTextColor="#94A3B8"
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="number-pad"
              returnKeyType="done"
              onSubmitEditing={validarESalvar}
            />

            <Text style={styles.rotulo}>Ponto de destino</Text>
            {carregandoPontos ? (
              <View style={styles.loadingPontos}>
                <ActivityIndicator size="small" color="#2563EB" />
              </View>
            ) : erroPontos !== '' ? (
              <Text style={styles.erro}>{erroPontos}</Text>
            ) : pontos.length === 0 ? (
              <Text style={styles.erro}>A API não retornou pontos de destino disponíveis.</Text>
            ) : (
              <ScrollView
                style={styles.trayContainer}
                nestedScrollEnabled
                showsVerticalScrollIndicator
              >
                {pontos.map((ponto) => {
                  const selecionado = pontoDestinoId === ponto.id;
                  return (
                    <TouchableOpacity
                      key={ponto.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected: selecionado }}
                      style={[styles.pontoChip, selecionado && styles.pontoChipSelecionado]}
                      onPress={() => {
                        setPontoDestinoId(ponto.id);
                        setErro('');
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.pontoTexto, selecionado && styles.pontoTextoSelecionado]}>
                        {ponto.nome}
                      </Text>
                      {selecionado && <Feather name="check" size={16} color="#2563EB" />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

            <View style={styles.containerBotoes}>
              <View style={styles.botaoWrapper}>
                <CustomButton title="Cancelar" onPress={() => navigation.goBack()} variant="outline" />
              </View>
              <View style={styles.botaoWrapper}>
                <CustomButton
                  title="Registrar"
                  onPress={validarESalvar}
                  variant="primary"
                  icon="plus-circle"
                  loading={salvando}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  conteudo: {
    paddingBottom: 4,
  },
  rotulo: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    minHeight: 48,
  },
  trayContainer: {
    maxHeight: 160,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    padding: 6,
  },
  loadingPontos: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pontoChip: {
    minHeight: 42,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pontoChipSelecionado: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  pontoTexto: {
    fontSize: 14,
    color: '#334155',
  },
  pontoTextoSelecionado: {
    fontWeight: '600',
    color: '#2563EB',
  },
  erro: {
    color: '#DC2626',
    fontSize: 13,
    marginTop: 10,
    fontWeight: '500',
  },
  containerBotoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  botaoWrapper: {
    flex: 1,
  },
});
