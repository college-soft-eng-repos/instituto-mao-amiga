// src/components/EmptyState.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import CustomButton from './CustomButton';

type EmptyStateProps = {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  actionTitle?: string;
  onActionPress?: () => void;
};

export default function EmptyState({
  icon = 'inbox',
  title,
  subtitle,
  actionTitle,
  onActionPress,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {/* Container do ícone atualizado com a identidade em Azul Royal */}
      <View style={styles.iconContainer}>
        <Feather name={icon} size={28} color="#2563EB" />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {actionTitle && onActionPress && (
        <View style={styles.buttonWrapper}>
          <CustomButton
            title={actionTitle}
            onPress={onActionPress}
            variant="primary"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF', // Fundo azul suave moderno
    borderWidth: 1,
    borderColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A', // Tom Slate escuro padrão do app
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B', // Slate intermediário limpo
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 240,
  },
});