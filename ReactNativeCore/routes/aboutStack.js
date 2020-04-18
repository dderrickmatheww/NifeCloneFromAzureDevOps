import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AboutScreen from '../Screens/AboutScreen';


const Stack = createStackNavigator();

export default AboutStack = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen name="About" component={AboutScreen} options={{title: 'About Nife'}} />
      </Stack.Navigator>
  );
};