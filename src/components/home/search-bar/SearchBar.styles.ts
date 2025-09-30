import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 12,
    
 
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 2,
  },
  placeholder: {
    color: colors.gray,
  },
  separator: {
    height: 1,
    marginTop: 2,
      backgroundColor: 'gray',

  },
});
