// src/components/ScreenHeader.tsx
import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

type ScreenHeaderProps = {
  title: string;
  size?: 'large' | 'medium';
  style?: TextStyle;
};

export default function ScreenHeader({
  title,
  size = 'large',
  style,
}: ScreenHeaderProps) {
  return (
    <Text style={[size === 'large' ? styles.tituloLarge : styles.tituloMedium, style]}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  tituloLarge: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 14,
  },
  tituloMedium: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginTop: 12,
    marginBottom: 10,
  },
});