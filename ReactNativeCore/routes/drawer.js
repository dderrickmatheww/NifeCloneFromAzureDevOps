import * as React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from '../routes/homeStack';
import MapStack from '../routes/mapStack';
import SettingsTab from '../Screens/SettingsTab';
import theme from '../Styles/theme';
import PoppinStack from './poppinStack';
import TestingStack from './testingStack';
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import profileStack from './profileStack';

const Drawer = createDrawerNavigator();



class Navigator extends React.Component  {

   saveLocation = (currentUser) => {
    // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
    const { status } =  Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      Location.getCurrentPositionAsync({enableHighAccuracy:true}).then((location) => {
        Util.location.SaveLocation(firebase.firestore(), currentUser.email, location, () =>{
          console.log('saved location');
        });
      });
      
    } else {
      throw new Error('Location permission not granted');
    }
  }


  componentDidMount(){
    console.log('drawer mounted')
    if(firebase.auth.currentUser){
        setInterval(() => this.saveLocation(firebase.auth.currentUser), 10000)
    }
  }
  render(){
    return ( 
      <NavigationContainer>
        <Drawer.Navigator drawerContentOptions={{
            activeTintColor:theme.LIGHT_PINK,
            inactiveTintColor:theme.LIGHT_PINK
          }} 
          drawerStyle={{
            backgroundColor: theme.DARK
          }} 
          initialRouteName='Profile'
          overlayColor="#20232A" >
          <Drawer.Screen  name="Test" component={TestingStack} />
          <Drawer.Screen  name="Profile" component={profileStack} />
          <Drawer.Screen  name="Home" component={HomeStack} />
          <Drawer.Screen name="What's Poppin'?" component={PoppinStack} />
          <Drawer.Screen name="Map" component={MapStack} /> 
          <Drawer.Screen name="Settings" component={SettingsTab} /> 
        </Drawer.Navigator>
      </NavigationContainer> 
    );
  }
}

export default Navigator;