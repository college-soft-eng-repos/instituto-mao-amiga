import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TelaListaPontos from './TelaListaPontos';
import TelaDetalhePonto from './TelaDetalhePonto';

export default function App() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <TelaListaPontos />
      <View style={styles.separador}>
        <Text style={styles.separadorTexto}>Detalhe (exemplo)</Text>
      </View>
      <TelaDetalhePonto />
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingTop: 85,
    paddingBottom: 40,
  },
  separador: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
  },
  separadorTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888888',
  },
});
