import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import InfoRow from '../components/InfoRow';
import CustomButton from '../components/CustomButton';
import ConfirmationDialog from '../components/ConfirmationDialog';
import ModalHeader from '../components/ModalHeader';
import { ApiError } from '../services/api';
import { buscarDoacaoPorId, excluirDoacao } from '../services/doacoesService';
import type { RootStackParamList } from '../types/navigation';
import type { Doacao } from '../types/doacao';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheDoacao'>;

export default function TelaDetalheDoacao({ route, navigation }: Props) {
  const { doacaoId } = route.params;
  const [doacao, setDoacao] = useState<Doacao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState('');
  const [confirmacaoWebVisivel, setConfirmacaoWebVisivel] = useState(false);
  const [erroExclusaoWeb, setErroExclusaoWeb] = useState('');

  useFocusEffect(useCallback(() => {
    let montada = true;
    setCarregando(true);
    setErro('');

    async function carregarDoacao() {
      try {
        const resultado = await buscarDoacaoPorId(doacaoId);
        if (montada) setDoacao(resultado);
      } catch (error) {
        if (montada) {
          setErro(
            error instanceof ApiError && error.status === 404
              ? 'doação não encontrada'
              : error instanceof ApiError
                ? `A API respondeu com erro HTTP ${error.status}.`
                : 'Não foi possível conectar à API. Confira se ela está ligada.',
          );
        }
      } finally {
        if (montada) setCarregando(false);
      }
    }

    carregarDoacao();
    return () => {
      montada = false;
    };
  }, [doacaoId]));

  async function confirmarExclusao() {
    setErro('');
    setExcluindo(true);
    try {
      await excluirDoacao(doacaoId);
      navigation.goBack();
    } catch (error) {
      const mensagem = error instanceof ApiError
        ? `A API respondeu com erro HTTP ${error.status}. A doação não foi excluída.`
        : 'Não foi possível conectar à API. A doação não foi excluída.';
      if (Platform.OS === 'web') {
        setErroExclusaoWeb(mensagem);
      } else {
        Alert.alert('Não foi possível excluir a doação', mensagem);
      }
    } finally {
      setExcluindo(false);
    }
  }

  function solicitarExclusao() {
    if (Platform.OS === 'web') {
      setErroExclusaoWeb('');
      setConfirmacaoWebVisivel(true);
      return;
    }

    Alert.alert('Excluir doação', 'Deseja realmente excluir esta doação?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => void confirmarExclusao() },
    ]);
  }

  return (
    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => navigation.goBack()}>
      <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={(event) => event.stopPropagation()}>
        <ModalHeader title="Detalhes da Doação" onClose={() => navigation.goBack()} />

        {carregando ? (
          <View style={styles.centralizado}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : !doacao ? (
          <View style={styles.centralizado}>
            <Text style={styles.erroTexto}>{erro || 'Doação não encontrada.'}</Text>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <View style={styles.cabecalhoCard}>
                <View style={styles.iconeContainer}>
                  <Feather name="package" size={22} color="#2563EB" />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.label}>Tipo do Item</Text>
                  <Text style={styles.valorDestaque}>{doacao.tipoItem}</Text>
                </View>
              </View>

              <View style={styles.divisor} />
              <InfoRow icon="layers" label="Quantidade" value={`${doacao.quantidade} unidades`} />
              <InfoRow icon="map-pin" label="Ponto de Destino" value={doacao.pontoDestino} />
              <InfoRow
                icon="clock"
                label="Data e Hora do Registro"
                value={new Date(doacao.criadoEm).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'medium' })}
                isLast
              />
            </View>
            {erro !== '' && <Text style={styles.erroTexto}>{erro}</Text>}
            <View style={styles.acoes}>
              <View style={styles.acao}>
                <CustomButton
                  title="Editar"
                  icon="edit-2"
                  variant="outline"
                  onPress={() => navigation.navigate('CadastrarModal', { doacaoId })}
                />
              </View>
              <View style={styles.acao}>
                <CustomButton
                  title="Excluir"
                  icon="trash-2"
                  variant="danger-outline"
                  onPress={solicitarExclusao}
                  loading={excluindo}
                />
              </View>
            </View>
          </>
        )}
      </TouchableOpacity>
      {confirmacaoWebVisivel && (
        <ConfirmationDialog
          title="Excluir doação?"
          message="Tem certeza de que deseja excluir esta doação? Essa ação não pode ser desfeita."
          cancelLabel="Cancelar"
          confirmLabel={excluindo ? 'Excluindo...' : 'Excluir'}
          onCancel={() => setConfirmacaoWebVisivel(false)}
          onConfirm={() => {
            setConfirmacaoWebVisivel(false);
            void confirmarExclusao();
          }}
        />
      )}
      {erroExclusaoWeb !== '' && (
        <ConfirmationDialog
          title="Não foi possível excluir a doação"
          message={erroExclusaoWeb}
          confirmLabel="OK"
          confirmVariant="primary"
          onConfirm={() => setErroExclusaoWeb('')}
        />
      )}
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
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  centralizado: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  erroTexto: {
    fontSize: 15,
    color: '#DC2626',
    textAlign: 'center',
    fontWeight: '500',
  },
  acoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  acao: {
    flex: 1,
  },
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  cabecalhoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconeContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  valorDestaque: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  divisor: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
});
