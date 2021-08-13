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
 
  viewDark: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center' ,
    backgroundColor: theme.generalLayout.backgroundColor
  },
  tabDark: {
    backgroundColor: theme.generalLayout.backgroundColor
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
    backgroundColor: theme.generalLayout.backgroundColor,
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
  facebookDataText: {
    color: theme.generalLayout.textColor,
    fontSize: 11,
    fontFamily: theme.fontFamily,
    alignSelf:"center"
  },
  checkedInDataText: {
    color: theme.generalLayout.textColor,
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
    //fontFamily: theme.fontFamily
  },
  dataRowSpecialties: {
    top: 30,
    width: '80%',
    right: '10%',
    //fontFamily: theme.fontFamily
  },
  dataRowLinks: {
    top: 40,
    width: '80%',
    right: '10%',
   // fontFamily: theme.fontFamily
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