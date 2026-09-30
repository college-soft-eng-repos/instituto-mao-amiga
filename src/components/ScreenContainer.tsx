// src/components/ScreenContainer.tsx
import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenContainerProps = {
  children: ReactNode;
  withPadding?: boolean;
};

export default function ScreenContainer({ children, withPadding = true }: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={[styles.container, withPadding && styles.withPadding]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Fundo geral unificado e refinado
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  withPadding: {
    paddingHorizontal: 20, // Espaçamento lateral padrão limpo e consistente
  },
});