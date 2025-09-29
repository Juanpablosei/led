import { StyleSheet } from 'react-native';

export const colors = {
  white: '#FFFFFF',
  black: '#000000',
  textSecondary: '#666666',
  textPrimary: '#333333',
  borderLight: '#f0f0f0',
};

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 20,
    paddingRight: 20,
  },
  supportModal: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 8,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  supportOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: colors.borderLight,
  },
  supportOptionText: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  supportIcon: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
});
