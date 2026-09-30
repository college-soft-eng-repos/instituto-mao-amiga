// src/components/ScreenContainer.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useConteudoResponsivo } from '../hooks/useConteudoResponsivo';

type ScreenContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  withPadding?: boolean;
};

export default function ScreenContainer({
  children,
  style,
  withPadding = true,
}: ScreenContainerProps) {
  const { conteudoStyle } = useConteudoResponsivo();

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right', 'top']}>
      <View style={[styles.inner, withPadding && styles.defaultPadding, conteudoStyle, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  inner: {
    flex: 1,
  },
  defaultPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});