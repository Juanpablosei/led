import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: colors.lightGray,
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.black,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  buildingInfo: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 8,
  },
  profilesSection: {
    marginBottom: 20,
  },
  profilesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
    marginBottom: 8,
  },
  profilesList: {
    marginLeft: 10,
  },
  profileItem: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 4,
  },
  legalSection: {
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
    lineHeight: 20,
  },
  linkText: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  rejectButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginRight: 10,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  acceptButton: {
    backgroundColor: colors.primary,
    
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonDisabled: {
    backgroundColor: colors.gray,
  },
  acceptButtonText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
