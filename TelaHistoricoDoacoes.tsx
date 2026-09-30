import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';
import { listarDoacoes } from './storage/doacoesStorage';
import { useConteudoResponsivo } from './useConteudoResponsivo';

type Props = NativeStackScreenProps<RootStackParamList, 'HistoricoDoacoes'>;

type Doacao = {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
  criadoEm: string;
};

// Componente do item de histórico
const DoacaoItem = React.memo(({ item, onPress }: { item: Doacao; onPress: () => void }) => {
  const dataFormatada = new Date(item.criadoEm).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.itemCabecalho}>
        <Text style={styles.itemTipo}>{item.tipoItem}</Text>
        <Text style={styles.itemQtd}>{item.quantidade} un.</Text>
      </View>
      <Text style={styles.itemDestino}>Destino: {item.pontoDestino}</Text>
      <Text style={styles.itemData}>Registrado em: {dataFormatada}</Text>
    </TouchableOpacity>
  );
});

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

  // Calcula o resumo dinamicamente
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

            {/* Resumo Visual em Cards e Pills */}
            {resumoDoacoes && (
              <View style={styles.resumoCard}>
                <View style={styles.resumoTopo}>
                  <View style={styles.iconeHeaderResumo}>
                    <Feather name="bar-chart-2" size={18} color="#1B3A5C" />
                  </View>
                  <View>
                    <Text style={styles.resumoTitulo}>Resumo do Instituto</Text>
                    <Text style={styles.resumoSubtitulo}>
                      <Text style={styles.textoBold}>{resumoDoacoes.totalGeralUnidades}</Text> unidades no total ({resumoDoacoes.totalGeralDoacoes} {resumoDoacoes.totalGeralDoacoes === 1 ? 'registro' : 'registros'})
                    </Text>
                  </View>
                </View>

                {/* Pills deslizantes por tipo de item detalhando quantidade e número de doações */}
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  contentContainerStyle={styles.pillsContainer}
                >
                  {resumoDoacoes.itensOrdenados.map((item, index) => (
                    <View key={index} style={styles.pill}>
                      <Feather name="package" size={12} color="#1B3A5C" />
                      <Text style={styles.pillTexto}>
                        <Text style={styles.pillDestaque}>{item.tipo}:</Text> {item.quantidade} un. ({item.totalDoacoes} {item.totalDoacoes === 1 ? 'doação' : 'doações'})
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Campo de Busca */}
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
        renderItem={({ item }) => (
          <DoacaoItem
            item={item}
            onPress={() => navigation.navigate('DetalheDoacao', { doacaoId: item.id })}
          />
        )}
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
  resumoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  resumoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconeHeaderResumo: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#E8EEF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumoTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8C98A4',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resumoSubtitulo: {
    fontSize: 15,
    color: '#212529',
    marginTop: 2,
  },
  textoBold: {
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  pillsContainer: {
    gap: 8,
    paddingTop: 4,
    paddingBottom: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pillTexto: {
    fontSize: 13,
    color: '#475569',
  },
  pillDestaque: {
    fontWeight: '600',
    color: '#1B3A5C',
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
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  itemCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemTipo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  itemQtd: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  itemDestino: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
  },
  itemData: {
    fontSize: 12,
    color: '#94A3B8',
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