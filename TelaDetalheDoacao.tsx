import React, { useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
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

  // Substituímos o useEffect simples por useFocusEffect para recarregar ao voltar da edição
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function carregarDetalhes() {
        setCarregando(true);
        const lista = await listarDoacoes();
        const encontrada = lista.find((item: Doacao) => item.id === doacaoId);
        
        if (isMounted) {
          setDoacao(encontrada || null);
          setCarregando(false);
        }
      }
      carregarDetalhes();
      return () => {
        isMounted = false;
      };
    }, [doacaoId])
  );

  async function executarExclusao() {
    try {
      await excluirDoacao(doacaoId);
      navigation.goBack();
    } catch (error) {
      console.error('ERRO na exclusão:', error);
      Alert.alert('Erro', 'Não foi possível excluir a doação.');
    }
  }

  function confirmarExclusao() {
    if (Platform.OS === 'web') {
      const confirmado = window.confirm('Tem certeza de que deseja apagar esta doação registada?');
      if (confirmado) {
        executarExclusao();
      }
    } else {
      Alert.alert(
        'Excluir doação',
        'Tem certeza de que deseja apagar esta doação registada?',
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
        
        {/* Bloco Principal / Card de Detalhes */}
        <View style={styles.card}>
          
          {/* Cabeçalho do Card com Destaque */}
          <View style={styles.cabecalhoCard}>
            <View style={styles.iconeContainer}>
              <Feather name="package" size={24} color="#1B3A5C" />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.label}>Tipo do Item</Text>
              <Text style={styles.valorDestaque}>{doacao.tipoItem}</Text>
            </View>
          </View>

          <View style={styles.divisor} />

          {/* Linha: Quantidade */}
          <View style={styles.linhaDetalhe}>
            <Feather name="layers" size={18} color="#6C757D" style={styles.iconeLinha} />
            <View style={styles.flex1}>
              <Text style={styles.label}>Quantidade</Text>
              <Text style={styles.valor}>{doacao.quantidade} unidades</Text>
            </View>
          </View>

          <View style={styles.divisor} />

          {/* Linha: Ponto de Destino */}
          <View style={styles.linhaDetalhe}>
            <Feather name="map-pin" size={18} color="#6C757D" style={styles.iconeLinha} />
            <View style={styles.flex1}>
              <Text style={styles.label}>Ponto de Destino</Text>
              <Text style={styles.valor}>{doacao.pontoDestino}</Text>
            </View>
          </View>

          <View style={styles.divisor} />

          {/* Linha: Data e Hora */}
          <View style={styles.linhaDetalhe}>
            <Feather name="clock" size={18} color="#6C757D" style={styles.iconeLinha} />
            <View style={styles.flex1}>
              <Text style={styles.label}>Data e Hora do Registo</Text>
              <Text style={styles.valorData}>{dataFormatada}</Text>
            </View>
          </View>

        </View>

        {/* Rodapé com Ações */}
        <View style={styles.containerBotoes}>
          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() => navigation.navigate('CadastroDoacao', { doacaoId: doacao.id })}
          >
            <Feather name="edit-3" size={18} color="#FFFFFF" style={styles.iconeBotao} />
            <Text style={styles.botaoEditarTexto}>Editar doação</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoExcluirOutline} onPress={confirmarExclusao}>
            <Feather name="trash-2" size={18} color="#DC3545" style={styles.iconeBotao} />
            <Text style={styles.botaoExcluirTextoOutline}>Excluir doação</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
    justifyContent: 'space-between', // Distribui perfeitamente topo e rodapé se houver espaço
  },
  flex1: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: { ios: 0.04, web: 0.04 } as any,
    shadowRadius: 8,
    elevation: 2,
  },
  cabecalhoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconeContainer: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#E8EEF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linhaDetalhe: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  iconeLinha: {
    marginTop: 2,
  },
  divisor: {
    height: 1,
    backgroundColor: '#F1F3F5',
    marginVertical: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8C98A4',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  valor: {
    fontSize: 15,
    color: '#212529',
    fontWeight: '500',
    lineHeight: 20,
  },
  valorDestaque: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  valorData: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 18,
  },
  erroTexto: {
    fontSize: 16,
    color: '#C62828',
    textAlign: 'center',
  },
  containerBotoes: {
    gap: 10,
    marginTop: 20,
  },
  botaoEditar: {
    backgroundColor: '#1B3A5C',
    borderRadius: 10,
    minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#1B3A5C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  botaoEditarTexto: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  botaoExcluirOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#DC3545',
    borderRadius: 10,
    minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  botaoExcluirTextoOutline: {
    color: '#DC3545',
    fontWeight: '600',
    fontSize: 16,
  },
  iconeBotao: {
    marginRight: 2,
  },
});