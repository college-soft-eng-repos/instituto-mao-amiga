import { View, Text, StyleSheet } from 'react-native';

type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  diasHorarios: string;
  recebeDistribui: string;
};

const pontosMock: Ponto[] = [
  {
    id: '1',
    nome: 'Ponto Centro — Igreja São José',
    endereco: 'Rua das Flores, 120 — Centro',
    diasHorarios: 'Segunda a sexta, 9h–17h',
    recebeDistribui:
      'Recebe alimentos não perecíveis e roupas; distribui cestas básicas às terças.',
  },
  {
    id: '2',
    nome: 'Ponto Norte — Associação Bairro Alto',
    endereco: 'Av. Brasil, 890 — Bairro Alto',
    diasHorarios: 'Terça e quinta, 14h–19h',
    recebeDistribui:
      'Recebe hortifruti de feiras; distribui kits de higiene aos sábados.',
  },
  {
    id: '3',
    nome: 'Ponto Sul — Mercado Comunitário',
    endereco: 'Travessa do Sol, 45 — Vila Nova',
    diasHorarios: 'Sábado, 8h–12h',
    recebeDistribui:
      'Recebe doações de famílias e mercados; distribui refeições prontas no mesmo dia.',
  },
];

function PontoItem({ ponto }: { ponto: Ponto }) {
  return (
    <View style={styles.item}>
      <Text style={styles.nome}>{ponto.nome}</Text>
      <Text style={styles.endereco}>{ponto.endereco}</Text>
    </View>
  );
}

export default function TelaListaPontos() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Pontos de coleta / distribuição</Text>
      {pontosMock.map((ponto) => (
        <PontoItem key={ponto.id} ponto={ponto} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 16,
  },
  item: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  endereco: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
});
