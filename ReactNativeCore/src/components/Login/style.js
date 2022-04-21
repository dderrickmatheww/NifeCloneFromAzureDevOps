import {Platform, StyleSheet} from "react-native";
import theme from "../../styles/theme";

export const localStyles = StyleSheet.create({
    loginContainer: {
        top: 0,
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        alignItems: 'center',
        flexDirection:'column',
        paddingVertical: 10
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
    VerificationText:{
        color: theme.generalLayout.textColor,
        fontSize:20,
        fontFamily: theme.generalLayout.font
    },
    VerificationOption:{
        borderColor:theme.generalLayout.secondaryColor,
        borderRadius:10,
        alignSelf:"center",
        borderWidth: 1,
        paddingHorizontal:10,
        paddingVertical:4,
        marginBottom:10,
        width:"90%"
    },
    loginSwitchText:{
        color: theme.generalLayout.textColor,
        fontSize: 15,
        textAlign:"center",
        fontFamily: theme.generalLayout.font
    },
    loginLoginSwitchText:{
        color: theme.generalLayout.textColor,
        fontSize: 15,
        ...Platform.select({
            ios: {
                marginTop: "'7'%",
            },
            android: {
                marginTop: "20%",
            },
        }),
        textAlign:"center",
        fontFamily: theme.generalLayout.font
    },
    loginSwitch:{
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 10,
        alignSelf:"center",
        borderWidth: 1,
        paddingHorizontal:5,
        paddingVertical:2,
        marginTop: '5%',
        width: '40%',
        ...Platform.select({
            ios: {
                height: "7%",
            },
            android: {
                height: "20%",
            },
        })
    },
    notBusiness:{
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius:10,
        alignSelf:"center",
        borderWidth: 1,
        paddingHorizontal:5,
        paddingVertical:2,
        marginBottom:10,
    },
    nextBtn: {
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 10,
        alignSelf:"center",
        borderWidth: 1,
        paddingHorizontal:5,
        paddingVertical: 2,
        width: 100,
        margin: '2%',
    },
    signUpBtn:{
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 10,
        borderWidth: 1,
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
        flex:1,
        maxHeight: 50,
        minHeight: 50,
        width: 250,
        textAlign:"center",
        marginVertical: 15
    },
    backButton:
        {
            alignSelf: "flex-start",
            justifyContent: 'center', //Centered horizontally
            alignItems: 'center', //Centered vertically
            flex:1,
            maxHeight: 35,
            minHeight: 50,
            width: 50,
            textAlign:"center",
            marginTop: 15,
        },
    Caption: {
        color: theme.generalLayout.textColor,
        fontSize: 15,
        textAlign:"center",
        fontFamily: theme.generalLayout.font
    },
    business:{
        color: theme.generalLayout.textColor,
        fontSize: 12,
        textAlign: "center",
        marginTop: 15,
        fontFamily: theme.generalLayout.font
    },
    textInput:{
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 5,
        minWidth:"90%",
        height: 50,
        alignSelf:"center",
        marginVertical:2,
        color: theme.generalLayout.textColor,
        fontSize:15,
        shadowOffset:{width:-5, height:-5},
        fontFamily: theme.generalLayout.font
    },
    Modal:{
        backgroundColor: theme.generalLayout.backgroundColor,
        width:"90%",
        ...Platform.select({
            ios: {
                height: "75%"
            },
            android: {
                height: "85%"
            },
        }),
        alignSelf:"center",
        justifyContent:"flex-start",
        borderRadius: 10,
        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: 1,
        color: theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font
    },
    ModalBusiness: {
        backgroundColor: theme.generalLayout.backgroundColor,
        width:"90%",
        height:"50%",
        alignSelf:"center",
        justifyContent:"flex-start",
        borderRadius: 10,
        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: 1,
        color: theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font
    },
    ModalReset:{
        backgroundColor: theme.generalLayout.backgroundColor,
        width:"90%",
        height:"30%",
        alignSelf:"center",
        justifyContent:"flex-start",
        borderRadius:10,
        color:theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font
    },
    Subheading:{
        color:theme.generalLayout.textColor,
        textAlign:'center',
        alignSelf:"center",
        marginBottom:40,
        marginTop:5,
        width:"90%",
        fontFamily: theme.generalLayout.font
    },
    Container:{
        flexDirection:'column',
        justifyContent:"flex-start",
        alignContent:"center",
        textAlign:"center",
        borderRadius:10,
    },

})

