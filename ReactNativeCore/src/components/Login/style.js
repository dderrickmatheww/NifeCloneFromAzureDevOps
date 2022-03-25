import {StyleSheet} from "react-native";
import theme from "../../styles/theme";

export const localStyles = StyleSheet.create({
    loginContainer: {
        top: 0,
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        alignItems: 'center',
        flexDirection:'column'
    },
    subHeaderContainer: {
        width: '50%',
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 20,
        marginVertical: '5%'
    },
    subHeaderText: {
        textAlign:"center",
        fontSize: 18,
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        textShadowColor: '#000',
        color: theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font
    },
    headerContainer: {
        marginTop:'10%',
        width: '80%',
        paddingBottom: 10,
    },
    headerText: {
        textAlign:"center",
        fontSize: 30,
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        textShadowColor: '#000',
        color: theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font
    },
    googleLoginBtn: {
        backgroundColor: '#228B22',
        paddingHorizontal: 20,
        marginTop: 10,
        borderRadius: 20,
        height: 60,
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderColor: 'red',
        borderWidth: 1
    },
    nifeLoginBtn: {
        backgroundColor: theme.generalLayout.backgroundColor,
        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: 1,
        marginTop: '10%',
        borderRadius: 20,
        height: 60,
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    nifeBusLoginBtn: {
        backgroundColor: theme.generalLayout.backgroundColor,
        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: 1,
        marginTop: 10,
        borderRadius: 20,
        height: 60,
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    nifeForgotBtn: {
        backgroundColor: theme.generalLayout.backgroundColor,
        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: .5,
        marginTop: '30%',
        borderRadius: 20,
        height: 35,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    loggedOutText: {
        color: theme.generalLayout.textColor,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.generalLayout.font
    },
    btnContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    Logo: {
        width: 25,
        height: 25,
        left: 2,
        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: .2,
        borderRadius: 5
    },
})

