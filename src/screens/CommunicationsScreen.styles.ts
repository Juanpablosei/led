import { StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,
  },
  // Estilos de las cards mejorados
  cardContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
  },
  cardContainerEven: {
    backgroundColor: '#FAFAFA',
  },
  cardContainerExpanded: {
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardDateText: {
    fontSize: 13,
    color: '#999',
    marginLeft: 6,
  },
  cardSubjectText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  cardFooterText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  // Contenedor de botones de acción
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    gap: 6,
  },
  actionButtonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  // Paginación
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 32, // Padding extra para evitar superposición con botones de navegación
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  paginationButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paginationButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  paginationButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  paginationInfo: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
    minWidth: 60,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
  },
  // Estilos de modales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  modalContent: {
    padding: 20,
  },
  modalField: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  modalValue: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginTop: 8,
  },
  attachmentName: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  // Estilos de destinatarios
  recipientItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  recipientIcon: {
    marginRight: 12,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientEmail: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  recipientStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recipientStatusText: {
    fontSize: 13,
    marginLeft: 4,
    fontWeight: '500',
  },
  recipientDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});
