import { ActivityIndicator, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import type { Ponto } from '../types/ponto';
import { buscarPontoPorId } from '../services/pontosService';
import ModalHeader from '../components/ModalHeader';
import InfoRow from '../components/InfoRow';

type Props = NativeStackScreenProps<RootStackParamList, 'Detalhe'>;

function DetalhePonto({ ponto, navigation }: { ponto: Ponto; navigation: Props['navigation'] }) {
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
          <InfoRow icon="clock" label="Dias e Horários" value={ponto.diasHorarios} />
          <InfoRow icon="info" label="Recebe / Distribui" value={ponto.recebeDistribui} isLast={true} />
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function TelaDetalhePonto({ route, navigation }: Props) {
  const { pontoId } = route.params;
  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let montado = true;

    async function carregarPonto() {
      try {
        const pontoEncontrado = await buscarPontoPorId(pontoId);
        if (montado) {
          setPonto(pontoEncontrado);
          setErro('');
        }
      } catch (error) {
        if (montado) {
          const mensagem = error instanceof Error ? error.message : '';
          setErro(
            mensagem === 'API_ERROR_404'
              ? 'Ponto não encontrado.'
              : 'Não foi possível carregar o ponto. Verifique se a API está ligada.',
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
  }, [pontoId]);

  if (carregando || erro !== '' || !ponto) {
    return (
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => navigation.goBack()}>
        <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <ModalHeader title={erro === 'Ponto não encontrado.' ? 'Aviso' : 'Detalhes do Ponto'} onClose={() => navigation.goBack()} />
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

  return <DetalhePonto ponto={ponto} navigation={navigation} />;
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
});