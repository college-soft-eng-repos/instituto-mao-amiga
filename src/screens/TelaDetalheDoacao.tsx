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
      const confirmado = window.confirm('Tem certeza de que deseja apagar esta doação registrada?');
      if (confirmado) {
        executarExclusao();
      }
    } else {
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

  return (
    <TouchableOpacity 
      style={styles.modalOverlay} 
      activeOpacity={1} 
      onPress={() => navigation.goBack()}
    >
      <TouchableOpacity 
        style={styles.modalContent} 
        activeOpacity={1} 
        onPress={(e) => e.stopPropagation()}
      >
        <ModalHeader title="Detalhes da Doação" onClose={() => navigation.goBack()} />

        {carregando ? (
          <View style={styles.centralizado}>
            <ActivityIndicator size="large" color="#2563EB" />
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
                  <Feather name="package" size={22} color="#2563EB" />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.label}>Tipo do Item</Text>
                  <Text style={styles.valorDestaque}>{doacao.tipoItem}</Text>
                </View>
              </View>

              <View style={styles.divisor} />

              <InfoRow icon="layers" label="Quantidade" value={`${doacao.quantidade} unidades`} />
              <InfoRow icon="map-pin" label="Ponto de Destino" value={pontoDestinoLimpo(doacao.pontoDestino)} />
              <InfoRow 
                icon="clock" 
                label="Data e Hora do Registro" 
                value={new Date(doacao.criadoEm).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'medium' })} 
                isLast={true} 
              />
            </View>

            {/* Botões lado a lado modernos */}
            <View style={styles.containerBotoes}>
              <View style={styles.botaoWrapper}>
                <CustomButton
                  title="Excluir"
                  onPress={confirmarExclusao}
                  variant="danger-outline"
                  icon="trash-2"
                />
              </View>
              <View style={styles.botaoWrapper}>
                <CustomButton
                  title="Editar"
                  onPress={() => navigation.navigate('CadastrarModal', { doacaoId: doacao.id } )}
                  variant="primary"
                  icon="edit-3"
                />
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

function pontoDestinoLimpo(nome: string) {
  return nome;
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
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
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 20,
  },
  cabecalhoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconeContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  valorDestaque: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  divisor: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  erroTexto: {
    fontSize: 15,
    color: '#DC2626',
    textAlign: 'center',
    fontWeight: '500',
  },
  containerBotoes: {
    flexDirection: 'row',
    gap: 12,
  },
  botaoWrapper: {
    flex: 1,
  },
});