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
    gap: 24,
  },
  containerWeb: {
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 2,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  avatarText: {
    fontSize: 28,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
  },
  name: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    color: '#111827',
  },
  tagline: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: '#6B7280',
  },
  statsLoader: {
    marginTop: 4,
  },
  photoButton: {
    alignSelf: 'stretch',
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
    color: '#374151',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: '#111827',
  },
  logoutButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
  },
});
