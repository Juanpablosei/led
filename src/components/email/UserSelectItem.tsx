import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './UserSelectItem.styles';
import { UserSelectItemProps } from './UserSelectItem.types';

export const UserSelectItem: React.FC<UserSelectItemProps> = ({ user, onToggle }) => {
  const handlePress = () => {
    onToggle(user.id);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{user.name} {user.surname}</Text>
      </View>
      <View
        style={[
          styles.checkboxContainer,
          user.isSelected ? styles.checkboxSelected : styles.checkboxUnselected,
        ]}
      >
        {user.isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
      </View>
    </TouchableOpacity>
  );
};
