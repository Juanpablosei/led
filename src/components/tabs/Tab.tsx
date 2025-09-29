import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './Tab.styles';
import { TabData } from './Tab.types';

interface TabProps {
  tab: TabData;
  onPress: () => void;
}

export const Tab: React.FC<TabProps> = ({ tab, onPress }) => {
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
        <Text style={styles.tabText}>{tab.label}</Text>
      </View>
    </TouchableOpacity>
  );
};
