import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import CustomButton from '../components/CustomButton';
import ModalHeader from '../components/ModalHeader';
import { ApiError } from '../services/api';
import { buscarPontoPorId, cadastrarPonto, editarPonto } from '../services/pontosService';
import type { RootStackParamList } from '../types/navigation';
import type { Ponto, PontoRequest } from '../types/ponto';

type Props = NativeStackScreenProps<RootStackParamList, 'FormularioPonto'>;
type TipoPonto = Ponto['tipo'] | '';

function mensagemDeErro(error: unknown) {
  if (error instanceof ApiError && error.status === 400) {
    return 'A API recusou os dados. Confira os campos e tente novamente.';
  }
  if (error instanceof ApiError) {
    return `A API respondeu com erro HTTP ${error.status}. Seus dados continuam no formulário.`;
  }
  return 'Não foi possível conectar à API. Confira se ela está ligada. Seus dados continuam no formulário.';
}

export default function TelaFormularioPonto({ route, navigation }: Props) {
  const pontoId = route.params?.pontoId;
  const editando = Boolean(pontoId);
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [horario, setHorario] = useState('');
  const [tipo, setTipo] = useState<TipoPonto>('');
  const [carregandoPonto, setCarregandoPonto] = useState(editando);
  const [salvando, setSalvando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!pontoId) return;
    let montado = true;

    async function carregarPonto() {
      setCarregandoPonto(true);
      try {
        const ponto = await buscarPontoPorId(pontoId);
        if (montado) {
          setNome(ponto.nome);
          setEndereco(ponto.endereco);
          setBairro(ponto.bairro);
          setHorario(ponto.horario);
          setTipo(ponto.tipo);
        }
      } catch (error) {
        if (montado) {
          setErroCarregamento(mensagemDeErro(error));
        }
      } finally {
        if (montado) setCarregandoPonto(false);
      }
    }

    carregarPonto();
    return () => {
      montado = false;
    };
  }, [pontoId]);

  async function salvar() {
    if ([nome, endereco, bairro, horario].some((campo) => campo.trim() === '') || tipo === '') {
      setErro('Preencha todos os campos antes de salvar.');
      return;
    }

    const dados: PontoRequest = {
      nome: nome.trim(),
      endereco: endereco.trim(),
      bairro: bairro.trim(),
      horario: horario.trim(),
      tipo,
    };

    setErro('');
    setSalvando(true);
    try {
      if (pontoId) {
        await editarPonto(pontoId, dados);
      } else {
        await cadastrarPonto(dados);
      }
      navigation.goBack();
    } catch (error) {
      setErro(mensagemDeErro(error));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => navigation.goBack()}>
      <TouchableOpacity style={styles.modal} activeOpacity={1} onPress={(event) => event.stopPropagation()}>
        <ModalHeader
          title={editando ? 'Editar ponto' : 'Cadastrar ponto'}
          onClose={() => navigation.goBack()}
        />

        {carregandoPonto ? (
          <View style={styles.estado}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : erroCarregamento !== '' ? (
          <View style={styles.estado}>
            <Text style={styles.erro}>{erroCarregamento}</Text>
          </View>
        ) : (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
              contentContainerStyle={styles.conteudo}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.rotulo}>Nome</Text>
              <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome do ponto" />

              <Text style={styles.rotulo}>Endereço</Text>
              <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Endereço completo" />

              <Text style={styles.rotulo}>Bairro</Text>
              <TextInput style={styles.input} value={bairro} onChangeText={setBairro} placeholder="Bairro" />

              <Text style={styles.rotulo}>Horário</Text>
              <TextInput style={styles.input} value={horario} onChangeText={setHorario} placeholder="Ex.: Seg a Sex, 8h às 17h" />

              <Text style={styles.rotulo}>Tipo</Text>
              <View style={styles.tipos}>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityState={{ selected: tipo === 'coleta' }}
                  style={[styles.tipoBotao, tipo === 'coleta' && styles.tipoSelecionado]}
                  onPress={() => setTipo('coleta')}
                >
                  <Text style={[styles.tipoTexto, tipo === 'coleta' && styles.tipoTextoSelecionado]}>Coleta</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityState={{ selected: tipo === 'distribuição' }}
                  style={[styles.tipoBotao, tipo === 'distribuição' && styles.tipoSelecionado]}
                  onPress={() => setTipo('distribuição')}
                >
                  <Text style={[styles.tipoTexto, tipo === 'distribuição' && styles.tipoTextoSelecionado]}>Distribuição</Text>
                </TouchableOpacity>
              </View>

              {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

              <View style={styles.acoes}>
                <View style={styles.botaoWrapper}>
                  <CustomButton title="Cancelar" variant="outline" onPress={() => navigation.goBack()} />
                </View>
                <View style={styles.botaoWrapper}>
                  <CustomButton
                    title={editando ? 'Salvar alterações' : 'Cadastrar ponto'}
                    onPress={salvar}
                    loading={salvando}
                  />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modal: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    elevation: 12,
  },
  conteudo: {
    paddingBottom: 8,
  },
  rotulo: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 7,
    marginTop: 10,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  tipos: {
    flexDirection: 'row',
    gap: 10,
  },
  tipoBotao: {
    flex: 1,
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  tipoSelecionado: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  tipoTexto: {
    color: '#475569',
    fontWeight: '600',
  },
  tipoTextoSelecionado: {
    color: '#FFFFFF',
  },
  acoes: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  botaoWrapper: {
    flex: 1,
  },
  estado: {
    paddingVertical: 36,
    alignItems: 'center',
  },
  erro: {
    color: '#B91C1C',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
    textAlign: 'center',
  },
});
