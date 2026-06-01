import { StyleSheet } from 'react-native';

const fontFamily = {
  regular: 'Inter_400Regular',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const styles = StyleSheet.create({
  registerContainer: {
    flexGrow: 1,
    backgroundColor: '#F4F6F8',
    padding: 24,
    paddingTop: 42,
    paddingBottom: 32,
    justifyContent: 'flex-start',
    gap: 24,
  },
  header: {
    gap: 67,
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 72,
  },
  title: {
    fontSize: 32,
    fontFamily: fontFamily.bold,
    color: '#1B1F23',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: '#4B5563',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#3978bb',
    padding: 20,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#336daa',
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: '#111827',
  },
  button: {
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  footerText: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    color: '#FFE4E6',
  },
  footerLink: {
    marginLeft: 6,
    fontSize: 13,
    fontFamily: fontFamily.semiBold,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});
