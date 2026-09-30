import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { listarDoacoes } from '../services/doacoesStorage';
import ScreenContainer from '../components/ScreenContainer';
import ScreenHeader from '../components/ScreenHeader';
import ResumoDoacoesCard from '../components/ResumoDoacoesCard';
import ListItemCard from '../components/ListItemCard';
import SearchInput from '../components/SearchInput';
import EmptyState from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'HistoricoDoacoes'>;

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
            <ScreenHeader title="Minhas Doações" />

            {resumoDoacoes && (
              <ResumoDoacoesCard
                totalGeralUnidades={resumoDoacoes.totalGeralUnidades}
                totalGeralDoacoes={resumoDoacoes.totalGeralDoacoes}
                itensOrdenados={resumoDoacoes.itensOrdenados}
              />
            )}

            <SearchInput
              value={busca}
              onChangeText={setBusca}
              placeholder="Buscar por tipo de item..."
            />
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
                    ? () => navigation.navigate('CadastroDoacao')
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
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 4,
    paddingHorizontal: 16,
  },
  listaConteudo: {
    paddingBottom: 24,
  },
  itemWrapper: {
    paddingHorizontal: 16,
  },
  emptyWrapper: {
    paddingHorizontal: 16,
  },
});