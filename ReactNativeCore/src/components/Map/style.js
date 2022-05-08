import theme from "../../styles/theme";
import {Platform, StyleSheet} from "react-native";

const IMAGE_SIZE = 200


export const localStyles = StyleSheet.create({
    mapContainer:{
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderColor: theme.icons.color,
        borderTopWidth: 1
    },
    center_overlay: {
        position: 'absolute',
        top: "5%",
        left: "89%",
        opacity: 0.9,
        backgroundColor: theme.generalLayout.backgroundColor,
        paddingVertical: 0,
        borderColor: theme.generalLayout.secondaryColor,
        zIndex: 150,
        elevation: 150,
    },
    markerVisited: {
        marginTop: 12,
        position: "relative"
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
    friendPic: {
        position: "relative",
        width: 40,
        height: 40,
        borderRadius: 50,
        bottom: 12,
        marginRight: 126
    },

    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        top: "5%",
        left: "5%",
        opacity: 0.75,
        backgroundColor: theme.generalLayout.backgroundColor,
    },

    map: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.generalLayout.backgroundColor
    },

    drawerButton: {
        backgroundColor: theme.generalLayout.backgroundColor,
        position: "absolute",
        alignSelf: "flex-start",
        top: "-30%",
        zIndex: 100,
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        width: "90%",
        height: "90%",
        marginBottom: "15%",
        marginTop: "0%",
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
        zIndex: 1,
    },
    closeButton: {
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
        width: '100%',
    },
    modalImage: {
        width: '100%',
        height: '100%',
        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: 10,
        borderRadius: 20,
    },

    textCont: {
        bottom: "-10%",
        width: "100%",
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 20,
    },
    descCont: {
        borderRadius: 20,
        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        margin: "1%",
    },
    modalText: {
        color: theme.generalLayout.textColor,
        padding: 5,
        marginLeft: "1%",
        fontWeight: "bold",
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
    modalTitle: {
        color: theme.generalLayout.textColor,
        padding: 5,
        fontSize: 24,
        borderRadius: 20,
        textAlign: "center",
        fontWeight: 'bold',
        backgroundColor: theme.generalLayout.backgroundColor,
        marginVertical: "2%",
        width: "90%",
        fontFamily: theme.generalLayout.font

    },
    ratingText: {
        color: theme.generalLayout.textColor,
        padding: 5,
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: theme.generalLayout.font
    },
    rating: {
        marginTop: "2%",
        marginBottom: "1%",
    }

});


export const callOutStyles = StyleSheet.create({
    ovrly: {
        position: 'absolute',
        top: "5%",
        left: "89%",
        opacity: 0.9,
        backgroundColor: theme.generalLayout.backgroundColor,
        paddingVertical: 0,
        borderColor: theme.generalLayout.secondaryColor,
        zIndex: 150,
        elevation: 150,
    },
    markerVisited: {
        marginTop: 12,
        position: "relative"
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
    friendPic: {
        position: "relative",
        width: 40,
        height: 40,
        borderRadius: 50,
        bottom: 12,
        marginRight: 126
    },

    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.generalLayout.backgroundColor
    },
    callOutMarker: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
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
        top: "5%",
        left: "5%",
        opacity: 0.75,
        backgroundColor: theme.generalLayout.backgroundColor,
    },

    map: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.generalLayout.backgroundColor
    },

    drawerButton: {
        backgroundColor: theme.generalLayout.backgroundColor,
        position: "absolute",
        alignSelf: "flex-start",
        top: "-30%",
        zIndex: 100,
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        width: "90%",
        height: "90%",
        marginBottom: "15%",
        marginTop: "0%",
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
        zIndex: 1,
    },
    closeButton: {
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
        width: '100%',
    },
    modalImage: {
        width: '100%',
        height: '100%',
        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: 10,
        borderRadius: 20,
    },

    textCont: {
        bottom: "-10%",
        width: "100%",
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 20,
    },
    descCont: {
        borderRadius: 20,
        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        margin: "1%",
    },
    modalText: {
        color: theme.generalLayout.textColor,
        padding: 5,
        marginLeft: "1%",
        fontWeight: "bold",
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
    modalTitle: {
        color: theme.generalLayout.textColor,
        padding: 5,
        fontSize: 24,
        borderRadius: 20,
        textAlign: "center",
        fontWeight: 'bold',
        backgroundColor: theme.generalLayout.backgroundColor,
        marginVertical: "2%",
        width: "90%",
        fontFamily: theme.generalLayout.font

    },
    ratingText: {
        color: theme.generalLayout.textColor,
        padding: 5,
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: theme.generalLayout.font
    },
    rating: {
        marginTop: "2%",
        marginBottom: "1%",
    },
    multiAvatar: {
        top: '5%',
        justifyContent: 'center',
        alignContent: 'center',
        paddingHorizontal: -5
    },

    friendVisitedBy: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    },
    singleAvatar: {
        top: '11%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    friendText: {
        color: theme.generalLayout.textColor,
        margin: 10,
        marginTop: 30,
        fontFamily: theme.generalLayout.font
    },
    calloutText:{
        color: theme.icons.color,
        fontFamily: theme.generalLayout.font
    },
    friendVisitedByMulti: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    },
});

