import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { pontosMock, type Ponto } from './TelaListaPontos';
import ScreenContainer from '../components/ScreenContainer';
import ScreenHeader from '../components/ScreenHeader';
import InfoRow from '../components/InfoRow';

type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Detalhe'>;

function DetalhePonto({ ponto }: { ponto: Ponto }) {
  return (
    <ScreenContainer>
      <ScreenHeader title={ponto.nome} />
      
      <InfoRow
        icon="map-pin"
        label="Endereço"
        value={ponto.endereco}
      />
      
      <InfoRow
        icon="clock"
        label="Dias e horários"
        value={ponto.diasHorarios}
      />
      
      <InfoRow
        icon="info"
        label="Recebe / distribui"
        value={ponto.recebeDistribui}
        isLast={true}
      />
    </ScreenContainer>
  );
}

export default function TelaDetalhePonto({ route }: Props) {
  const { pontoId } = route.params;
  const ponto = pontosMock.find((p) => p.id === pontoId);

  if (!ponto) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Ponto não encontrado." />
      </ScreenContainer>
    );
  }

  return <DetalhePonto ponto={ponto} />;
}