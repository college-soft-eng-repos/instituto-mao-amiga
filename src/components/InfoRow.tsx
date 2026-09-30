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
        <Feather name={icon} size={18} color="#6C757D" style={styles.icon} />
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
    color: '#8C98A4',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    color: '#212529',
    fontWeight: '500',
    lineHeight: 20,
  },
  divisor: {
    height: 1,
    backgroundColor: '#F1F3F5',
    marginVertical: 14,
  },
});