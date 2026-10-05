import { View, StyleSheet, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { pontosMock, type Ponto } from './TelaListaPontos';
import ModalHeader from '../components/ModalHeader';
import InfoRow from '../components/InfoRow';

type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Detalhe'>;

function DetalhePonto({ ponto, navigation }: { ponto: Ponto; navigation: any }) {
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
  const ponto = pontosMock.find((p) => p.id === pontoId);

  if (!ponto) {
    return (
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => navigation.goBack()}>
        <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <ModalHeader title="Aviso" onClose={() => navigation.goBack()} />
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
});