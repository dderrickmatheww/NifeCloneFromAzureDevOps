import { StyleSheet } from 'react-native'
import theme from '../Styles/theme';

export const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
    backgroundColor: '#20232A'
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
  facebookDataBtn: {
    backgroundColor: '#4267b2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: 370,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: 'white',
    borderWidth: 1
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
    top: 100,
    maxHeight: 50,
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
    width: 25, 
    height: 25,
    position: 'absolute',
    left: 7,
    borderColor: "#fff",
    borderWidth: .2,
    borderRadius: 5
  },
  loggedOutText: {
    color: "#fff",
    alignItems: 'center',
    justifyContent: 'center'
  },
  facebookDataText: {
    color: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    overflow: 'hidden'
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
    color: 'white'
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
  }
});