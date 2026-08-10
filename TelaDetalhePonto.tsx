import { View, Text, StyleSheet } from 'react-native';

type Ponto = {
  nome: string;
  endereco: string;
  diasHorarios: string;
  recebeDistribui: string;
};

const pontoMock: Ponto = {
  nome: 'Ponto Centro — Igreja São José',
  endereco: 'Rua das Flores, 120 — Centro',
  diasHorarios: 'Segunda a sexta, 9h–17h',
  recebeDistribui:
    'Recebe alimentos não perecíveis e roupas; distribui cestas básicas às terças.',
};

function DetalhePonto({ ponto }: { ponto: Ponto }) {
  return (
    <View style={styles.container}>
      <Text style={styles.nome}>{ponto.nome}</Text>
      <Text style={styles.rotulo}>Endereço</Text>
      <Text style={styles.texto}>{ponto.endereco}</Text>
      <Text style={styles.rotulo}>Dias e horários</Text>
      <Text style={styles.texto}>{ponto.diasHorarios}</Text>
      <Text style={styles.rotulo}>Recebe / distribui</Text>
      <Text style={styles.texto}>{ponto.recebeDistribui}</Text>
    </View>
  );
}

export default function TelaDetalhePonto() {
  return <DetalhePonto ponto={pontoMock} />;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
    marginTop: 12,
  },
  texto: {
    fontSize: 16,
    color: '#333333',
    marginTop: 4,
  },
});
