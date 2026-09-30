import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'danger-outline';
  icon?: keyof typeof Feather.glyphMap;
  loading?: boolean;
};

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
}: CustomButtonProps) {
  // Define estilos dinâmicos com base na variante escolhida
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.btnSecondary;
      case 'outline':
        return styles.btnOutline;
      case 'danger':
        return styles.btnDanger;
      case 'danger-outline':
        return styles.btnDangerOutline;
      default:
        return styles.btnPrimary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.textSecondary;
      case 'outline':
        return styles.textOutline;
      case 'danger-outline':
        return styles.textDangerOutline;
      default:
        return styles.textPrimary;
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'secondary':
      case 'outline':
        return '#1B3A5C';
      case 'danger-outline':
        return '#DC3545';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.baseButton, getButtonStyle()]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={getIconColor()} />
      ) : (
        <>
          {icon && <Feather name={icon} size={18} color={getIconColor()} style={styles.iconStyle} />}
          <Text style={[styles.baseText, getTextStyle()]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    minHeight: 48,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  baseText: {
    fontWeight: '600',
    fontSize: 15,
  },
  iconStyle: {
    marginRight: 8,
  },
  // Variantes
  btnPrimary: {
    backgroundColor: '#1B3A5C',
    shadowColor: '#1B3A5C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  btnSecondary: {
    backgroundColor: '#F0F4F8',
    borderWidth: 1,
    borderColor: '#1B3A5C',
  },
  textSecondary: {
    color: '#1B3A5C',
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  textOutline: {
    color: '#475569',
  },
  btnDanger: {
    backgroundColor: '#DC3545',
  },
  btnDangerOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#DC3545',
  },
  textDangerOutline: {
    color: '#DC3545',
  },
});