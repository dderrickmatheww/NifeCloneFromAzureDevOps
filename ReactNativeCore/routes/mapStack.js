import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from '../Screens/MapScreen';

function Map({navigation}){
  return(
    <MapScreen onDrawerPress={() => navigation.openDrawer()}></MapScreen>
  );
}

const Stack = createStackNavigator();

export default MapStack = () => {
  return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Map" component={Map} options={{title: 'Map'}} />
      </Stack.Navigator>
  );
};