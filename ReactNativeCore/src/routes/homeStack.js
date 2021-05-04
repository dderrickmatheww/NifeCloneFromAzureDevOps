import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../components/Screens/HomeScreen';

function Feed({navigation}){
  return(
    <HomeScreen onDrawerPress={() => navigation.openDrawer()} navigation={navigation}></HomeScreen>
  );
}

const Stack = createStackNavigator();

export default HomeStack = () => {
  return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Home" component={Feed} />
      </Stack.Navigator>
  );
};