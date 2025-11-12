import { Button, useTheme } from 'react-native-paper';

const AppButton = ({ title, onPress, mode, disabled, color, width }) => {
    const theme = useTheme();

    return (
        <Button
            mode={mode || 'contained'}
            onPress={onPress}
            buttonColor={color || theme.colors.secondary}
            disabled={disabled}
            labelStyle={{
                fontFamily: 'Poppins-Medium',
                fontSize: 16,
                lineHeight: 24,
                fontWeight: '500',
                textTransform: 'none',
                textAlign: 'center',
                fontStyle: 'normal',
                letterSpacing: 0,
            }}
            textColor="white"
            style={{
                borderRadius: 8,
                height: 48,
                justifyContent: 'center',
                marginTop: 16,
                width: width || '100%',

            }}
        >
            {title}
        </Button>
    );
};

export default AppButton;
