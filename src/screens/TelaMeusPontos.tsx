import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import EmptyState from '../components/EmptyState';
import ListItemCard from '../components/ListItemCard';
import ScreenContainer from '../components/ScreenContainer';
import { ApiError } from '../services/api';
import { buscarPontoPorId } from '../services/pontosService';
import { listarIdsFavoritos, removerFavorito, removerFavoritos } from '../services/pontosFavoritosStorage';
import type { RootStackParamList } from '../types/navigation';
import type { Ponto } from '../types/ponto';

type Props = NativeStackScreenProps<RootStackParamList, 'MeusPontos'>;

export default function TelaMeusPontos({ navigation }: Props) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [idsRemovendo, setIdsRemovendo] = useState<Set<string>>(new Set());

  useFocusEffect(useCallback(() => {
    let montada = true;

    async function carregarFavoritos() {
      setCarregando(true);
      setErro('');
      try {
        const ids = await listarIdsFavoritos();
        const resultados = await Promise.all(ids.map(async (id) => {
          try {
            return { id, ponto: await buscarPontoPorId(id), erro: false };
          } catch (error) {
            return { id, ponto: null, erro: !(error instanceof ApiError && error.status === 404) };
          }
        }));

        if (!montada) return;
        const encontrados = resultados.flatMap((resultado) => resultado.ponto ? [resultado.ponto] : []);
        const idsRemovidos = resultados.filter((resultado) => !resultado.ponto && !resultado.erro).map((resultado) => resultado.id);
        setPontos(encontrados);
        if (idsRemovidos.length > 0) {
          await removerFavoritos(idsRemovidos);
        }
        if (resultados.some((resultado) => resultado.erro)) {
          setErro('Não foi possível carregar alguns favoritos. Confira se a API está ligada.');
        }
      } catch {
        if (montada) setErro('Não foi possível carregar os favoritos salvos neste aparelho.');
      } finally {
        if (montada) setCarregando(false);
      }
    }

    carregarFavoritos();
    return () => {
      montada = false;
    };
  }, []));

  async function desmarcarFavorito(ponto: Ponto) {
    setIdsRemovendo((atuais) => new Set(atuais).add(ponto.id));
    const anteriores = pontos;
    setPontos((atuais) => atuais.filter((item) => item.id !== ponto.id));
    try {
      await removerFavorito(ponto.id);
    } catch {
      setPontos(anteriores);
      setErro('Não foi possível atualizar os favoritos neste aparelho. Tente novamente.');
    } finally {
      setIdsRemovendo((atuais) => {
        const novos = new Set(atuais);
        novos.delete(ponto.id);
        return novos;
      });
    }
  }

  return (
    <ScreenContainer withPadding={false}>
      <FlatList
        data={pontos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <View style={styles.cabecalho}>
            <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Voltar">
              <Feather name="arrow-left" size={20} color="#334155" />
            </TouchableOpacity>
            <Text style={styles.titulo}>Meus pontos</Text>
            <Text style={styles.subtitulo}>Seus locais favoritos, salvos neste aparelho.</Text>
            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
          </View>
        )}
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
                onPress={() => void desmarcarFavorito(item)}
                disabled={idsRemovendo.has(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`Desmarcar ${item.nome} como favorito`}
              >
                <Text style={styles.coracaoFavorito}>♥</Text>
              </TouchableOpacity>
            )}
          />
        )}
        ListEmptyComponent={carregando ? (
          <View style={styles.estado}><ActivityIndicator size="large" color="#2563EB" /><Text style={styles.estadoTexto}>Carregando favoritos...</Text></View>
        ) : erro !== '' && pontos.length === 0 ? (
          <View style={styles.estado}><EmptyState icon="alert-circle" title="Não foi possível carregar os favoritos" subtitle={erro} /></View>
        ) : (
          <View style={styles.estado}><EmptyState icon="heart" title="Você ainda não tem pontos favoritos" subtitle="Marque o coração de um ponto para encontrá-lo aqui." /></View>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  lista: { flexGrow: 1, paddingTop: 24, paddingBottom: 100, backgroundColor: '#F8FAFC' },
  cabecalho: { paddingHorizontal: 20, marginBottom: 20 },
  voltar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: '#E2E8F0', marginBottom: 16 },
  titulo: { color: '#0F172A', fontSize: 26, fontWeight: '800' },
  subtitulo: { color: '#64748B', fontSize: 14, marginTop: 6 },
  erro: { color: '#B91C1C', fontSize: 13, marginTop: 12 },
  itemPonto: { marginHorizontal: 20 },
  botaoFavorito: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: '#FFF1F2', marginRight: 12 },
  coracaoFavorito: { color: '#E11D48', fontSize: 22, lineHeight: 26 },
  estado: { flex: 1, minHeight: 200, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  estadoTexto: { color: '#64748B', marginTop: 12 },
});
