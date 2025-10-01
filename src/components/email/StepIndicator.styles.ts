import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  stepActive: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  stepInactive: {
    borderColor: colors.lightGray,
    backgroundColor: colors.lightGray,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepNumberActive: {
    color: colors.primary,
  },
  stepNumberInactive: {
    color: colors.white,
  },
  line: {
    width: 40,
    height: 2,
    backgroundColor: colors.lightGray,
  },
});
