import { StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 2,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.text,
   
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  newButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  newButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  documentsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    minHeight: '40%',
  },
  // Estilos del modal de tipos de documentos - Patrón del registro
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 9999,
  },
  selectionModal: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 20,
    width: '90%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 999,
    zIndex: 10000,
  },
  selectionModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  selectionScrollView: {
    maxHeight: 440, // Altura para aproximadamente 8 elementos
  },
  selectionOption: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  selectionOptionText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  selectionCancelButton: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    alignItems: 'center',
  },
  selectionCancelButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  selectionLoading: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
