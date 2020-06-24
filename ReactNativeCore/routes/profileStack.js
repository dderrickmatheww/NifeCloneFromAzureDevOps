import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import FriendsList from '../Screens/Components/Profile Screen Components/FriendsList';
import EditProfile from '../Screens/Components/Profile Screen Components/EditProfile';
import UserSearch from '../Screens/Components/Profile Screen Components/UserSearch';
import QRCodeScreen from '../Screens/Components/Profile Screen Components/QR Code';
import ScanQRCodeScreen from '../Screens/Components/Profile Screen Components/ScanQRCode';
import ProfileScreen from '../Screens/Profile';

function Friends({route, navigation}){
  const { user, friends} = route.params;
  return(
    <FriendsList friends={friends}  user={user}  navigation={navigation} onDrawerPress={() => navigation.openDrawer()} ></FriendsList>
  );
}
function Profile({route, navigation}){
  const { user, isUserProfile,  friends} = route.params;
  return(
    <ProfileScreen friends={friends}  user={user} isUserProfile={isUserProfile} onDrawerPress={() => navigation.openDrawer()}  navigation={navigation}></ProfileScreen>
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

function QRCode({ navigation}){
  return(
    <QRCodeScreen onDrawerPress={() => navigation.openDrawer()}  navigation={navigation}></QRCodeScreen>
  );
}
function ScanQR({ navigation}){
  return(
    <ScanQRCodeScreen onDrawerPress={() => navigation.openDrawer()}  navigation={navigation}></ScanQRCodeScreen>
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
        <Stack.Screen name="QRCode" component={QRCode} options={{title: 'QRCode'}} />
        <Stack.Screen name="ScanQR" component={ScanQR} options={{title: 'ScanQR'}} />
      </Stack.Navigator>
  );
};