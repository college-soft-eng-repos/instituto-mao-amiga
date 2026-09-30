// src/components/ModalHeader.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenHeader from './ScreenHeader';

type ModalHeaderProps = {
  title: string;
  onClose: () => void;
};

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tituloWrapper}>
        <ScreenHeader title={title} />
      </View>
      <TouchableOpacity onPress={onClose} style={styles.botaoFechar} activeOpacity={0.7}>
        <Feather name="x" size={20} color="#4A5568" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Alinha perfeitamente no eixo vertical
    marginBottom: 16,
  },
  tituloWrapper: {
    flex: 1,
  },
  botaoFechar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});