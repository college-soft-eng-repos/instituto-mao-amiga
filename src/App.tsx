import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import TelaListaPontos from './screens/TelaListaPontos';
import TelaDetalhePonto from './screens/TelaDetalhePonto';
import TelaCadastroDoacao from './screens/TelaCadastroDoacao';
import TelaHistoricoDoacoes from './screens/TelaHistoricoDoacoes';
import TelaDetalheDoacao from './screens/TelaDetalheDoacao';
import CustomTabBar from './components/CustomTabBar';
import type { RootStackParamList, TabParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Inicio" component={TelaListaPontos} />
      <Tab.Screen name="Historico" component={TelaHistoricoDoacoes} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'fade',
          }}
        >
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="CadastrarModal" component={TelaCadastroDoacao} />
          <Stack.Screen name="Detalhe" component={TelaDetalhePonto} />
          <Stack.Screen name="DetalheDoacao" component={TelaDetalheDoacao} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}