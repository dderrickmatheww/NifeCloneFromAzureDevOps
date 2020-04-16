import { StyleSheet , Dimensions} from 'react-native'

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
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').height * 0.95 ),
    maxHeight: (Dimensions.get('window').height * 0.95 ),
  },
  mapCont: { 
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    
  },

  closeButton:{
    alignItems:"flex-end"
  }
 

  
});