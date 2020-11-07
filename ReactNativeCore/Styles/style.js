import React from 'react';
import { StyleSheet } from 'react-native'
import theme from './theme';
import Constants from 'expo-constants';

export const styles = StyleSheet.create({
  calloutText:{
    color: theme.LIGHT_PINK
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textFont: {
    
  },
  titleDark: {
    fontSize: 36,
    marginBottom: 16,
    color: "white"
  },
  titleVice: {
    fontSize: 36,
    marginBottom: 16,
    color: theme.LIGHT_PINK,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewDark: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center' ,
    backgroundColor: '#20232a'
  },
  tabDark: {
    backgroundColor: '#20232a'
  },
  title: {
    fontSize: 36,
    marginBottom: 16,
    color: 'black'
  },
  view: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center' ,
  },
  androidButtonText: {
    color: 'blue',
    fontSize: 20
  },
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  },
  bkgdImage:{
    resizeMode: 'cover',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapCont: { 
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  closeButton:{
    left: "50%",
    top:"50%",
    zIndex:2,
  },
  overlay: {
    position: 'absolute',
    top:"5%",
    left: "5%",
    opacity: 0.75,
    backgroundColor: theme.DARK,
  }, 
  loginContainer: {
    top: 0,
    flex: 1,
    backgroundColor: '#e9ebee',
    alignItems: 'center',
    backgroundColor: '#20232A'
  },
  friendVisitedBy: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  friendVisitedByMulti: {
    top: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  callOutMarker: {
    flex: 1,
    backgroundColor: theme.DARK,
    color:theme.LIGHT_PINK,
    borderRadius: 3,
    padding: 30,
    margin: 25,
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 20,
    borderColor: theme.LIGHT_PINK,
    borderWidth: 2,
    flexDirection:"column"
  },
  multiAvatar: {
    top: '5%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  singleAvatar: {
    top: '11%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  friendText: {
    color:theme.LIGHT_PINK,
    margin: 10,
    marginTop: 30
  },
  
  loggedInContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#20232A',
    elevation:4
  },
  facebookLoginBtn: {
    backgroundColor: '#4267b2',
    marginTop: '33%',
    borderRadius: 20,
    height: 60,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: 'white',
    borderWidth: 1
  },
  dataRowScroll: {
    backgroundColor: theme.DARK,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: 370,
    borderColor: theme.LIGHT_PINK,
    borderWidth: 2
  },
  navigateLoginBtn: {
    backgroundColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 90,
    width: 210,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: 'white',
    borderWidth: 1
  },
  googleLoginBtn: {
    backgroundColor: '#228B22',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: '33%',
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
    backgroundColor: 'black',
    borderColor: '#FF69B4',
    borderWidth: 1,
    marginTop: '33%',
    borderRadius: 20,
    height: 60,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  logoutBtn: {
    backgroundColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    position: "absolute",
    bottom: 0,
    top: 700,
    height: 35,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeAreaContainer: {
    flex: 1,
    paddingTop:"7%",
    backgroundColor: '#20232a',
  },
  clearCacheBtn: {
    backgroundColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    position: "absolute",
    bottom: 0,
    top: 660,
    height: 35,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataRowContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center' ,
    backgroundColor: '#20232a',
    marginVertical:2,
    backgroundColor: theme.DARK,
    padding: 15,
    borderRadius: 15,
    width: '100%',
    borderColor: theme.LIGHT_PINK,
    borderWidth: 1
  },
  dataRowScrollView: {
    flex: 1,
        width: "100%",
        paddingHorizontal: "5%",
        paddingBottom: 10,
        paddingTop: 10
  },
  Logo: {
    width: 25, 
    height: 25,
    left: 2,
    borderColor: "#fff",
    borderWidth: .2,
    borderRadius: 5
  },
  LogoData: {
    width: 90,
    height: 90,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    marginLeft: 0,
    marginTop: 15
  },
  whatsPoppinData: {
    flexDirection:"row",
    width:"100%",
    textAlign:"center",
    alignItems:"center",
  },
  loggedOutText: {
    color: "#fff",
    alignItems: 'center',
    justifyContent: 'center'
  },
  facebookDataText: {
    color: theme.LIGHT_PINK,
    fontSize: 11,
    fontFamily: theme.fontFamily,
    alignSelf:"center"
  },
  checkedInDataText: {
    color: theme.LIGHT_PINK,
    fontSize: 17,
    fontFamily: theme.fontFamily,
  },
  facebookScrollText: {
    color: "black",
    fontSize: 16,
    fontFamily: theme.fontFamily
  },
  dataRowDescription: {
    justifyContent: 'center', 
    alignItems: 'center' ,
    width: '80%',
    fontSize: 16,
    top: 20,
    right: '10%',
    fontFamily: theme.fontFamily
  },
  dataRowSpecialties: {
    top: 30,
    width: '80%',
    right: '10%',
    fontFamily: theme.fontFamily
  },
  dataRowLinks: {
    top: 40,
    width: '80%',
    right: '10%',
    fontFamily: theme.fontFamily
  },
  twitterDataRowSection: {
    borderRadius: 20,
    left: -25,
    width: '90%',
    borderColor: '#00bfff',
    padding: 20,
    borderWidth: 1.5,
    backgroundColor: 'white',
    margin: 5,
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 375, 
    height: 375
  },
  twitterDataContainerSection: {
    left: -25,
    width: '70%',
  },
  facebookDataRowSection: {
    borderRadius: 20,
    left: -25,
    width: '100%',
    borderColor: '#4267b2',
    padding: 20,
    borderWidth: 1.5,
    backgroundColor: 'white',
    margin: 5
  },
  profilePic: {
    width: 50, 
    height: 50, 
    borderRadius: 50,
    bottom: 105,
    left: 30
  },
  header: {
    flexDirection: 'row',
    top: 200
  },
  headerText: {
    textAlign:"center",
    fontSize: 26,
    color: theme.LIGHT_PINK,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    textShadowColor: '#000',
    color:"#FFCC00"
  },
  headerContainer: {
    top: 60,
    width: '80%',
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: 'grey'
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    width: 250,
    height: 25,
    margin: 5,
    alignItems: 'center'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    top: 100,
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
    elevation: 5
  },
  searchBar: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    width: 350,
    height: 25,
    marginTop:5,
    marginHorizontal:10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalText: {
      marginBottom: 15,
      textAlign: "center"
  },
  closeBtn: {
    left: 135,
    bottom: 20
  },
  modalScrollView : {
    height: 500,
    borderRadius: 20, 
    top: 120
  }
});
