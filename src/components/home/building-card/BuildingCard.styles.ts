import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 12,
    elevation: 2,
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    flexDirection: 'row',
  },
  imageContainer: {
    width: 80,
    height: 90,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
    marginRight: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buildingImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
    marginTop: 4,
    lineHeight: 20,
  },
  type: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  id: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 4,
    lineHeight: 16,
  },
  cadastralRef: {
    fontSize: 12,
    color: colors.black,
    marginBottom: 12,
    lineHeight: 16,
  },
  maintenanceLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  maintenanceIcon: {
    marginRight: 6,
  },
  maintenanceText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  status: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  label: {
    fontSize: 12,
    color: colors.black,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 12,
    color: colors.black,
    fontWeight: 'normal',
  },
});
