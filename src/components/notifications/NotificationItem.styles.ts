import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  unreadContainer: {
    backgroundColor: '#F5F9FF',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666666',
  },
  unreadIndicator: {
    position: 'absolute',
    left: 6,
    top: '50%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    transform: [{ translateY: -4 }],
  },
});

