import { configureFonts, MD2LightTheme } from "react-native-paper";

export const fontConfig = {
  android: {
    regular: {
      fontFamily: 'Poppins_400Regular',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'Poppins_500Medium',
      fontWeight: '500',
    },
    semiBold: {
      fontFamily: 'Poppins_600SemiBold',
      fontWeight: '600',
    },
    bold: {
      fontFamily: 'Poppins_700Bold',
      fontWeight: '700',
    },
  },
};

export const theme = {
  ...MD2LightTheme,
  colors: {
    ...MD2LightTheme.colors,
    primary: '#284394',
    secondary: '#E04821',
    tertiary: "#00005B"
  },
  fonts: configureFonts({ config: fontConfig, isV3: false }),
};
