import {DefaultTheme} from "react-native-paper";
import themeUtil from "./theme";

export const paperTheme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: themeUtil.generalLayout.backgroundColor,
        accent: themeUtil.generalLayout.secondaryColor,
        background : themeUtil.generalLayout.backgroundColor,
        placeholder: themeUtil.generalLayout.textColor
    },
};
