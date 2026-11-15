import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import CustomButton from '../components/CustomButton';
import EmptyState from '../components/EmptyState';
import ListItemCard from '../components/ListItemCard';
import ScreenContainer from '../components/ScreenContainer';
import SearchInput from '../components/SearchInput';
import { ApiError } from '../services/api';
import { listarDoacoes } from '../services/doacoesService';
import type { RootStackParamList, TabParamList } from '../types/navigation';
import type { Doacao } from '../types/doacao';

const TAMANHO_PAGINA = 10;

function mensagemErroApi(error: unknown) {
  if (error instanceof ApiError) {
    return `A API respondeu com erro HTTP ${error.status}. Tente novamente mais tarde.`;
  }
  return 'Não foi possível conectar à API. Confira se ela está ligada e tente novamente.';
}

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Historico'>,
  NativeStackScreenProps<RootStackParamList>
>;

type InformacaoPagina = {
  number: number;
  totalPages: number;
  totalElements: number;
};

export default function TelaHistoricoDoacoes({ navigation }: Props) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [busca, setBusca] = useState('');
  const [buscaAplicada, setBuscaAplicada] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [pagina, setPagina] = useState<InformacaoPagina | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState('');
  const [erroMais, setErroMais] = useState('');
  const requisicaoAtualRef = useRef(0);
  const paginasSolicitadasRef = useRef<Set<number>>(new Set());
  const carregandoMaisRef = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => setBuscaAplicada(busca.trim()), 300);
    return () => clearTimeout(timeout);
  }, [busca]);

  useFocusEffect(useCallback(() => {
    const requisicaoId = ++requisicaoAtualRef.current;
    paginasSolicitadasRef.current = new Set([0]);
    carregandoMaisRef.current = false;
    setCarregandoMais(false);
    setDoacoes([]);
    setPagina(null);
    setErro('');
    setErroMais('');
    setCarregando(true);

    async function carregarPrimeiraPagina() {
      try {
        const resultado = await listarDoacoes(0, TAMANHO_PAGINA, buscaAplicada);
        if (requisicaoId === requisicaoAtualRef.current) {
          setDoacoes(resultado.content);
          setPagina(resultado.page);
        }
      } catch (error) {
        if (requisicaoId === requisicaoAtualRef.current) {
          setErro(mensagemErroApi(error));
        }
      } finally {
        if (requisicaoId === requisicaoAtualRef.current) {
          setCarregando(false);
        }
      }
    }

    carregarPrimeiraPagina();
    return () => {
      if (requisicaoId === requisicaoAtualRef.current) {
        requisicaoAtualRef.current += 1;
      }
    };
  }, [buscaAplicada, reloadKey]));

  const carregarMaisDoacoes = useCallback(async () => {
    if (
      carregando ||
      carregandoMaisRef.current ||
      !pagina ||
      busca.trim() !== buscaAplicada ||
      pagina.number >= pagina.totalPages - 1
    ) {
      return;
    }

    const proximaPagina = pagina.number + 1;
    if (paginasSolicitadasRef.current.has(proximaPagina)) return;

    const requisicaoId = requisicaoAtualRef.current;
    paginasSolicitadasRef.current.add(proximaPagina);
    carregandoMaisRef.current = true;
    setCarregandoMais(true);
    setErroMais('');

    try {
      const resultado = await listarDoacoes(proximaPagina, TAMANHO_PAGINA, buscaAplicada);
      if (requisicaoId === requisicaoAtualRef.current) {
        setDoacoes((atuais) => {
          const idsAtuais = new Set(atuais.map((doacao) => doacao.id));
          return [...atuais, ...resultado.content.filter((doacao) => !idsAtuais.has(doacao.id))];
        });
        setPagina(resultado.page);
      }
    } catch (error) {
      if (requisicaoId === requisicaoAtualRef.current) {
        setErroMais(mensagemErroApi(error));
      }
    } finally {
      if (requisicaoId === requisicaoAtualRef.current) {
        carregandoMaisRef.current = false;
        setCarregandoMais(false);
      }
    }
  }, [busca, buscaAplicada, carregando, pagina]);

  return (
    <ScreenContainer withPadding={false}>
      <FlatList
        data={doacoes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaConteudo}
        onEndReached={carregarMaisDoacoes}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.tituloContainer}>
              <Text style={styles.tituloPrincipal}>Minhas Doações</Text>
              <Text style={styles.subtituloPrincipal}>
                Acompanhe o histórico das suas entregas realizadas
              </Text>
            </View>

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
                <Text style={styles.contadorTexto}>{pagina?.totalElements ?? 0} doações</Text>
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
          carregando ? (
            <View style={styles.estadoCarregando}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.textoEstado}>Carregando histórico...</Text>
            </View>
          ) : erro !== '' ? (
            <View style={styles.estadoVazio}>
              <EmptyState icon="alert-circle" title="Não foi possível carregar o histórico" subtitle={erro} />
              <CustomButton title="Tentar novamente" onPress={() => setReloadKey((valor) => valor + 1)} variant="outline" />
            </View>
          ) : doacoes.length === 0 ? (
            <View style={styles.estadoVazio}>
              <EmptyState
                icon={buscaAplicada === '' ? 'package' : 'search'}
                title={buscaAplicada === '' ? 'Nenhuma doação registrada ainda.' : `Nenhuma doação encontrada para "${buscaAplicada}".`}
                subtitle={buscaAplicada === '' ? 'Cadastre uma doação para iniciar o histórico.' : 'Tente outro tipo de item ou limpe a busca.'}
                actionTitle={buscaAplicada === '' ? 'Cadastrar primeira doação' : undefined}
                onActionPress={buscaAplicada === '' ? () => navigation.navigate('CadastrarModal') : undefined}
              />
            </View>
          ) : null
        }
        ListFooterComponent={
          carregandoMais ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color="#2563EB" />
            </View>
          ) : erroMais !== '' ? (
            <Text style={styles.erroMais}>{erroMais}</Text>
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
    flexGrow: 1,
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
  estadoCarregando: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 12,
  },
  textoEstado: {
    color: '#64748B',
    fontSize: 14,
  },
  estadoVazio: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  erroMais: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    color: '#B91C1C',
    textAlign: 'center',
  },
});
