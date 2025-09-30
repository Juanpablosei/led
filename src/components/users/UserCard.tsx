import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './UserCard.styles';
import { UserCardProps } from './UserCard.types';

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onPress,
  onEdit,
  onDelete,
}) => {
  const handlePress = () => {
    onPress?.(user.id);
  };

  const handleEdit = () => {
    onEdit?.(user.id);
  };

  const handleDelete = () => {
    onDelete?.(user.id);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name} {user.surname}</Text>
          <Text style={styles.profiles}>
            Perfiles: {user.profiles.join(', ')}
          </Text>
        </View>
      </View>
      
      {user.isVerified && (
        <View style={styles.bottomSection}>
          <View style={styles.verifiedContainer}>
            <Ionicons 
              name="checkmark-circle" 
              size={16} 
              color="#4CAF50" 
              style={styles.verifiedIcon}
            />
            <Text style={styles.verified}>Verificado</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};
