import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { useTranslation } from '../../hooks/useTranslation';
import { styles } from './AlertsSideMenu.styles';

export type AlertCategory = 'buildings' | 'homes' | 'activities';

interface AlertsSideMenuProps {
  visible: boolean;
  onClose: () => void;
  onCategorySelect: (category: AlertCategory) => void;
  buildingsCount: number;
  homesCount: number;
  activitiesCount: number;
}

const { width: screenWidth } = Dimensions.get('window');

export const AlertsSideMenu: React.FC<AlertsSideMenuProps> = ({
  visible,
  onClose,
  onCategorySelect,
  buildingsCount,
  homesCount,
  activitiesCount,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const categories = [
    {
      key: 'buildings' as AlertCategory,
      icon: 'business-outline',
      title: t('alertsMenu.buildings', 'notifications'),
      count: buildingsCount,
    },
    {
      key: 'homes' as AlertCategory,
      icon: 'home-outline',
      title: t('alertsMenu.homes', 'notifications'),
      count: homesCount,
    },
    {
      key: 'activities' as AlertCategory,
      icon: 'calendar-outline',
      title: t('alertsMenu.activities', 'notifications'),
      count: activitiesCount,
    },
  ];

  const handleCategoryPress = (category: AlertCategory) => {
    onCategorySelect(category);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={[styles.overlay, { paddingTop: insets.top }]}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.sideMenu}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {t('alertsMenu.title', 'notifications')}
            </Text>
          </View>

          {/* Categories List */}
          <ScrollView style={styles.categoriesList} showsVerticalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(category.key)}
              >
                <View style={styles.categoryContent}>
                  <View style={styles.categoryIcon}>
                    <Ionicons
                      name={category.icon as any}
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                    <Text style={styles.categoryCount}>
                      {category.count} {t('elements', 'notifications')}
                    </Text>
                  </View>
                  {category.count > 0 && (
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{category.count}</Text>
                    </View>
                  )}
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
           </ScrollView>

           {/* Close Button */}
           <View style={styles.closeButtonContainer}>
             <TouchableOpacity style={styles.closeButton} onPress={onClose}>
               <Ionicons name="close" size={24} color={colors.text} />
             </TouchableOpacity>
           </View>
         </TouchableOpacity>
       </TouchableOpacity>
     </Modal>
   );
 };
