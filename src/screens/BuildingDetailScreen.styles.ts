import { StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  headerRight: {
    width: 24, // Para mantener el balance del header
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
  identificationCard: {
    backgroundColor: colors.white,
    margin: 20,
    padding: 20,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  identificationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  buildingName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    lineHeight: 24,
  },
  buildingDetails: {
    marginBottom: 20,
  },
  detailRow: {
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: colors.text,
  },
  detailValue: {
    fontWeight: 'normal',
    color: colors.text,
  },
  buildingType: {
    fontSize: 14,
    color: colors.text,
    marginTop: 8,
    fontStyle: 'italic',
  },
  maintenanceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  maintenanceIcon: {
    marginRight: 8,
  },
  maintenanceText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  imageContainer: {
    margin: 20,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  buildingImage: {
    width: '100%',
    height: 250,
  },
  placeholderImage: {
    width: '100%',
    height: 250,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
  },
});
