import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { listarDoacoes, excluirDoacao } from '../services/doacoesStorage';
import CustomButton from '../components/CustomButton';
import ModalHeader from '../components/ModalHeader';
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

  return (
    /* TouchableOpacity transparente para fechar o modal ao clicar fora do card */
    <TouchableOpacity 
      style={styles.modalOverlay} 
      activeOpacity={1} 
      onPress={() => navigation.goBack()}
    >
      {/* Container principal do modal (activeOpacity={1} para não fechar ao clicar dentro do card) */}
      <TouchableOpacity 
        style={styles.modalContent} 
        activeOpacity={1} 
        onPress={(e) => e.stopPropagation()}
      >
        <ModalHeader title="Detalhes da Doação" onClose={() => navigation.goBack()} />

        {carregando ? (
          <View style={styles.centralizado}>
            <ActivityIndicator size="large" color="#1B3A5C" />
          </View>
        ) : !doacao ? (
          <View style={styles.centralizado}>
            <Text style={styles.erroTexto}>Doação não encontrada ou já excluída.</Text>
          </View>
        ) : (
          <View style={styles.conteudoInterno}>
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

              <InfoRow icon="layers" label="Quantidade" value={`${doacao.quantidade} unidades`} />
              <InfoRow icon="map-pin" label="Ponto de Destino" value={doacao.pontoDestino} />
              <InfoRow 
                icon="clock" 
                label="Data e Hora do Registo" 
                value={new Date(doacao.criadoEm).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'medium' })} 
                isLast={true} 
              />
            </View>

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
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro translúcido (efeito blur/overlay)
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  centralizado: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conteudoInterno: {
    justifyContent: 'space-between',
  },
  flex1: {
    flex: 1,
  },
  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
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
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  erroTexto: {
    fontSize: 16,
    color: '#C62828',
    textAlign: 'center',
  },
  containerBotoes: {
    gap: 8,
  },
});