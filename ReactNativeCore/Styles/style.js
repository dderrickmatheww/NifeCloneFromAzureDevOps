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
    color: theme.LIGHT_PINK
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
  
});