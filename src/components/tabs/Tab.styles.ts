import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#E95460',
};

export const typography = {
  body: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
};

export const spacing = {
  xs: 4,
  md: 16,
  lg: 24,
};

export const styles = StyleSheet.create({
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    ...typography.body,
    marginLeft: spacing.xs,
    color: '#333333',
  },
  tabTextActive: {
    ...typography.body,
    marginLeft: spacing.xs,
    color: colors.primary,
  },
});
