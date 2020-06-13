import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WhatsPoppin from '../Screens/WhatsPoppinTab'

function WhatsPoppinNav({navigation}){
  return(
    <WhatsPoppin onDrawerPress={() => navigation.openDrawer()} navigation={navigation}></WhatsPoppin>
  );
}

const Stack = createStackNavigator();

export default poppinStack = () => {
  return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="What's Poppin'?" component={WhatsPoppinNav} options={{title: 'Hot spots near you!'}} />
      </Stack.Navigator>
  );
};