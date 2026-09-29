import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TelaListaPontos from './TelaListaPontos';
import TelaDetalhePonto from './TelaDetalhePonto';
import TelaCadastroDoacao from './TelaCadastroDoacao';
import TelaHistoricoDoacoes from './TelaHistoricoDoacoes';

export type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: string };
  CadastroDoacao: undefined;
  HistoricoDoacoes: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Lista">
          <Stack.Screen
            name="Lista"
            component={TelaListaPontos}
            options={{ title: 'Instituto Mão Amiga' }}
          />
          <Stack.Screen
            name="Detalhe"
            component={TelaDetalhePonto}
            options={{ title: 'Detalhe do ponto' }}
          />
          <Stack.Screen
            name="CadastroDoacao"
            component={TelaCadastroDoacao}
            options={{ title: 'Cadastrar doação' }}
          />
          <Stack.Screen
            name="HistoricoDoacoes"
            component={TelaHistoricoDoacoes}
            options={{ title: 'Histórico de doações' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
