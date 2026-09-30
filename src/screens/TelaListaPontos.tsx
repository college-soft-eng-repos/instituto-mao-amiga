import { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import ScreenHeader from '../components/ScreenHeader';
import ListItemCard from '../components/ListItemCard';
import SearchInput from '../components/SearchInput';
import CustomButton from '../components/CustomButton';
import EmptyState from '../components/EmptyState';

export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  diasHorarios: string;
  recebeDistribui: string;
};

export const pontosMock: Ponto[] = [
  {
    id: '1',
    nome: 'Ponto Centro — Igreja São José',
    endereco: 'Rua das Flores, 120, Centro, São Luís - MA, CEP 65010-000',
    diasHorarios: 'Segunda a sexta, 9h–17h',
    recebeDistribui:
      'Recebe alimentos não perecíveis e roupas; distribui cestas básicas às terças.',
  },
  {
    id: '2',
    nome: 'Ponto Norte — Associação Bairro Alto',
    endereco: 'Av. Brasil, 890, Bairro Alto, São Luís - MA, CEP 65040-210',
    diasHorarios: 'Terça e quinta, 14h–19h',
    recebeDistribui:
      'Recebe hortifruti de feiras; distribui kits de higiene aos sábados.',
  },
  {
    id: '3',
    nome: 'Ponto Sul — Mercado Comunitário',
    endereco: 'Travessa do Sol, 45, Vila Nova, São Luís - MA, CEP 65060-120',
    diasHorarios: 'Sábado, 8h–12h',
    recebeDistribui:
      'Recebe doações de famílias e mercados; distribui refeições prontas no mesmo dia.',
  },
  {
    id: '4',
    nome: 'Ponto Leste — Escola Municipal Aurora',
    endereco: 'Rua Aurora, 310, Cohama, São Luís - MA, CEP 65074-180',
    diasHorarios: 'Quarta e sexta, 10h–16h',
    recebeDistribui:
      'Recebe material escolar e lanches; distribui kits infantis às sextas.',
  },
  {
    id: '5',
    nome: 'Ponto Oeste — Centro Comunitário Liberdade',
    endereco: 'Av. dos Holandeses, 1500, Calhau, São Luís - MA, CEP 65071-380',
    diasHorarios: 'Segunda, quarta e sábado, 8h–12h',
    recebeDistribui:
      'Recebe roupas e calçados; distribui enxovais para famílias cadastradas.',
  },
  {
    id: '6',
    nome: 'Ponto Anil — Paróquia Nossa Senhora',
    endereco: 'Rua do Anil, 78, Anil, São Luís - MA, CEP 65046-140',
    diasHorarios: 'Domingo, 7h–11h',
    recebeDistribui:
      'Recebe alimentos perecíveis da feira; distribui café da manhã comunitário.',
  },
  {
    id: '7',
    nome: 'Ponto João Paulo — Associação de Moradores',
    endereco: 'Rua das Palmeiras, 220, João Paulo, São Luís - MA, CEP 65050-000',
    diasHorarios: 'Terça a sábado, 13h–18h',
    recebeDistribui:
      'Recebe produtos de limpeza e higiene; distribui cestas às quintas.',
  },
];

type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: string };
  CadastroDoacao: undefined;
  HistoricoDoacoes: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Lista'>;
};

export default function TelaListaPontos({ navigation }: Props) {
  const [busca, setBusca] = useState('');
  const pontosFiltrados = useMemo(() => {
    return pontosMock.filter((ponto) =>
      ponto.nome.toLowerCase().includes(busca.toLowerCase().trim())
    );
  }, [busca]);

  return (
    <ScreenContainer withPadding={false}>
      <FlatList
        style={styles.lista}
        data={pontosFiltrados}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaConteudo}
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            <ScreenHeader title="Buscar Pontos" />
            
            <SearchInput
              value={busca}
              onChangeText={setBusca}
              placeholder="Buscar pontos..."
            />
            
            <CustomButton
              title="+ Cadastrar doação"
              onPress={() => navigation.navigate('CadastroDoacao')}
              variant="primary"
            />

            <CustomButton
              title="Ver histórico de doações"
              onPress={() => navigation.navigate('HistoricoDoacoes')}
              variant="secondary"
            />

            <ScreenHeader title="Todos os Pontos" size="medium" />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <ListItemCard
              titulo={item.nome}
              subtitulo={item.endereco}
              detalheRodape={item.diasHorarios}
              onPress={() => navigation.navigate('Detalhe', { pontoId: item.id })}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrapper}>
            <EmptyState
              icon="search"
              title={`Nenhum ponto encontrado para "${busca}".`}
              subtitle="Tente pesquisar por outro nome de ponto de recolha."
            />
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  lista: {
    flex: 1,
  },
  listaConteudo: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  cabecalho: {
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  itemWrapper: {
    paddingHorizontal: 16,
  },
  emptyWrapper: {
    paddingHorizontal: 16,
  },
});