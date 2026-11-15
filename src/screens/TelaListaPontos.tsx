import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TabParamList, RootStackParamList } from '../types/navigation';
import ScreenContainer from '../components/ScreenContainer';
import ListItemCard from '../components/ListItemCard';
import SearchInput from '../components/SearchInput';
import EmptyState from '../components/EmptyState';
import CustomButton from '../components/CustomButton';
import type { Ponto } from '../types/ponto';
import { buscarPaginaPontos } from '../services/pontosService';
import { ApiError } from '../services/api';
import { adicionarFavorito, listarIdsFavoritos, removerFavorito } from '../services/pontosFavoritosStorage';

const TAMANHO_PAGINA = 10;

function mensagemErroApi(error: unknown) {
  if (error instanceof ApiError) {
    return `A API respondeu com erro HTTP ${error.status}. Tente novamente mais tarde.`;
  }
  return 'Não foi possível conectar à API. Confira se ela está ligada e se o celular está na mesma rede Wi-Fi do computador.';
}

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Inicio'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function TelaListaPontos({ navigation }: Props) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [busca, setBusca] = useState('');
  const [buscaAplicada, setBuscaAplicada] = useState('');
  const [pagina, setPagina] = useState<{ number: number; totalPages: number; totalElements: number } | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState('');
  const [erroMais, setErroMais] = useState('');
  const [idsFavoritos, setIdsFavoritos] = useState<Set<string>>(new Set());
  const [erroFavoritos, setErroFavoritos] = useState('');
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
    setPontos([]);
    setPagina(null);
    setErro('');
    setErroMais('');
    setCarregando(true);

    async function carregarPrimeiraPagina() {
      try {
        const resultado = await buscarPaginaPontos(0, TAMANHO_PAGINA, buscaAplicada);
        if (requisicaoId === requisicaoAtualRef.current) {
          setPontos(resultado.content);
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

    listarIdsFavoritos()
      .then((ids) => {
        if (requisicaoId === requisicaoAtualRef.current) setIdsFavoritos(new Set(ids));
      })
      .catch(() => {
        if (requisicaoId === requisicaoAtualRef.current) {
          setErroFavoritos('Não foi possível ler os favoritos salvos neste aparelho.');
        }
      });

    carregarPrimeiraPagina();
    return () => {
      if (requisicaoId === requisicaoAtualRef.current) {
        requisicaoAtualRef.current += 1;
      }
    };
  }, [buscaAplicada]));

  async function alternarFavorito(id: string) {
    const estavaFavorito = idsFavoritos.has(id);
    setErroFavoritos('');
    setIdsFavoritos((atuais) => {
      const novos = new Set(atuais);
      if (estavaFavorito) novos.delete(id);
      else novos.add(id);
      return novos;
    });

    try {
      if (estavaFavorito) await removerFavorito(id);
      else await adicionarFavorito(id);
    } catch {
      setIdsFavoritos((atuais) => {
        const novos = new Set(atuais);
        if (estavaFavorito) novos.add(id);
        else novos.delete(id);
        return novos;
      });
      setErroFavoritos('Não foi possível atualizar os favoritos neste aparelho.');
    }
  }

  const carregarMaisPontos = useCallback(async () => {
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
      const resultado = await buscarPaginaPontos(proximaPagina, TAMANHO_PAGINA, buscaAplicada);
      if (requisicaoId === requisicaoAtualRef.current) {
        setPontos((atuais) => {
          const idsAtuais = new Set(atuais.map((ponto) => ponto.id));
          return [...atuais, ...resultado.content.filter((ponto) => !idsAtuais.has(ponto.id))];
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
        style={styles.lista}
        data={pontos}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaConteudo}
        onEndReached={carregarMaisPontos}
        onEndReachedThreshold={0.4}
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

            <View style={styles.botaoCadastro}>
              <CustomButton
                title="Meus pontos"
                icon="heart"
                variant="secondary"
                onPress={() => navigation.navigate('MeusPontos')}
              />
              <CustomButton
                title="Cadastrar ponto"
                icon="plus"
                onPress={() => navigation.navigate('FormularioPonto')}
              />
            </View>

            <View style={styles.secaoHeaderRow}>
              <Text style={styles.secaoTitulo}>Locais Disponíveis</Text>
              <View style={styles.contadorBadge}>
                <Text style={styles.contadorTexto}>{pagina?.totalElements ?? 0} encontrados</Text>
              </View>
            </View>
            {erroFavoritos !== '' && <Text style={styles.erroFavoritos}>{erroFavoritos}</Text>}
          </View>
        }
        renderItem={({ item }) => (
          <ListItemCard
            style={styles.itemPonto}
            titulo={item.nome}
            subtitulo={item.endereco}
            detalheRodape={item.horario}
            onPress={() => navigation.navigate('Detalhe', { pontoId: item.id })}
            mostrarSeta={false}
            trailingAction={(
              <TouchableOpacity
                style={styles.botaoFavorito}
                onPress={() => void alternarFavorito(item.id)}
                accessibilityRole="button"
                accessibilityLabel={idsFavoritos.has(item.id) ? `Remover ${item.nome} dos favoritos` : `Adicionar ${item.nome} aos favoritos`}
                accessibilityState={{ selected: idsFavoritos.has(item.id) }}
              >
                <Text style={[styles.iconeFavorito, idsFavoritos.has(item.id) && styles.iconeFavoritoAtivo]}>
                  {idsFavoritos.has(item.id) ? '♥' : '♡'}
                </Text>
              </TouchableOpacity>
            )}
          />
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
                title={erro !== '' ? 'Não foi possível carregar os pontos.' : `Nenhum ponto encontrado para "${buscaAplicada}".`}
                subtitle={erro !== '' ? erro : 'Tente pesquisar por outro termo ou limpe o campo.'}
              />
            </View>
          )
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
  lista: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listaConteudo: {
    paddingTop: 28,
    paddingBottom: 100,
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
  botaoCadastro: {
    gap: 8,
    marginBottom: 18,
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
  itemPonto: {
    marginHorizontal: 20,
  },
  botaoFavorito: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: '#FFF1F2',
    marginRight: 12,
  },
  iconeFavorito: {
    color: '#64748B',
    fontSize: 26,
    lineHeight: 30,
  },
  iconeFavoritoAtivo: {
    color: '#E11D48',
  },
  erroFavoritos: {
    color: '#B91C1C',
    fontSize: 12,
    marginTop: 8,
  },
  emptyWrapper: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  loadingWrapper: {
    paddingVertical: 48,
    alignItems: 'center',
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
