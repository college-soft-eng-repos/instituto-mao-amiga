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
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.85}>
      {/* Indicador visual lateral */}
      <View style={styles.indicadorLateral} />

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
          <View style={styles.rodapeContainer}>
            <Feather name="clock" size={13} color="#94A3B8" style={styles.iconeRodape} />
            <Text style={styles.detalheRodape}>{detalheRodape}</Text>
          </View>
        )}
      </View>

      <View style={styles.setaContainer}>
        <Feather name={iconeNome} size={16} color="#CBD5E1" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  indicadorLateral: {
    width: 4,
    height: '70%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
    marginRight: 14,
  },
  cardConteudo: {
    flex: 1,
  },
  headerLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
    letterSpacing: -0.3,
  },
  subtitulo: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 10,
    lineHeight: 18,
    fontWeight: '400',
  },
  rodapeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  iconeRodape: {
    marginRight: 5,
  },
  detalheRodape: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  badgeContainer: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  setaContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});