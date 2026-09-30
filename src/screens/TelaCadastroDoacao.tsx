import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { pontosMock } from './TelaListaPontos';
import ModalHeader from '../components/ModalHeader';
import CustomButton from '../components/CustomButton';
import { 
  salvarDoacao, 
  listarDoacoes, 
  atualizarDoacao, 
  carregarRascunho, 
  salvarRascunho, 
  limparRascunho 
} from '../services/doacoesStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroDoacao'>;

export default function TelaCadastroDoacao({ route, navigation }: Props) {
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestinoId, setPontoDestinoId] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(true);
  
  const inputQuantidadeRef = useRef<TextInput>(null);
  
  const doacaoId = route.params?.doacaoId;
  const [isEdicao, setIsEdicao] = useState(false);
  const [criadoEmOriginal, setCriadoEmOriginal] = useState<string | null>(null);

  useEffect(() => {
    async function inicializarTela() {
      try {
        if (doacaoId) {
          setIsEdicao(true);
          const lista = await listarDoacoes();
          const encontrada = lista.find((item: any) => String(item.id) === String(doacaoId));
          if (encontrada) {
            setTipoItem(encontrada.tipoItem || '');
            setQuantidade(String(encontrada.quantidade || ''));
            setCriadoEmOriginal(encontrada.criadoEm);
            
            const pontoEncontrado = pontosMock.find((p) => p.nome === encontrada.pontoDestino);
            if (pontoEncontrado) {
              setPontoDestinoId(pontoEncontrado.id);
            }
          }
        } else {
          const rascunho = await carregarRascunho();
          if (rascunho) {
            setTipoItem(rascunho.tipoItem || '');
            setQuantidade(rascunho.quantidade || '');
            setPontoDestinoId(rascunho.pontoDestinoId || '');
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar formulário:', error);
      } finally {
        setCarregando(false);
      }
    }
    inicializarTela();
  }, [doacaoId]);

  useEffect(() => {
    if (carregando || isEdicao) return;

    async function persistirRascunho() {
      await salvarRascunho({ tipoItem, quantidade, pontoDestinoId });
    }
    persistirRascunho();
  }, [tipoItem, quantidade, pontoDestinoId, carregando, isEdicao]);

  async function validarESalvar() {
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
    const nomePontoDestino = ponto?.nome ?? 'Ponto não especificado';

    try {
      if (isEdicao && doacaoId) {
        await atualizarDoacao({
          id: doacaoId,
          tipoItem: tipoItem.trim(),
          quantidade: quantidadeNumerica,
          pontoDestino: nomePontoDestino,
          criadoEm: criadoEmOriginal || new Date().toISOString(),
        });
        
        Keyboard.dismiss();
        navigation.goBack();
      } else {
        await salvarDoacao({
          tipoItem: tipoItem.trim(),
          quantidade: quantidadeNumerica,
          pontoDestino: nomePontoDestino,
        });

        setErro('');
        setSucesso(
          `Doação registrada: ${quantidadeNumerica}x ${tipoItem.trim()} → ${nomePontoDestino}.`
        );
        
        setTipoItem('');
        setQuantidade('');
        setPontoDestinoId('');
        Keyboard.dismiss();

        await limparRascunho();
      }
    } catch (error) {
      console.error('Erro ao salvar/atualizar a doação:', error);
      setErro('Erro ao processar a doação.');
    }
  }

  return (
    <TouchableOpacity 
      style={styles.modalOverlay} 
      activeOpacity={1} 
      onPress={() => navigation.goBack()}
    >
      <TouchableOpacity 
        style={styles.modalContent} 
        activeOpacity={1} 
        onPress={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho fixo no topo do modal */}
        <ModalHeader 
          title={isEdicao ? 'Editar doação' : 'Cadastrar doação'} 
          onClose={() => navigation.goBack()} 
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.conteudo}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.rotulo}>Tipo do item</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: arroz, roupa, leite"
              placeholderTextColor="#8C98A4"
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
              placeholderTextColor="#8C98A4"
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="number-pad"
              returnKeyType="done"
              onSubmitEditing={validarESalvar}
            />

            <Text style={styles.rotulo}>Ponto de destino</Text>
            
            {/* Lista compacta de pontos com rolagem interna */}
            <ScrollView 
              style={styles.trayContainer} 
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {pontosMock.map((ponto) => {
                const selecionado = pontoDestinoId === ponto.id;
                return (
                  <TouchableOpacity
                    key={ponto.id}
                    style={[styles.pontoChip, selecionado && styles.pontoChipSelecionado]}
                    onPress={() => setPontoDestinoId(ponto.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.pontoTexto, selecionado && styles.pontoTextoSelecionado]}>
                      {ponto.nome}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
            {sucesso !== '' && <Text style={styles.sucesso}>{sucesso}</Text>}

            <View style={styles.containerBotoes}>
              <CustomButton
                title={isEdicao ? 'Salvar alterações' : 'Registrar doação'}
                onPress={validarESalvar}
                variant="primary"
                icon={isEdicao ? 'check' : 'plus-circle'}
              />

              <CustomButton
                title="Cancelar"
                onPress={() => navigation.goBack()}
                variant="outline"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '85%', // <-- Altura máxima dinâmica (só cresce até 85% se precisar)
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  flex: {
    // Removido o flex: 1 daqui para não forçar altura total
  },
  conteudo: {
    paddingBottom: 8, // Padding reduzido para ficar bem ajustado
  },
  rotulo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8C98A4',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#212529',
    backgroundColor: '#F8F9FA',
    minHeight: 44,
  },
  trayContainer: {
    maxHeight: 120, // Altura compacta da listagem de pontos
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    padding: 6,
  },
  pontoChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  pontoChipSelecionado: {
    backgroundColor: '#E8EEF4',
  },
  pontoTexto: {
    fontSize: 13,
    color: '#4A5568',
  },
  pontoTextoSelecionado: {
    fontWeight: '600',
    color: '#1B3A5C',
  },
  erro: {
    color: '#C62828',
    fontSize: 13,
    marginTop: 8,
  },
  sucesso: {
    color: '#2E7D32',
    fontSize: 13,
    marginTop: 8,
  },
  containerBotoes: {
    marginTop: 20,
    gap: 8,
  },
});