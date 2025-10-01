import { StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: 30,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 20,

  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  formContainer: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 20,
    minHeight: '100%', // ← Agregar esto
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  sliderContainer: {
    marginTop: 8,
  },
  daysLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#999999',
    marginBottom: 8,
  },
  sliderValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

