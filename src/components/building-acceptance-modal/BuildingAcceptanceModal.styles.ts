import { StyleSheet } from 'react-native';

export const colors = {
  white: '#FFFFFF',
  black: '#000000',
  red: '#E53E3E',
  gray: '#999999',
  lightGray: '#F5F5F5',
  borderGray: '#E0E0E0',
  blue: '#007AFF',
  darkGray: '#666666',
};

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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
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
    borderColor: colors.borderGray,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.red,
    borderColor: colors.red,
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
    color: colors.red,
    textDecorationLine: 'underline',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  rejectButton: {
    flex: 0.3,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.red,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: colors.red,
    fontSize: 10,
    fontWeight: 'bold',
  },
  acceptButton: {
    flex: 0.7,
    backgroundColor: colors.red,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginLeft: 60,
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
