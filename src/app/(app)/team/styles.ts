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
    maxWidth: 1400,
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
  teamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
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
  teamCardWeb: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  teamHeader: {
    gap: 6,
  },
  teamTitle: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: '#111827',
  },
  teamEmpty: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: '#6B7280',
  },
  teamList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  teamChip: {
    backgroundColor: '#E0F2FE',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  teamChipText: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    color: '#0C4A6E',
  },
  cardsContainer: {
    width: '100%',
    gap: 20,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
  cardWrapper: {
    position: 'relative',
  },
  cardWrapperWeb: {
    width: '100%',
  },
  selectedBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  selectedBadgeText: {
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
    color: '#FFFFFF',
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
    fontSize: 13,
    fontFamily: fontFamily.semiBold,
    color: '#B91C1C',
    textAlign: 'center',
  },
  successText: {
    fontSize: 13,
    fontFamily: fontFamily.semiBold,
    color: '#15803d',
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingHorizontal: 12,
  },
});
