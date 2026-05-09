import { StyleSheet } from 'react-native';

const fontFamily = {
  regular: 'Inter_400Regular',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
  },
  detailCard: {
    borderRadius: 5,
    borderWidth: 3.2,
    borderColor: '#ec48c3',
    backgroundColor: '#fed1f4',
    padding: 16,
    paddingTop: 0,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 6,
  },
  detailDecorPrimary: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#fce7f8',
    top: -60,
    right: -40,
    opacity: 0.7,
  },
  detailDecorSecondary: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#fbcff1',
    bottom: -90,
    left: -70,
    opacity: 0.55,
  },
  detailHeader: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: '#ec48c3',
    borderRadius: 5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    marginLeft: -16,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    paddingVertical: 4,
    paddingHorizontal: 15,
  },
  detailBody: {
    padding: 12,
    gap: 20,
  },
  detailHeaderText: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: '#831843',
  },
  detailImageFrame: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3.2,
    borderColor: '#ec48c3',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  detailImageBackground: {
    width: '100%',
    height: 170,
    borderRadius: 4,
  },
  detailImageStyle: {
    borderRadius: 4,
  },
  detailImageCover: {
    resizeMode: 'cover',
  },
  detailImageContain: {
    resizeMode: 'contain',
  },
  detailImageZoom: {
    transform: [{ scale: 1.1 }],
  },
  detailArrowBadge: {
    position: 'absolute',
    right: 8,
    top: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -13 }],
  },
  detailArrowIcon: {
    color: '#ec48c3',
  },
  detailType: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    color: '#000000',
    marginTop: -5,
  },
  detailTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailTypeIcon: {
    width: 16,
    height: 16,
  },
  detailPokedexBlock: {
    gap: 4,
  },
  detailPokedexLabel: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    color: '#000000',
  },
  detailPokedexBox: {
    backgroundColor: '#fceaf4',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 5,
    padding: 10,
    gap: 6,
  },
  detailPokedexText: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    color: '#000000',
    lineHeight: 18,
  },
  detailSelect: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    backgroundColor: '#fceaf4',
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailSelectBlock: {
    gap: 6,
  },
  detailSelectLabel: {
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
    color: '#000000',
  },
  detailSelectIcon: {
    color: '#000000',
  },
  detailSelectText: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    color: '#000000',
  },
  detailSelectOptions: {
    gap: 6,
  },
  detailSelectOption: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  detailSelectOptionActive: {
    borderWidth: 2,
  },
  detailSelectOptionText: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    color: '#000000',
  },
});
