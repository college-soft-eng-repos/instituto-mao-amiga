import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
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

// Componente separado e otimizado com React.memo 
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
  const [carregando, setCarregando] = useState(true);

  // Recarrega as doações sempre que a tela entra em foco
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

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={[styles.headerContainer, conteudoStyle]}>
        <Text style={styles.titulo}>Minhas Doações</Text>
      </View>

      <FlatList
        data={doacoes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listaConteudo, conteudoStyle]}
        renderItem={({ item }) => <DoacaoItem item={item} 
        onPress={() => navigation.navigate('DetalheDoacao', { doacaoId: item.id })} />}
        ListEmptyComponent={
          !carregando ? (
            <View style={styles.vazioContainer}>
              <Text style={styles.vazioTexto}>Nenhuma doação registrada ainda.</Text>
              <TouchableOpacity
                style={styles.botaoCadastrarVazio}
                onPress={() => navigation.navigate('CadastroDoacao')}
              >
                <Text style={styles.botaoCadastrarVazioTexto}>Cadastrar primeira doação</Text>
              </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  listaConteudo: {
    paddingBottom: 24,
  },
  itemContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 16,
    marginBottom: 12,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  itemDestino: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  itemData: {
    fontSize: 12,
    color: '#888888',
  },
  vazioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  vazioTexto: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
    textAlign: 'center',
  },
  botaoCadastrarVazio: {
    backgroundColor: '#1B3A5C',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoCadastrarVazioTexto: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});