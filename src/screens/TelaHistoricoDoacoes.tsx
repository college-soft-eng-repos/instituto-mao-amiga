import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, TabParamList } from '../App';
import { listarDoacoes } from '../services/doacoesStorage';
import ScreenContainer from '../components/ScreenContainer';
import ResumoDoacoesCard from '../components/ResumoDoacoesCard';
import ListItemCard from '../components/ListItemCard';
import SearchInput from '../components/SearchInput';
import EmptyState from '../components/EmptyState';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Historico'>,
  NativeStackScreenProps<RootStackParamList>
>;

type Doacao = {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
  criadoEm: string;
};

export default function TelaHistoricoDoacoes({ navigation }: Props) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        setCarregando(true);
        const dados = await listarDoacoes();
        setDoacoes(dados);
        setCarregando(false);
      }
      carregar();
    }, [])
  );

  const resumoDoacoes = useMemo(() => {
    if (doacoes.length === 0) return null;

    const totaisPorTipo: { [tipo: string]: { quantidade: number; totalDoacoes: number } } = {};
    let totalGeralDoacoes = doacoes.length;
    let totalGeralUnidades = 0;

    doacoes.forEach((item) => {
      const tipo = item.tipoItem.trim();
      const qtd = Number(item.quantidade) || 0;

      totalGeralUnidades += qtd;

      if (!totaisPorTipo[tipo]) {
        totaisPorTipo[tipo] = { quantidade: 0, totalDoacoes: 0 };
      }
      totaisPorTipo[tipo].quantidade += qtd;
      totaisPorTipo[tipo].totalDoacoes += 1;
    });

    const itensOrdenados = Object.entries(totaisPorTipo)
      .map(([tipo, dados]) => ({
        tipo,
        quantidade: dados.quantidade,
        totalDoacoes: dados.totalDoacoes,
      }))
      .sort((a, b) => b.quantidade - a.quantidade);

    return {
      totalGeralDoacoes,
      totalGeralUnidades,
      itensOrdenados,
    };
  }, [doacoes]);

  const doacoesFiltradas = useMemo(() => {
    return doacoes.filter((item) =>
      item.tipoItem.toLowerCase().includes(busca.toLowerCase().trim())
    );
  }, [doacoes, busca]);

  return (
    <ScreenContainer withPadding={false}>
      <FlatList
        data={doacoesFiltradas}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaConteudo}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            {/* Bloco de Título e Subtítulo com respiro elegante */}
            <View style={styles.tituloContainer}>
              <Text style={styles.tituloPrincipal}>Minhas Doações</Text>
              <Text style={styles.subtituloPrincipal}>
                Acompanhe o histórico e o resumo das suas entregas realizadas
              </Text>
            </View>

            {resumoDoacoes && (
              <View style={styles.resumoWrapper}>
                <ResumoDoacoesCard
                  totalGeralUnidades={resumoDoacoes.totalGeralUnidades}
                  totalGeralDoacoes={resumoDoacoes.totalGeralDoacoes}
                  itensOrdenados={resumoDoacoes.itensOrdenados}
                />
              </View>
            )}

            <View style={styles.searchWrapper}>
              <SearchInput
                value={busca}
                onChangeText={setBusca}
                placeholder="Buscar por tipo de item..."
              />
            </View>

            <View style={styles.secaoHeaderRow}>
              <Text style={styles.secaoTitulo}>Registros</Text>
              <View style={styles.contadorBadge}>
                <Text style={styles.contadorTexto}>{doacoesFiltradas.length} doações</Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const dataFormatada = new Date(item.criadoEm).toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
          });

          return (
            <View style={styles.itemWrapper}>
              <ListItemCard
                titulo={item.tipoItem}
                subtitulo={`Destino: ${item.pontoDestino}`}
                badge={`${item.quantidade} un.`}
                detalheRodape={`Registrado em: ${dataFormatada}`}
                onPress={() => navigation.navigate('DetalheDoacao', { doacaoId: item.id })}
              />
            </View>
          );
        }}
        ListEmptyComponent={
          !carregando ? (
            <View style={styles.emptyWrapper}>
              <EmptyState
                icon={doacoes.length === 0 ? 'package' : 'search'}
                title={
                  doacoes.length === 0
                    ? 'Nenhuma doação registrada ainda.'
                    : `Nenhuma doação encontrada para "${busca}".`
                }
                subtitle={
                  doacoes.length === 0
                    ? 'Comece registrando a sua primeira doação para o Instituto Mão Amiga.'
                    : 'Tente buscar por outro termo ou limpe o campo de pesquisa.'
                }
                actionTitle={doacoes.length === 0 ? 'Cadastrar primeira doação' : undefined}
                onActionPress={
                  doacoes.length === 0
                    ? () => (navigation.navigate as any)('MainTabs', { screen: 'Cadastrar' })
                    : undefined
                }
              />
            </View>
          ) : null
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listaConteudo: {
    paddingTop: 28,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 4,
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
  resumoWrapper: {
    marginBottom: 20,
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