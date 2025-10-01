import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  required: {
    color: colors.error,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingVertical: 8,
    fontSize: 16,
    color: colors.text,
  },
  inputFocused: {
    borderBottomColor: colors.primary,
  },
  attachmentContainer: {
    borderWidth: 1,
    borderColor: '#FFB3B3',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
  },
  attachmentText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  textEditorContainer: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    overflow: 'hidden',
  },
  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  toolbarButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  toolbarIcon: {
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 200,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  sendButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
