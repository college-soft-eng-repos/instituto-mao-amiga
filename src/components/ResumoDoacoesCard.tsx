import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

type ResumoItem = {
  tipo: string;
  quantidade: number;
  totalDoacoes: number;
};

type ResumoDoacoesCardProps = {
  totalGeralUnidades: number;
  totalGeralDoacoes: number;
  itensOrdenados: ResumoItem[];
};

export default function ResumoDoacoesCard({
  totalGeralUnidades,
  totalGeralDoacoes,
  itensOrdenados,
}: ResumoDoacoesCardProps) {
  return (
    <View style={styles.resumoCard}>
      <View style={styles.resumoTopo}>
        <View style={styles.iconeHeaderResumo}>
          <Feather name="bar-chart-2" size={18} color="#1B3A5C" />
        </View>
        <View>
          <Text style={styles.resumoTitulo}>Resumo do Instituto</Text>
          <Text style={styles.resumoSubtitulo}>
            <Text style={styles.textoBold}>{totalGeralUnidades}</Text> unidades no total ({totalGeralDoacoes} {totalGeralDoacoes === 1 ? 'registro' : 'registros'})
          </Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.pillsContainer}
      >
        {itensOrdenados.map((item, index) => (
          <View key={index} style={styles.pill}>
            <Feather name="package" size={12} color="#1B3A5C" />
            <Text style={styles.pillTexto}>
              <Text style={styles.pillDestaque}>{item.tipo}:</Text> {item.quantidade} un. ({item.totalDoacoes} {item.totalDoacoes === 1 ? 'doação' : 'doações'})
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
});