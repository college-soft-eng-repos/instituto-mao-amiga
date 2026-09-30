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
      <View style={styles.iconContainer}>
        <Feather name={icon} size={32} color="#94A3B8" />
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 240,
  },
});