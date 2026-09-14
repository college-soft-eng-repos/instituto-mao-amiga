import { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useConteudoResponsivo } from './useConteudoResponsivo';

export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  diasHorarios: string;
  recebeDistribui: string;
};

export const pontosMock: Ponto[] = [
  {
    id: '1',
    nome: 'Ponto Centro — Igreja São José',
    endereco: 'Rua das Flores, 120, Centro, São Luís - MA, CEP 65010-000',
    diasHorarios: 'Segunda a sexta, 9h–17h',
    recebeDistribui:
      'Recebe alimentos não perecíveis e roupas; distribui cestas básicas às terças.',
  },
  {
    id: '2',
    nome: 'Ponto Norte — Associação Bairro Alto',
    endereco: 'Av. Brasil, 890, Bairro Alto, São Luís - MA, CEP 65040-210',
    diasHorarios: 'Terça e quinta, 14h–19h',
    recebeDistribui:
      'Recebe hortifruti de feiras; distribui kits de higiene aos sábados.',
  },
  {
    id: '3',
    nome: 'Ponto Sul — Mercado Comunitário',
    endereco: 'Travessa do Sol, 45, Vila Nova, São Luís - MA, CEP 65060-120',
    diasHorarios: 'Sábado, 8h–12h',
    recebeDistribui:
      'Recebe doações de famílias e mercados; distribui refeições prontas no mesmo dia.',
  },
  {
    id: '4',
    nome: 'Ponto Leste — Escola Municipal Aurora',
    endereco: 'Rua Aurora, 310, Cohama, São Luís - MA, CEP 65074-180',
    diasHorarios: 'Quarta e sexta, 10h–16h',
    recebeDistribui:
      'Recebe material escolar e lanches; distribui kits infantis às sextas.',
  },
  {
    id: '5',
    nome: 'Ponto Oeste — Centro Comunitário Liberdade',
    endereco: 'Av. dos Holandeses, 1500, Calhau, São Luís - MA, CEP 65071-380',
    diasHorarios: 'Segunda, quarta e sábado, 8h–12h',
    recebeDistribui:
      'Recebe roupas e calçados; distribui enxovais para famílias cadastradas.',
  },
  {
    id: '6',
    nome: 'Ponto Anil — Paróquia Nossa Senhora',
    endereco: 'Rua do Anil, 78, Anil, São Luís - MA, CEP 65046-140',
    diasHorarios: 'Domingo, 7h–11h',
    recebeDistribui:
      'Recebe alimentos perecíveis da feira; distribui café da manhã comunitário.',
  },
  {
    id: '7',
    nome: 'Ponto João Paulo — Associação de Moradores',
    endereco: 'Rua das Palmeiras, 220, João Paulo, São Luís - MA, CEP 65050-000',
    diasHorarios: 'Terça a sábado, 13h–18h',
    recebeDistribui:
      'Recebe produtos de limpeza e higiene; distribui cestas às quintas.',
  },
];

type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: string };
  CadastroDoacao: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Lista'>;
};

function PontoItem({
  ponto,
  onPress,
}: {
  ponto: Ponto;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.nome}>{ponto.nome}</Text>
      <Text style={styles.endereco}>{ponto.endereco}</Text>
    </TouchableOpacity>
  );
}

export default function TelaListaPontos({ navigation }: Props) {
  const [busca, setBusca] = useState('');
  const { conteudoStyle } = useConteudoResponsivo();
  const pontosFiltrados = useMemo(() => {
    return pontosMock.filter((ponto) =>
      ponto.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [busca]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {/*
        Issue #06: padding lateral + largura relativa (useConteudoResponsivo)
        no contentContainerStyle, para não grudar na borda nem esticar em tablet.
      */}
      <FlatList
        style={styles.lista}
        data={pontosFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listaConteudo, conteudoStyle]}
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            <Text style={styles.titulo}>Buscar Pontos</Text>
            <TextInput
              style={styles.inputBusca}
              placeholder="Buscar pontos..."
              placeholderTextColor="#7c7c8a"
              value={busca}
              onChangeText={setBusca}
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.botaoCadastro}
              onPress={() => navigation.navigate('CadastroDoacao')}
            >
              <Text style={styles.botaoCadastroTexto}>+ Cadastrar doação</Text>
            </TouchableOpacity>
            <Text style={styles.titulo}>Todos os Pontos</Text>
          </View>
        }
        renderItem={({ item }) => (
          <PontoItem
            ponto={item}
            onPress={() => navigation.navigate('Detalhe', { pontoId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  lista: {
    flex: 1,
  },
  listaConteudo: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  cabecalho: {
    marginBottom: 4,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 12,
    flexShrink: 1,
  },
  item: {
    // Issue #06 / revisão em pares: alvo de toque mínimo 44px (WCAG 2.5.5)
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B3A5C',
    flexShrink: 1,
  },
  endereco: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    flexShrink: 1,
    lineHeight: 20,
  },
  inputBusca: {
    // Issue #06 / revisão em pares: height 40 → minHeight 44 (alvo de toque)
    minHeight: 44,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
    color: '#000000',
  },
  botaoCadastro: {
    backgroundColor: '#1B3A5C',
    padding: 12,
    borderRadius: 8,
    // Issue #06: alvo de toque mínimo 44px + texto centralizado
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  botaoCadastroTexto: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
