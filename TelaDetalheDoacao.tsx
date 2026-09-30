import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';
import { listarDoacoes, excluirDoacao } from './storage/doacoesStorage';
import { useConteudoResponsivo } from './useConteudoResponsivo';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheDoacao'>;

type Doacao = {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
  criadoEm: string;
};

export default function TelaDetalheDoacao({ route, navigation }: Props) {
  const { doacaoId } = route.params;
  const { conteudoStyle } = useConteudoResponsivo();
  const [doacao, setDoacao] = useState<Doacao | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDetalhes() {
      const lista = await listarDoacoes();
      const encontrada = lista.find((item: Doacao) => item.id === doacaoId);
      setDoacao(encontrada || null);
      setCarregando(false);
    }
    carregarDetalhes();
  }, [doacaoId]);

  // Função auxiliar assíncrona isolada para realizar a exclusão
  async function executarExclusao() {
    try {
      await excluirDoacao(doacaoId);
      navigation.goBack();
    } catch (error) {
      console.error('ERRO na exclusão:', error);
      Alert.alert('Erro', 'Não foi possível excluir a doação.');
    }
  }

  // Função chamada pelo botão que dispara o Alert nativo
  function confirmarExclusao() {
    if (Platform.OS === 'web') {
      // Fallback limpo para a versão Web usando a API padrão do browser
      const confirmado = window.confirm('Tem certeza de que deseja apagar esta doação registrada?');
      if (confirmado) {
        executarExclusao();
      }
    } else {
      // Comportamento nativo para iOS e Android
      Alert.alert(
        'Excluir doação',
        'Tem certeza de que deseja apagar esta doação registrada?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: () => executarExclusao(),
          },
        ]
      );
    }
  }

  if (carregando) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" color="#1B3A5C" />
      </View>
    );
  }

  if (!doacao) {
    return (
      <View style={[styles.centralizado, conteudoStyle]}>
        <Text style={styles.erroTexto}>Doação não encontrada ou já excluída.</Text>
      </View>
    );
  }

  const dataFormatada = new Date(doacao.criadoEm).toLocaleString('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'medium',
  });

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={[styles.conteudo, conteudoStyle]}>
        <View style={styles.card}>
          <Text style={styles.label}>Tipo do Item</Text>
          <Text style={styles.valorDestaque}>{doacao.tipoItem}</Text>

          <Text style={styles.label}>Quantidade</Text>
          <Text style={styles.valor}>{doacao.quantidade} unidades</Text>

          <Text style={styles.label}>Ponto de Destino</Text>
          <Text style={styles.valor}>{doacao.pontoDestino}</Text>

          <Text style={styles.label}>Data e Hora do Registro</Text>
          <Text style={styles.valor}>{dataFormatada}</Text>
        </View>

        <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarExclusao}>
          <Text style={styles.botaoExcluirTexto}>Excluir doação</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  conteudo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 20,
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  valor: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  valorDestaque: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 4,
  },
  erroTexto: {
    fontSize: 16,
    color: '#C62828',
    textAlign: 'center',
  },
  botaoExcluir: {
    backgroundColor: '#C62828',
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginBottom: 16,
  },
  botaoExcluirTexto: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});