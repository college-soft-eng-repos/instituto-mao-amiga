import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

type ListItemCardProps = {
  titulo: string;
  subtitulo: string;
  badge?: string;
  detalheRodape?: string;
  iconeNome?: keyof typeof Feather.glyphMap;
  onPress: () => void;
};

export default function ListItemCard({
  titulo,
  subtitulo,
  badge,
  detalheRodape,
  iconeNome = 'chevron-right',
  onPress,
}: ListItemCardProps) {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardConteudo}>
        <View style={styles.headerLinha}>
          <Text style={styles.titulo} numberOfLines={1}>{titulo}</Text>
          {badge && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeTexto}>{badge}</Text>
            </View>
          )}
        </View>

        <Text style={styles.subtitulo} numberOfLines={2}>{subtitulo}</Text>

        {detalheRodape && (
          <Text style={styles.detalheRodape}>{detalheRodape}</Text>
        )}
      </View>
      <Feather name={iconeNome} size={18} color="#A0AEC0" style={styles.iconeSeta} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  cardConteudo: {
    flex: 1,
  },
  headerLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B3A5C',
    flex: 1,
    marginRight: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
    lineHeight: 20,
  },
  detalheRodape: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  badgeContainer: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
  },
  iconeSeta: {
    marginLeft: 8,
  },
});