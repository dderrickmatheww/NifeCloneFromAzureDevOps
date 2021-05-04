import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Test from '../components/Testing/TestingScreen'

function Testing({navigation}){
  return(
    <Test onDrawerPress={() => navigation.openDrawer()} ></Test>
  );
}

const Stack = createStackNavigator();

export default poppinStack = () => {
  return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen   name="Testing" component={Testing} options={{title: 'Testing'}} />
      </Stack.Navigator>
  );
};