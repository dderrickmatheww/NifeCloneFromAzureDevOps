import * as React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from '../routes/homeStack';
import MapStack from '../routes/mapStack';
import SettingsTab from '../Screens/SettingsTab';
import theme from '../Styles/theme';
import PoppinStack from './poppinStack';
import TestingStack from './testingStack';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props){
  return(
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props}/>

    </DrawerContentScrollView>
  );
}

export default function Navigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContentOptions={{
          activeTintColor:theme.LIGHT_PINK,
          inactiveTintColor:theme.LIGHT_PINK
        }} 
        drawerStyle={{
          backgroundColor: theme.DARK
        }} 
        initialRouteName="Home" 
        overlayColor="#20232A" >
        <Drawer.Screen  name="Test" component={TestingStack} />
        <Drawer.Screen  name="Home" component={HomeStack} />
        <Drawer.Screen name="What's Poppin'?" component={PoppinStack} />
        <Drawer.Screen name="Map" component={MapStack} /> 
        <Drawer.Screen name="Settings" component={SettingsTab} /> 
      </Drawer.Navigator>
    </NavigationContainer>
  );
}