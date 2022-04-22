import theme from "../../styles/theme";
import {Platform, StyleSheet} from "react-native";

export const localStyles = StyleSheet.create({
    ovrly: {
        position: 'absolute',
        top:"5%",
        left: "89%",
        opacity: 0.9,
        backgroundColor: theme.generalLayout.backgroundColor,
        paddingVertical:0,
        borderColor: theme.generalLayout.secondaryColor,
        zIndex:150,
        elevation:150,
    },
    markerVisited:{
        marginTop: 12,
        position:"relative"
    },
    autoCompContainer: {
        maxHeight: '30%',
        ...Platform.select({
            ios: {
                marginTop: '17%'
            },
            android: {
                marginTop: '10%'
            }
        }),
        marginLeft: '5%',
        zIndex: 3, // works on ios
        elevation: 3, // works on android
    },
    font: {
        textShadowColor: 'black',
        textShadowOffset: {
            width: 20,
            height: 20
        },
        textShadowRadius: 20,
        color: theme.icons.color,
        fontFamily: theme.generalLayout.font
    },
    container: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor
    },
    friendPic:{
        position:"relative",
        width: 40,
        height: 40,
        borderRadius: 50,
        bottom: 12,
        marginRight:126
    },

    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center' ,
        backgroundColor: theme.generalLayout.backgroundColor
    },
    callOutMarker: {
        flex: 1,
        backgroundColor: 'white',
        padding: 30,
        margin: 25,
        justifyContent: 'center',
        alignContent: 'center',
        maxWidth: '60%',
        borderRadius: 20,
        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: 1
    },
    overlay: {
        position: 'absolute',
        top:"5%",
        left: "5%",
        opacity: 0.75,
        backgroundColor: theme.generalLayout.backgroundColor,
    },

    map: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.generalLayout.backgroundColor
    },

    drawerButton:{
        backgroundColor: theme.generalLayout.backgroundColor,
        position:"absolute",
        alignSelf:"flex-start",
        top:"-30%",
        zIndex:100,
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        width:"90%",
        height:"90%",
        marginBottom:"15%",
        marginTop:"0%",
        marginHorizontal: "2.5%",
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex:1,
    },
    closeButton:{
        left: "0%",
        top: "0%",
    },

    imgCont: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',

        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: 10,
        borderRadius: 20,
        width:'100%',
    },
    modalImage:{
        width: '100%',
        height: '100%',
        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: 10,
        borderRadius: 20,
    },

    textCont:{
        bottom:"-10%",
        width:"100%",
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius:20,
    },
    descCont: {
        borderRadius: 20,
        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        margin:"1%",
    },
    modalText:{
        color: theme.generalLayout.textColor,
        padding: 5,
        marginLeft:"1%",
        fontWeight:"bold",
        fontFamily: theme.generalLayout.font
    },

    titleCont: {
        backgroundColor: theme.generalLayout.backgroundColor,
        width: '100%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        top: "-7.5%"
    },
    modalTitle:{
        color: theme.generalLayout.textColor,
        padding: 5,
        fontSize:24,
        borderRadius: 20,
        textAlign:"center",
        fontWeight:'bold',
        backgroundColor: theme.generalLayout.backgroundColor,
        marginVertical:"2%",
        width:"90%",
        fontFamily: theme.generalLayout.font

    },
    ratingText:{
        color: theme.generalLayout.textColor,
        padding: 5,
        fontWeight:"bold",
        textAlign:"center",
        fontFamily: theme.generalLayout.font
    },
    rating:{
        marginTop:"2%",
        marginBottom:"1%",
    }

});