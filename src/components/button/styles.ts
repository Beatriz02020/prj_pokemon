import { StyleSheet } from 'react-native';

const fontFamily = {
    regular: 'Inter_400Regular',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
};

export const styles = StyleSheet.create({
    button: {
        backgroundColor: '#e34164',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontFamily: fontFamily.semiBold,
        fontSize: 16,
    },
});