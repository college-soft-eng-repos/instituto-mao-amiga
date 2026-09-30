// src/components/ScreenHeader.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ScreenHeaderProps = {
  title: string;
  size?: 'small' | 'medium' | 'large';
};

export default function ScreenHeader({ title, size = 'large' }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, size === 'medium' ? styles.mediumTitle : styles.largeTitle]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    color: '#0F172A',
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  largeTitle: {
    fontSize: 28,
  },
  mediumTitle: {
    fontSize: 20,
    marginTop: 12,
  },
});