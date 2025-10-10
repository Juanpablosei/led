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
    paddingVertical: 10,
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
  identificationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  mainCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
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
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buildingImage: {
    width: '100%',
    height: 400,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  addressSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  addressDetail: {
    fontSize: 13,
    color: colors.gray,
    marginBottom: 2,
  },
  inmueblesSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  inmuebleItem: {
    marginBottom: 12,
  },
  inmuebleText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  inmuebleDetail: {
    fontSize: 12,
    color: colors.gray,
  },
  rolesSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  roleText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
});
