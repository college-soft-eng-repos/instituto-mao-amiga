import { ActivityIndicator, Alert, Platform, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import type { Ponto } from '../types/ponto';
import { ApiError } from '../services/api';
import { buscarPontoPorId, excluirPonto } from '../services/pontosService';
import ModalHeader from '../components/ModalHeader';
import InfoRow from '../components/InfoRow';
import CustomButton from '../components/CustomButton';
import ConfirmationDialog from '../components/ConfirmationDialog';

type Props = NativeStackScreenProps<RootStackParamList, 'Detalhe'>;

function DetalhePonto({
  ponto,
  navigation,
  excluindo,
  aoEditar,
  aoExcluir,
  confirmacaoWebVisivel,
  erroExclusaoWeb,
  aoCancelarExclusao,
  aoConfirmarExclusaoWeb,
  aoFecharErroWeb,
}: {
  ponto: Ponto;
  navigation: Props['navigation'];
  excluindo: boolean;
  aoEditar: () => void;
  aoExcluir: () => void;
  confirmacaoWebVisivel: boolean;
  erroExclusaoWeb: string;
  aoCancelarExclusao: () => void;
  aoConfirmarExclusaoWeb: () => void;
  aoFecharErroWeb: () => void;
}) {
  return (
    <TouchableOpacity 
      style={styles.modalOverlay} 
      activeOpacity={1} 
      onPress={() => navigation.goBack()}
    >
      <TouchableOpacity 
        style={styles.modalContent} 
        activeOpacity={1} 
        onPress={(e) => e.stopPropagation()}
      >
        <ModalHeader title="Detalhes do Ponto" onClose={() => navigation.goBack()} />

        <View style={styles.card}>
          <InfoRow icon="map-pin" label="Nome do Ponto" value={ponto.nome} />
          <InfoRow icon="navigation" label="Endereço" value={ponto.endereco} />
          <InfoRow icon="map" label="Bairro" value={ponto.bairro} />
          <InfoRow icon="clock" label="Horário" value={ponto.horario} />
          <InfoRow icon="info" label="Tipo" value={ponto.tipo} isLast={true} />
        </View>

        <View style={styles.acoes}>
          <View style={styles.botaoWrapper}>
            <CustomButton title="Editar" icon="edit-2" variant="outline" onPress={aoEditar} />
          </View>
          <View style={styles.botaoWrapper}>
            <CustomButton title="Excluir" icon="trash-2" variant="danger-outline" onPress={aoExcluir} loading={excluindo} />
          </View>
        </View>
      </TouchableOpacity>
      {confirmacaoWebVisivel && (
        <ConfirmationDialog
          title="Excluir ponto?"
          message="Tem certeza de que deseja excluir este ponto?"
          cancelLabel="Cancelar"
          confirmLabel={excluindo ? 'Excluindo...' : 'Excluir'}
          onCancel={aoCancelarExclusao}
          onConfirm={aoConfirmarExclusaoWeb}
        />
      )}
      {erroExclusaoWeb !== '' && (
        <ConfirmationDialog
          title="Não foi possível excluir o ponto"
          message={erroExclusaoWeb}
          confirmLabel="OK"
          confirmVariant="primary"
          onConfirm={aoFecharErroWeb}
        />
      )}
    </TouchableOpacity>
  );
}

export default function TelaDetalhePonto({ route, navigation }: Props) {
  const { pontoId } = route.params;
  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [excluindo, setExcluindo] = useState(false);
  const [confirmacaoWebVisivel, setConfirmacaoWebVisivel] = useState(false);
  const [erroExclusaoWeb, setErroExclusaoWeb] = useState('');

  useFocusEffect(useCallback(() => {
    let montado = true;
    setCarregando(true);
    setErro('');

    async function carregarPonto() {
      try {
        const pontoEncontrado = await buscarPontoPorId(pontoId);
        if (montado) {
          setPonto(pontoEncontrado);
          setErro('');
        }
      } catch (error) {
        if (montado) {
          setErro(
            error instanceof ApiError && error.status === 404
              ? 'ponto não encontrado'
              : error instanceof ApiError
                ? `A API respondeu com erro (${error.status}).`
                : 'Não foi possível conectar à API. Verifique se ela está ligada.',
          );
        }
      } finally {
        if (montado) {
          setCarregando(false);
        }
      }
    }

    carregarPonto();
    return () => {
      montado = false;
    };
  }, [pontoId]));

  async function excluir() {
    setExcluindo(true);
    try {
      await excluirPonto(pontoId);
      navigation.goBack();
    } catch (error) {
      const mensagem = error instanceof ApiError
        ? `A API respondeu com erro HTTP ${error.status}. O ponto não foi excluído.`
        : 'Não foi possível conectar à API. O ponto não foi excluído.';
      if (Platform.OS === 'web') {
        setErroExclusaoWeb(mensagem);
      } else {
        Alert.alert('Não foi possível excluir o ponto', mensagem);
      }
    } finally {
      setExcluindo(false);
    }
  }

  function confirmarExclusao() {
    if (Platform.OS === 'web') {
      setErroExclusaoWeb('');
      setConfirmacaoWebVisivel(true);
      return;
    }

    Alert.alert('Excluir ponto', 'Tem certeza de que deseja excluir este ponto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { void excluir(); } },
    ]);
  }

  if (carregando || erro !== '' || !ponto) {
    return (
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => navigation.goBack()}>
        <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <ModalHeader title={erro === 'ponto não encontrado' ? 'Aviso' : 'Detalhes do Ponto'} onClose={() => navigation.goBack()} />
          <View style={styles.centralizado}>
            {carregando ? (
              <ActivityIndicator size="large" color="#2563EB" />
            ) : (
              <Text style={styles.erroTexto}>{erro}</Text>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <DetalhePonto
      ponto={ponto}
      navigation={navigation}
      excluindo={excluindo}
      aoEditar={() => navigation.navigate('FormularioPonto', { pontoId: ponto.id })}
      aoExcluir={confirmarExclusao}
      confirmacaoWebVisivel={confirmacaoWebVisivel}
      erroExclusaoWeb={erroExclusaoWeb}
      aoCancelarExclusao={() => setConfirmacaoWebVisivel(false)}
      aoConfirmarExclusaoWeb={() => {
        setConfirmacaoWebVisivel(false);
        void excluir();
      }}
      aoFecharErroWeb={() => setErroExclusaoWeb('')}
    />
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
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginTop: 4,
  },
  centralizado: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  erroTexto: {
    color: '#B91C1C',
    textAlign: 'center',
    fontSize: 14,
  },
  acoes: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  botaoWrapper: {
    flex: 1,
  },
});
