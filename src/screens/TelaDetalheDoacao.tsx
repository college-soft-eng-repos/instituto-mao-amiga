import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { listarDoacoes, excluirDoacao } from '../services/doacoesStorage';
import { useConteudoResponsivo } from '../hooks/useConteudoResponsivo';
import CustomButton from '../components/CustomButton';
import ScreenContainer from '../components/ScreenContainer';
import InfoRow from '../components/InfoRow';

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
    <ScreenContainer>
      <View style={styles.conteudoInterno}>
        
        {/* Bloco Principal / Card de Detalhes limpo com InfoRow */}
        <View style={styles.card}>
          
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

          <InfoRow
            icon="layers"
            label="Quantidade"
            value={`${doacao.quantidade} unidades`}
          />

          <InfoRow
            icon="map-pin"
            label="Ponto de Destino"
            value={doacao.pontoDestino}
          />

          <InfoRow
            icon="clock"
            label="Data e Hora do Registo"
            value={dataFormatada}
            isLast={true}
          />
        </View>

        {/* Rodapé com botões padronizados */}
        <View style={styles.containerBotoes}>
          <CustomButton
            title="Editar doação"
            onPress={() => navigation.navigate('CadastroDoacao', { doacaoId: doacao.id })}
            variant="primary"
            icon="edit-3"
          />

          <CustomButton
            title="Excluir doação"
            onPress={confirmarExclusao}
            variant="danger-outline"
            icon="trash-2"
          />
        </View>

      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  conteudoInterno: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  flex1: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
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
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8C98A4',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  valorDestaque: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  divisor: {
    height: 1,
    backgroundColor: '#F1F3F5',
    marginVertical: 14,
  },
  erroTexto: {
    fontSize: 16,
    color: '#C62828',
    textAlign: 'center',
  },
  containerBotoes: {
    gap: 8,
    marginTop: 20,
  },
});