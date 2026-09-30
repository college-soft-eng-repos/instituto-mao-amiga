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
import { Feather } from '@expo/vector-icons';
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

// Atualizado para suportar a chamada direta via Stack Modal ou Tab
type Props = NativeStackScreenProps<RootStackParamList, 'CadastrarModal'> & {
  route: { params?: { doacaoId?: string } };
};

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
        <ModalHeader 
          title={isEdicao ? 'Editar doação' : 'Cadastrar doação'} 
          onClose={() => navigation.goBack()} 
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.conteudo}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.rotulo}>Tipo do item</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: arroz, roupa, leite"
              placeholderTextColor="#94A3B8"
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
              placeholderTextColor="#94A3B8"
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="number-pad"
              returnKeyType="done"
              onSubmitEditing={validarESalvar}
            />

            <Text style={styles.rotulo}>Ponto de destino</Text>
            
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
              <View style={styles.botaoWrapper}>
                <CustomButton
                  title="Cancelar"
                  onPress={() => navigation.goBack()}
                  variant="outline"
                />
              </View>
              <View style={styles.botaoWrapper}>
                <CustomButton
                  title={isEdicao ? 'Salvar' : 'Registrar'}
                  onPress={validarESalvar}
                  variant="primary"
                  icon={isEdicao ? 'check' : 'plus-circle'}
                />
              </View>
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
    backgroundColor: 'rgba(15, 23, 42, 0.6)', // Fundo translúcido escuro perfeitamente visível
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  conteudo: {
    paddingBottom: 4,
  },
  rotulo: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    minHeight: 48,
  },
  trayContainer: {
    maxHeight: 130,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    padding: 6,
  },
  pontoChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 4,
  },
  pontoChipSelecionado: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  pontoTexto: {
    fontSize: 14,
    color: '#334155',
  },
  pontoTextoSelecionado: {
    fontWeight: '600',
    color: '#2563EB',
  },
  erro: {
    color: '#DC2626',
    fontSize: 13,
    marginTop: 10,
    fontWeight: '500',
  },
  sucesso: {
    color: '#16A34A',
    fontSize: 13,
    marginTop: 10,
    fontWeight: '500',
  },
  containerBotoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  botaoWrapper: {
    flex: 1,
  },
});