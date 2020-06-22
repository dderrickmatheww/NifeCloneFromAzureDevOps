import React from 'react';
import { StyleSheet } from 'react-native'
import theme from './theme';

export const styles = StyleSheet.create({
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
  facebookButtonContainer: {
    top: 80
  },
  googleButtonContainer: {
    top: 90
  },
  nifeButtonContainer: {
    top: 100
  },
  
  loggedInContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#20232A',
    elevation:4
  },
  facebookLoginBtn: {
    backgroundColor: '#4267b2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 50,
    width: 210,
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
    borderColor: '#ff1493',
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
    borderRadius: 20,
    height: 50,
    width: 210,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 50,
    width: 210,
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
  dataRowContainer: {
    flex: 1,
    top: 70,
    height: 330,
    justifyContent: 'center', 
    alignItems: 'center' ,
    backgroundColor: '#20232a',
    marginBottom: 20
  },
  dataRowScrollView: {
    flex: 1,
    backgroundColor: '#20232a',
    height: 'auto'
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
    width: 50, 
    height: 50,
    top: 10,
    position: 'absolute',
    left: 5,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 5
  },
  loggedOutText: {
    color: "#fff",
    alignItems: 'center',
    justifyContent: 'center'
  },
  facebookDataText: {
    color: "black",
    top: 0,
    top: 10,
    position: 'absolute',
    fontSize: 13,
    fontFamily: theme.fontFamily
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
    fontSize: 18,
    color:theme.LIGHT_PINK
  },
  headerContainer: {
    top: 60
  },
  searchBar: {
    top: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    width: 350,
    height: 25,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center'
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
