import { View, StyleSheet, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { pontosMock, type Ponto } from './TelaListaPontos';
import ModalHeader from '../components/ModalHeader';
import ScreenHeader from '../components/ScreenHeader';
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
        <ModalHeader title="Informações do Ponto" onClose={() => navigation.goBack()} />

        <ScreenHeader title={ponto.nome} size="medium" />
        
        <InfoRow icon="map-pin" label="Endereço" value={ponto.endereco} />
        <InfoRow icon="clock" label="Dias e horários" value={ponto.diasHorarios} />
        <InfoRow icon="info" label="Recebe / distribui" value={ponto.recebeDistribui} isLast={true} />
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
          <ScreenHeader title="Ponto não encontrado." size="medium" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return <DetalhePonto ponto={ponto} navigation={navigation} />;
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
});