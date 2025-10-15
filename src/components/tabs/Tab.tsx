import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './Tab.styles';
import { TabData } from './Tab.types';

interface TabProps {
  tab: TabData;
  onPress: () => void;
}

export const Tab: React.FC<TabProps> = ({ tab, onPress }) => {
  // Obtener el ancho de la pantalla para hacer el texto responsive
  const screenWidth = Dimensions.get('window').width;
  
  // Determinar el tamaño de fuente basado en el ancho de la pantalla
  const getFontSize = () => {
    if (screenWidth < 375) {
      // Pantallas muy pequeñas (como iPhone SE)
      return 12;
    } else if (screenWidth < 414) {
      // Pantallas pequeñas
      return 14;
    } else {
      // Pantallas normales y grandes
      return 16;
    }
  };

  const dynamicTabTextStyle = {
    ...styles.tabText,
    fontSize: getFontSize(),
  };

  return (
    <TouchableOpacity
      style={[styles.tab, tab.active && styles.tabActive]}
      onPress={onPress}
    >
      <View style={styles.tabContent}>
        <Ionicons
          name={tab.icon as any}
          size={16}
          color={tab.active ? '#E95460' : '#666666'}
        />
        <Text style={dynamicTabTextStyle}>{tab.label}</Text>
      </View>
    </TouchableOpacity>
  );
};
