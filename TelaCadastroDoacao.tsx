import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';
import { pontosMock } from './TelaListaPontos';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroDoacao'>;

export default function TelaCadastroDoacao({ navigation }: Props) {
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestinoId, setPontoDestinoId] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const inputQuantidadeRef = useRef<TextInput>(null);

  function validarESalvar() {
    setSucesso('');

    if (tipoItem.trim() === '') {
      setErro('Informe o tipo do item (ex.: arroz, roupa, leite).');
      return;
    }

    const quantidadeNumerica = Number(quantidade.trim());
    if (
      quantidade.trim() === '' ||
      isNaN(quantidadeNumerica) ||
      !Number.isInteger(quantidadeNumerica) ||
      quantidadeNumerica < 1
    ) {
      setErro('A quantidade precisa ser um número inteiro maior que zero.');
      return;
    }

    if (pontoDestinoId === '') {
      setErro('Selecione o ponto de destino da doação.');
      return;
    }

    const ponto = pontosMock.find((p) => p.id === pontoDestinoId);
    setErro('');
    setSucesso(
      `Doação registrada: ${quantidadeNumerica}x ${tipoItem.trim()} → ${ponto?.nome ?? 'ponto selecionado'}.`
    );
    setTipoItem('');
    setQuantidade('');
    setPontoDestinoId('');
    Keyboard.dismiss();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>Cadastrar doação</Text>

      <Text style={styles.rotulo}>Tipo do item</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: arroz, roupa, leite"
        placeholderTextColor="#888888"
        value={tipoItem}
        onChangeText={setTipoItem}
        returnKeyType="next"
        onSubmitEditing={() => inputQuantidadeRef.current?.focus()}
      />

      <Text style={styles.rotulo}>Quantidade</Text>
      <TextInput
        ref={inputQuantidadeRef}
        style={styles.input}
        placeholder="Ex.: 10"
        placeholderTextColor="#888888"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="number-pad"
        returnKeyType="done"
        onSubmitEditing={validarESalvar}
      />

      <Text style={styles.rotulo}>Ponto de destino</Text>
      {pontosMock.map((ponto) => (
        <TouchableOpacity
          key={ponto.id}
          style={[
            styles.pontoOpcao,
            pontoDestinoId === ponto.id && styles.pontoSelecionado,
          ]}
          onPress={() => setPontoDestinoId(ponto.id)}
        >
          <Text
            style={[
              styles.pontoNome,
              pontoDestinoId === ponto.id && styles.pontoNomeSelecionado,
            ]}
          >
            {ponto.nome}
          </Text>
        </TouchableOpacity>
      ))}

      {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
      {sucesso !== '' && <Text style={styles.sucesso}>{sucesso}</Text>}

      <TouchableOpacity style={styles.botao} onPress={validarESalvar}>
        <Text style={styles.botaoTexto}>Registrar doação</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoSecundario}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.botaoSecundarioTexto}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 20,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },
  pontoOpcao: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  pontoSelecionado: {
    borderColor: '#1B3A5C',
    backgroundColor: '#E8EEF4',
  },
  pontoNome: {
    fontSize: 14,
    color: '#333333',
  },
  pontoNomeSelecionado: {
    fontWeight: '600',
    color: '#1B3A5C',
  },
  erro: {
    color: '#C62828',
    fontSize: 14,
    marginTop: 12,
  },
  sucesso: {
    color: '#2E7D32',
    fontSize: 14,
    marginTop: 12,
  },
  botao: {
    backgroundColor: '#1B3A5C',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  botaoSecundario: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoSecundarioTexto: {
    color: '#666666',
    fontWeight: '600',
    fontSize: 16,
  },
});
