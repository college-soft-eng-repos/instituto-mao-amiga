import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TelaListaPontos from '../src/screens/TelaListaPontos';
import TelaDetalhePonto from '../src/screens/TelaDetalhePonto';
import TelaCadastroDoacao from '../src/screens/TelaCadastroDoacao';
import TelaHistoricoDoacoes from '../src/screens/TelaHistoricoDoacoes';
import TelaDetalheDoacao from '../src/screens/TelaDetalheDoacao';

export type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: string };
  CadastroDoacao: { doacaoId?: string } | undefined;
  HistoricoDoacoes: undefined;
  DetalheDoacao: { doacaoId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Lista"
          screenOptions={{
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'fade',
          }}
        >
          <Stack.Screen name="Lista" component={TelaListaPontos} />
          <Stack.Screen name="HistoricoDoacoes" component={TelaHistoricoDoacoes} options={{ headerShown: true, title: 'Histórico de doações' }} />
          <Stack.Screen name="Detalhe" component={TelaDetalhePonto} />
          <Stack.Screen name="CadastroDoacao" component={TelaCadastroDoacao} />
          <Stack.Screen name="DetalheDoacao" component={TelaDetalheDoacao} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}