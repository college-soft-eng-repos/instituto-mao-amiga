import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Dimensões e cálculos adaptativos
const larguraTela = Dimensions.get('window').width;
const larguraBarra = larguraTela - 48;
const paddingDinamico = larguraBarra * 0.12;

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  return (
    <View style={styles.barraContainerOutside}>
      {/* Barra de Pílula Flutuante */}
      <View style={[styles.barraPill, { width: larguraBarra, paddingHorizontal: paddingDinamico }]}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName: keyof typeof Feather.glyphMap = 'home';
          if (route.name === 'Inicio') iconName = 'map-pin';
          if (route.name === 'Historico') iconName = 'clock';

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.8}
            >
              <View style={[styles.iconeContainerTab, isFocused && styles.iconeAtivoFundo]}>
                <Feather 
                  name={iconName} 
                  size={20} 
                  color={isFocused ? '#2563EB' : '#64748B'} 
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Botão de Cadastro Central Flutuante */}
      <TouchableOpacity
        style={styles.botaoAcaoCentralAbsoluto}
        activeOpacity={0.85}
        onPress={() => {
          // @ts-ignore
          navigation.navigate('CadastrarModal');
        }}
      >
        <Feather name="plus" size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  barraContainerOutside: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 28 : 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barraPill: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    elevation: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    height: 64,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeContainerTab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeAtivoFundo: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  botaoAcaoCentralAbsoluto: {
    position: 'absolute',
    top: -16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
});