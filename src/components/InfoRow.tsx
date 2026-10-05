// src/components/InfoRow.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

type InfoRowProps = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string | number;
  isLast?: boolean;
};

export default function InfoRow({ icon, label, value, isLast = false }: InfoRowProps) {
  return (
    <View>
      <View style={styles.row}>
        {/* Ícone utilizando a cor padrão moderna do design system */}
        <Feather name={icon} size={18} color="#2563EB" style={styles.icon} />
        <View style={styles.content}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      </View>
      {!isLast && <View style={styles.divisor} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  icon: {
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B', // Slate refinado para os rótulos em caixa alta
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    color: '#0F172A', // Slate escuro para alta legibilidade dos valores
    fontWeight: '500',
    lineHeight: 20,
  },
  divisor: {
    height: 1,
    backgroundColor: '#E2E8F0', // Divisor sutil alinhado aos cards do app
    marginVertical: 14,
  },
});