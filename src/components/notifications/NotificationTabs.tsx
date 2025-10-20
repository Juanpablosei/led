import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/colors';
import { useTranslation } from '../../hooks/useTranslation';
import { styles } from './NotificationTabs.styles';

export type TabType = 'communications' | 'alerts';

interface NotificationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  communicationsCount: number;
  alertsCount: number;
}

export const NotificationTabs: React.FC<NotificationTabsProps> = ({
  activeTab,
  onTabChange,
  communicationsCount,
  alertsCount,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'communications' && styles.tabActive,
        ]}
        onPress={() => onTabChange('communications')}
      >
        <View style={styles.tabContent}>
          <Ionicons
            name="mail-outline"
            size={20}
            color={activeTab === 'communications' ? colors.white : colors.primary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'communications' && styles.tabTextActive,
            ]}
          >
            {t('tabs.communications', 'notifications')}
          </Text>
          {communicationsCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{communicationsCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'alerts' && styles.tabActive,
        ]}
        onPress={() => onTabChange('alerts')}
      >
        <View style={styles.tabContent}>
          <Ionicons
            name="alert-circle-outline"
            size={20}
            color={activeTab === 'alerts' ? colors.white : colors.primary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'alerts' && styles.tabTextActive,
            ]}
          >
            {t('tabs.alerts', 'notifications')}
          </Text>
          {alertsCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{alertsCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};
