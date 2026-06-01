import { StyleSheet } from 'react-native';

const fontFamily = {
  regular: 'Inter_400Regular',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4F6F8',
    padding: 24,
    paddingTop: 67,
    gap: 34,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 28,
    fontFamily: fontFamily.bold,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: '#4B5563',
  },
  searchBlock: {
    gap: 8,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: '#111827',
  },
  searchInfo: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: '#6B7280',
  },
  statusWrapper: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
    color: '#B91C1C',
    textAlign: 'center',
  },
  teamButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
  },
  logoutButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
  },
});