export const barStyles = StyleSheet.create({
    panelTitle: {
        fontSize: 22,
        color: theme.generalLayout.textColor,
        textAlign:"center",
        fontWeight:"bold",
        marginRight:10,
        marginLeft:15,
        fontFamily: theme.generalLayout.font
    },
    titleHeader:{
        marginTop:-20,
        flexDirection:"row",
        justifyContent:"center",
    },
    eventText:{
        color:theme.generalLayout.textColor,
        paddingVertical:10,
        paddingHorizontal:10,
        width:"90%",
        textAlign:"left",
        fontFamily: theme.generalLayout.font
    },
    noEventsText:{
        color:theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font
    },
    eventCont:{
        justifyContent:"center",
        borderRadius:5,
        borderWidth:1,
        borderColor:theme.generalLayout.secondaryColor,
        marginVertical:5,
        paddingHorizontal:10,
        width:"95%",
    },
    noEventsCont:{
        height:"100%",
        marginVertical:5,
        marginHorizontal:5,
        paddingBottom:150,
        paddingHorizontal:5
    },
    tab:{
        borderColor:theme.generalLayout.secondaryColor,
        marginVertical:5
    },
    middleTab: {
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderRightColor: theme.generalLayout.secondaryColor,
        borderLeftColor: theme.generalLayout.secondaryColor
    },
    tabOff:{
        width:"100%",
        color: theme.icons.color,
        paddingHorizontal:30,
        fontFamily: theme.generalLayout.font
    },
    tabOn:{
        width:"100%",
        color :theme.generalLayout.textColor,
        paddingHorizontal:30,
        fontFamily: theme.generalLayout.font
    },
    tabCont:{
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor:theme.generalLayout.secondaryColor,
        width: "100%",
        flexDirection:"row",
        justifyContent:"space-evenly",
        marginTop:5,
        marginBottom:10
    },
    container: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        textAlign:"center",
        alignItems:"center",
    },
    box: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
    },
    panelContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    activityIndicator: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center' ,
        backgroundColor: theme.generalLayout.backgroundColor
    },
    rating:{
        marginTop:"2%",
        marginBottom:"1%",
        backgroundColor: theme.generalLayout.backgroundColor
    },
    ratingText: {
        color: theme.generalLayout.textColor,
        padding: 5,
        fontWeight:"bold",
        textAlign:"center",
        fontFamily: theme.generalLayout.font
    },
    panel: {
        flex:1,
        padding: 20,
        backgroundColor: theme.generalLayout.backgroundColor,
        height: '100%',
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderRightColor: theme.generalLayout.secondaryColor,
        borderLeftColor: theme.generalLayout.secondaryColor,
    },
    header: {
        backgroundColor: theme.generalLayout.backgroundColor,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderRightColor: theme.generalLayout.secondaryColor,
        borderLeftColor: theme.generalLayout.secondaryColor,
        borderTopColor: theme.generalLayout.secondaryColor
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        marginBottom: 10,
        backgroundColor: theme.generalLayout.backgroundColor
    },

    panelSubtitle: {
        fontSize: 14,
        color: theme.generalLayout.textColor,
        height: 30,
        marginBottom: 7,
        fontFamily: theme.generalLayout.font
    },
    panelText: {
        fontSize: 12,
        color: theme.generalLayout.textColor,
        textAlign:"center",
        alignItems:"center",
        fontFamily: theme.generalLayout.font
    },
    panelButton: {
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    photo: {
        width: '100%',
        height: 225,
        marginTop: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 20
    },
    map: {
        height: '100%',
        width: '100%',
    },
    ratingSystem: {
        borderColor: theme.generalLayout.secondaryColor,
        backgroundColor: theme.generalLayout.backgroundColor,
    },

})