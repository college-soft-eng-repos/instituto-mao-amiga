import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { listarDoacoes } from '../services/doacoesStorage';
import { useConteudoResponsivo } from '../hooks/useConteudoResponsivo';
import ResumoDoacoesCard from '../components/ResumoDoacoesCard';
import ListItemCard from '../components/ListItemCard'; // <-- Importado

type Props = NativeStackScreenProps<RootStackParamList, 'HistoricoDoacoes'>;

type Doacao = {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
  criadoEm: string;
};

export default function TelaHistoricoDoacoes({ navigation }: Props) {
  const { conteudoStyle } = useConteudoResponsivo();
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
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={doacoesFiltradas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listaConteudo, conteudoStyle]}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.titulo}>Minhas Doações</Text>

            {resumoDoacoes && (
              <ResumoDoacoesCard
                totalGeralUnidades={resumoDoacoes.totalGeralUnidades}
                totalGeralDoacoes={resumoDoacoes.totalGeralDoacoes}
                itensOrdenados={resumoDoacoes.itensOrdenados}
              />
            )}

            <TextInput
              style={styles.inputBusca}
              placeholder="Buscar por tipo de item..."
              placeholderTextColor="#8C98A4"
              value={busca}
              onChangeText={setBusca}
              autoCorrect={false}
            />
          </View>
        }
        renderItem={({ item }) => {
          const dataFormatada = new Date(item.criadoEm).toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
          });

          return (
            <ListItemCard
              titulo={item.tipoItem}
              subtitulo={`Destino: ${item.pontoDestino}`}
              badge={`${item.quantidade} un.`}
              detalheRodape={`Registrado em: ${dataFormatada}`}
              onPress={() => navigation.navigate('DetalheDoacao', { doacaoId: item.id })}
            />
          );
        }}
        ListEmptyComponent={
          !carregando ? (
            <View style={styles.vazioContainer}>
              {doacoes.length === 0 ? (
                <>
                  <Text style={styles.vazioTexto}>Nenhuma doação registrada ainda.</Text>
                  <TouchableOpacity
                    style={styles.botaoCadastrarVazio}
                    onPress={() => navigation.navigate('CadastroDoacao')}
                  >
                    <Text style={styles.botaoCadastrarVazioTexto}>Cadastrar primeira doação</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.vazioTexto}>
                  Nenhuma doação encontrada para "{busca}".
                </Text>
              )}
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 4,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 14,
  },
  inputBusca: {
    minHeight: 46,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    color: '#212529',
    backgroundColor: '#FFFFFF',
    fontSize: 15,
  },
  listaConteudo: {
    paddingBottom: 24,
  },
  vazioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  vazioTexto: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  botaoCadastrarVazio: {
    backgroundColor: '#1B3A5C',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoCadastrarVazioTexto: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});