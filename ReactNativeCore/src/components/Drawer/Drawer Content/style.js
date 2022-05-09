import {StyleSheet} from "react-native";
import theme from "../../../styles/theme";

export const styles = StyleSheet.create({
    NoAvatarButton: {
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: "center"
    },
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
        borderBottomColor: theme.icons.color,
        borderBottomWidth: .5,
        paddingBottom: 10
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
        lineHeight: 16,
        color: theme.generalLayout.textColor,
        flexWrap: "wrap",
        maxWidth: '80%',
        fontFamily: theme.generalLayout.font
    },
    statuscaption: {
        marginTop: 3,
        fontSize: 12,
        lineHeight: 14,
        color: theme.generalLayout.textColor,
        flexWrap: "wrap",
        maxWidth: '78%',
        fontFamily: theme.generalLayout.font
    },
    caption: {
        fontSize: 12,
        lineHeight: 14,
        color: theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
        color: theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font
    },
    text: {
        color: theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font
    },
    drawerSection: {
        marginTop: 15,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});