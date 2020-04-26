import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Screens/HomeScreen';
import Test from '../Screens/TestScreen';


const Stack = createStackNavigator();

export default HomeStack = () => {
  return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Test" component={Test}  />
      </Stack.Navigator>
  );
};