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
    <View style={styles.cardContainer}>
      {/* Linha Superior: Ícone + Métricas Principais Lado a Lado */}
      <View style={styles.headerRow}>
        <View style={styles.iconeContainer}>
          <Feather name="bar-chart-2" size={16} color="#2563EB" />
        </View>
        <Text style={styles.tituloSecao}>Resumo Geral</Text>
      </View>

      <View style={styles.metricasRow}>
        <View style={styles.metricaItem}>
          <Text style={styles.metricaValor}>{totalGeralUnidades}</Text>
          <Text style={styles.metricaLabel}>Unidades</Text>
        </View>

        <View style={styles.divisorVertical} />

        <View style={styles.metricaItem}>
          <Text style={styles.metricaValor}>{totalGeralDoacoes}</Text>
          <Text style={styles.metricaLabel}>
            {totalGeralDoacoes === 1 ? 'Registro' : 'Registros'}
          </Text>
        </View>
      </View>

      {/* Linha Inferior: Pílulas Compactas com a quantidade de unidades e o número de doações */}
      {itensOrdenados.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.pillsScrollContainer}
        >
          {itensOrdenados.map((item, index) => (
            <View key={index} style={styles.pill}>
              <View style={styles.bulletPequeno} />
              <Text style={styles.pillTexto}>
                <Text style={styles.pillDestaque}>{item.tipo}:</Text> {item.quantidade} un. ({item.totalDoacoes} {item.totalDoacoes === 1 ? 'x' : 'x'})
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 16,
    marginBottom: 8,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  iconeContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tituloSecao: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  metricasRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 6,
  },
  metricaValor: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  metricaLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  divisorVertical: {
    width: 1,
    height: '60%',
    backgroundColor: '#CBD5E1',
  },
  pillsScrollContainer: {
    gap: 6,
    paddingTop: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bulletPequeno: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#2563EB',
  },
  pillTexto: {
    fontSize: 12,
    color: '#475569',
  },
  pillDestaque: {
    fontWeight: '700',
    color: '#0F172A',
  },
});