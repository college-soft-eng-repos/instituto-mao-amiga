import { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TabParamList, RootStackParamList } from '../types/navigation';
import ScreenContainer from '../components/ScreenContainer';
import ListItemCard from '../components/ListItemCard';
import SearchInput from '../components/SearchInput';
import EmptyState from '../components/EmptyState';
import type { Ponto } from '../types/ponto';
import { listarPontos } from '../services/pontosService';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Inicio'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function TelaListaPontos({ navigation }: Props) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let montado = true;

    async function carregarPontos() {
      try {
        const pagina = await listarPontos();
        if (montado) {
          setPontos(pagina.content);
          setErro('');
        }
      } catch (error) {
        if (montado) {
          console.error('Erro ao carregar pontos:', error);
          setErro('Não foi possível carregar os pontos. Verifique se a API está ligada.');
        }
      } finally {
        if (montado) {
          setCarregando(false);
        }
      }
    }

    carregarPontos();
    return () => {
      montado = false;
    };
  }, []);

  const pontosFiltrados = useMemo(() => {
    return pontos.filter((ponto) =>
      ponto.nome.toLowerCase().includes(busca.toLowerCase().trim())
    );
  }, [busca, pontos]);

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
          carregando ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="large" color="#2563EB" />
            </View>
          ) : (
            <View style={styles.emptyWrapper}>
              <EmptyState
                icon={erro !== '' ? 'alert-circle' : 'search'}
                title={erro !== '' ? 'Não foi possível carregar os pontos.' : `Nenhum ponto encontrado para "${busca}".`}
                subtitle={erro !== '' ? erro : 'Tente pesquisar por outro termo ou limpe o campo.'}
              />
            </View>
          )
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
  loadingWrapper: {
    paddingVertical: 48,
    alignItems: 'center',
  },
});