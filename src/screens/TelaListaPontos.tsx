import { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TabParamList, RootStackParamList } from '../App';
import ScreenContainer from '../components/ScreenContainer';
import ListItemCard from '../components/ListItemCard';
import SearchInput from '../components/SearchInput';
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

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Inicio'>,
  NativeStackScreenProps<RootStackParamList>
>;

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
            <View style={styles.tituloContainer}>
              <Text style={styles.tituloPrincipal}>Pontos de Coleta</Text>
              <Text style={styles.subtituloPrincipal}>
                Selecione um local para ver detalhes ou registrar entregas
              </Text>
            </View>
            
            <View style={styles.searchWrapper}>
              <SearchInput
                value={busca}
                onChangeText={setBusca}
                placeholder="Pesquisar por nome do ponto..."
              />
            </View>

            <View style={styles.secaoHeaderRow}>
              <Text style={styles.secaoTitulo}>Locais Disponíveis</Text>
              <View style={styles.contadorBadge}>
                <Text style={styles.contadorTexto}>{pontosFiltrados.length} encontrados</Text>
              </View>
            </View>
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
              subtitle="Tente pesquisar por outro termo ou limpe o campo."
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
    backgroundColor: '#F8FAFC',
  },
  listaConteudo: {
    paddingTop: 28,
    paddingBottom: 40,
  },
  cabecalho: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  tituloContainer: {
    marginBottom: 20,
  },
  tituloPrincipal: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.6,
  },
  subtituloPrincipal: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
    lineHeight: 18,
  },
  searchWrapper: {
    marginBottom: 24,
  },
  secaoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  secaoTitulo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  contadorBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  contadorTexto: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  itemWrapper: {
    paddingHorizontal: 20,
  },
  emptyWrapper: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
});