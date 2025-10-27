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
  buildingInfo: {
    alignItems: 'flex-start',
  },
  buildingName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
    lineHeight: 22,
    textAlign: 'left',
  },
  titleContainer: {
    marginBottom: 8,
    marginTop: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: 20,
    textAlign: 'left',
  },
  titleTag: {
    marginLeft: 8,
  },
  type: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    lineHeight: 18,
    textAlign: 'left',
    alignSelf: 'flex-start',
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
    justifyContent: 'flex-start',
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
