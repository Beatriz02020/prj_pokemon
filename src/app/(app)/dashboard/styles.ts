import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
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
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionsRowWeb: {
    maxWidth: 600,
  },
  primaryActionButton: {
    flex: 1,
    paddingHorizontal: 12,
  },
  secondaryActionButton: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: '#0f172a',
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
  capturedBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#15803d',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  capturedBadgeText: {
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalOverlayWeb: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '82%',
    gap: 16,
  },
  modalCardWeb: {
    borderRadius: 28,
    maxWidth: 500,
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalTitle: {
    color: '#0f172a',
    fontSize: 20,
    fontFamily: fontFamily.bold,
  },
  modalSubtitle: {
    color: '#475569',
    fontSize: 13,
    marginTop: 4,
    maxWidth: 280,
    fontFamily: fontFamily.regular,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: '#0f172a',
  },
  modalList: {
    gap: 10,
    paddingBottom: 8,
  },
  modalPokemonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalPokemonInfo: {
    flex: 1,
    gap: 2,
  },
  modalPokemonName: {
    color: '#0f172a',
    fontSize: 16,
    fontFamily: fontFamily.bold,
  },
  modalPokemonMeta: {
    color: '#64748b',
    fontSize: 12,
    fontFamily: fontFamily.regular,
  },
  modalRemoveText: {
    color: '#dc2626',
    fontSize: 13,
    fontFamily: fontFamily.bold,
  },
  logoutButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
  },
});
