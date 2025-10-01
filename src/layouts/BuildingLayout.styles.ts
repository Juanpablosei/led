import { StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    
  },
  titleSection: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  buildingTitle: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
    marginRight: 10,
  },
  menuButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
});
