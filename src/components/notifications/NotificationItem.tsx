import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './NotificationItem.styles';
import { NotificationItemProps } from './NotificationItem.types';

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress(notification.id);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, !notification.isRead && styles.unreadContainer]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {!notification.isRead && <View style={styles.unreadIndicator} />}
      <Text style={styles.title}>{notification.title}</Text>
      <Text style={styles.date}>{notification.date}</Text>
    </TouchableOpacity>
  );
};

