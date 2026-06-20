import { StyleSheet } from 'react-native';

const fontFamily = {
  regular: 'Inter_400Regular',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f66969',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 3,
    width: '100%',
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: '100%',
    height: 240,
    resizeMode: 'contain',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    transform: [{ scale: 1.4 }],
  },
  imageReduced: {
    transform: [{ scale: 1.2 }],
  },
  imageSpaced: {
    marginBottom: 12,
  },
  cardBody: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
    gap: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: fontFamily.bold,
    color: '#111827',
    paddingTop: 20,
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
    color: '#2563EB',
  },
  cardTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTypeIcon: {
    width: 16,
    height: 16,
  },
});
