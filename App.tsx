import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaListaPontos from './TelaListaPontos';
import TelaDetalhePonto from './TelaDetalhePonto';
import TelaCadastroDoacao from './TelaCadastroDoacao';

export type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: string };
  CadastroDoacao: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
