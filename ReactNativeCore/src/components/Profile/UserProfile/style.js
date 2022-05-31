import theme from "../../../styles/theme";
import {
    StyleSheet,
    Platform,
} from 'react-native';

export const localStyles = StyleSheet.create({
    editProfile: {
        opacity: 0.75,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 10,
        left: 300,

    },
    editStatus: {
        backgroundColor: theme.generalLayout.backgroundColor,
        position: "relative",

        ...Platform.select({
            ios: {
                left: 235,
            },
            android: {
                left: 220,
            },
        }),
        top: 10,
        opacity: .75
    },
    NoAvatarButton: {
        width: 150,
        height: 150,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.generalLayout.backgroundColor,
        justifyContent: 'center',
        alignItems: "center"
    },
    container: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        width: '100%',
        height: '100%'
    },
    drinksChipCont: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start"
    },
    navHeader: {
        marginTop: 25,
        flexDirection: "row",
        borderBottomColor: theme.generalLayout.secondaryColor,
        borderBottomWidth: 1,
        width: "98%",
        minHeight: 50,
        alignItems:"center"
    },
    EditOverlay: {
        position: "relative",
        left: 215,
        alignSelf: "flex-end",
        opacity: 0.75,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 10,
        marginBottom: 5,
    },
    DrawerOverlay: {
        alignSelf: "flex-start",
        opacity: 0.75,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 10,
        paddingVertical: 0,
    },
    AddFriendOverlay: {
        position: "relative",
        left: 195,
        alignSelf: "flex-end",
        opacity: 0.75,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 5,
        marginBottom: 7.5,
        borderWidth: 1,
        borderColor: theme.generalLayout.secondaryColor
    },
    profRow: {
        marginVertical: 10
    },
    descTitle: {
        fontSize: 18,
        color: theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font
    },
    caption: {
        fontSize: 14,
        color: theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font,
        marginLeft: 15
    },
    mainCont: {
        width: "95%",
        flex: 1,
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",

    },
    LocAndFriends: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "stretch",
        width: "90%"
    },
    loggedInContainer: {
        paddingHorizontal: 10,
        minHeight:'100%',
    },
    loggedInSubView: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        width: "100%",
        justifyContent: "center",
        marginBottom: "10%",
        alignItems: "center",
    },
    HeaderCont: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        width: "100%",
        maxHeight: "30%",
        justifyContent: "flex-end",
        alignItems: "center",
        borderBottomColor: theme.generalLayout.secondaryColor,
        borderBottomWidth: 2,
        marginTop: 50

    },
    profilePic: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: "2.5%"
    },
    friendPic: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    friendCont: {
        flexDirection: "row",
        borderBottomColor: theme.generalLayout.secondaryColor,
        borderBottomWidth: 1,
    },
    name: {
        fontSize: 18,
        color: theme.generalLayout.textColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: '.5%',
        marginLeft: '2.5%',
        width: "100%",
        fontFamily: theme.generalLayout.font
    },
    FriendCount: {
        fontSize: 12,
        marginTop: "2%",
        marginBottom: "1%",
        color: theme.generalLayout.textColor,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: theme.generalLayout.font
    },
    headerName: {
        fontSize: 20,
        fontWeight: "bold",
        color: theme.generalLayout.textColor,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: "center",
        fontFamily: theme.generalLayout.font
    },
    headerAgeGender: {
        fontSize: 14,
        fontWeight: "bold",
        color: theme.generalLayout.textColor,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: "center",
        marginTop: -10,
        fontFamily: theme.generalLayout.font
    },
    ScrollView: {
        flex: 1,
        width: "100%",
        borderLeftWidth: 2,
        borderLeftColor: theme.generalLayout.secondaryColor,
        borderRightWidth: 2,
        borderRightColor: theme.generalLayout.secondaryColor,
        paddingHorizontal: "5%",
        paddingBottom: "1%"
    },
    drawerBtn: {
        ...Platform.select({
            ios: {
                marginTop: '8%',
            },
            android: {
                marginTop: '3%',
            },
        }),
        marginLeft: '3%',
        marginBottom: '3%',
        borderWidth: 1,
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 70
    },
});
