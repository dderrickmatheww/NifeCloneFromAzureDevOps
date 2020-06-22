import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import FriendsList from '../Screens/Components/Profile Screen Components/FriendsList';
import EditProfile from '../Screens/Components/Profile Screen Components/EditProfile';
import UserSearch from '../Screens/Components/Profile Screen Components/UserSearch';
import ProfileScreen from '../Screens/Profile';

function Friends({ navigation}){
  return(
    <FriendsList onDrawerPress={() => navigation.openDrawer()} ></FriendsList>
  );
}
function Profile({navigation}){
  return(
    <ProfileScreen onDrawerPress={() => navigation.openDrawer()}  navigation={navigation}></ProfileScreen>
  );
}

function Edit({route, navigation}){
  const { user } = route.params;
  return(
    <EditProfile user={user} onDrawerPress={() => navigation.openDrawer()}  navigation={navigation}></EditProfile>
  );
}

function Search({route, navigation}){
  return(
    <UserSearch onDrawerPress={() => navigation.openDrawer()}  navigation={navigation}></UserSearch>
  );
}

const Stack = createStackNavigator();

export default poppinStack = () => {
  return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen he name="ProfileScreen" component={Profile} options={{title: 'ProfileScreen'}} />
        <Stack.Screen name="Friends" component={Friends} options={{title: 'Friends'}} />
        <Stack.Screen name="Edit" component={Edit} options={{title: 'Edit'}} />
        <Stack.Screen name="Search" component={Search} options={{title: 'Search'}} />
      </Stack.Navigator>
  );
};