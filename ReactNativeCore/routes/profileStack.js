import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FriendsList from '../Screens/FriendsList'

function Friends({navigation}){
  return(
    <FriendsList onDrawerPress={() => navigation.openDrawer()} ></FriendsList>
  );
}

const Stack = createStackNavigator();

export default poppinStack = () => {
  return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Friends" component={Friends} options={{title: 'Friends'}} />
      </Stack.Navigator>
  );
};