import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FriendsList from '../Screens/Components/Profile Screen Components/FriendsList';
import EditProfile from '../Screens/Components/Profile Screen Components/EditProfile';
import EditBusinessProfile from '../Screens/Components/Profile Screen Components/EditBusinessProfile';
import UserSearch from '../Screens/Components/Profile Screen Components/UserSearch';
import QRCodeScreen from '../Screens/Components/Profile Screen Components/QR Code';
import ScanQRCodeScreen from '../Screens/Components/Profile Screen Components/ScanQRCode';
import ProfileScreen from '../Screens/Profile';
import Business from '../Screens/BusinessProfile';

function Friends({route, navigation}){
  const { user, friends, requests, refresh} = route.params;
  return(
    <FriendsList refresh={refresh} requests={requests} friends={friends}  user={user}  navigation={navigation} onDrawerPress={() => navigation.openDrawer()} ></FriendsList>
  );
}
function UserProfile({route, navigation}){
  const { user, friends, requests, refresh, uploadImage} = route.params;
  return(
    <ProfileScreen uploadImage={uploadImage} refresh={refresh} requests={requests} friends={friends}  user={user} isUserProfile={true} onDrawerPress={() => navigation.openDrawer()}  navigation={navigation}></ProfileScreen>
  );
}

function BusinessProfile({route, navigation}){
  const { user, currentUser, requests, refresh} = route.params;
  return(
    <Business currentUser={currentUser} refresh={refresh} requests={requests} user={user} onDrawerPress={() => navigation.openDrawer()} isUserProfile={true}  navigation={navigation}></Business>
  );
}

function OtherProfile({route, navigation}){
  const { user, friends, requests, refresh, uploadImage} = route.params;
  return(
    <ProfileScreen uploadImage={uploadImage} refresh={refresh} requests={requests} friends={friends}  user={user} isUserProfile={false} onDrawerPress={() => navigation.openDrawer()}  navigation={navigation}></ProfileScreen>
  );
}

function Edit({route, navigation}){
  const { user, friends, requests, refresh } = route.params;
  return(
    <EditProfile refresh={refresh} requests={requests} friends={friends}  user={user} onDrawerPress={() => navigation.openDrawer()}  navigation={navigation}></EditProfile>
  );
}

function EditBusiness({route, navigation}){
  const { user, friends, business, requests, refresh} = route.params;
  return(
    <EditBusinessProfile refresh={refresh} requests={requests} business={business} friends={friends}  user={user} onDrawerPress={() => navigation.openDrawer()}  navigation={navigation}></EditBusinessProfile>
  );
}

function Search({route, navigation}){
  const { currentUser} = route.params;
  return(
    <UserSearch  currentUser={currentUser} onDrawerPress={() => navigation.openDrawer()}  navigation={navigation}></UserSearch>
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

export default class ProfileStack extends React.Component  {
  render(){
    return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="ProfileScreen" component={UserProfile} options={{title: 'ProfileScreen'}} initialParams={{ uploadImage: this.props.uploadImage, requests: this.props.requests, refresh: this.props.refresh, business: this.props.business }}/>
        <Stack.Screen name="OtherProfile" component={OtherProfile} options={{title: 'ProfileScreen'}} initialParams={{ uploadImage: this.props.uploadImage, requests: this.props.requests, refresh: this.props.refresh, business: this.props.business }}/>
        <Stack.Screen name="BusinessProfile" component={BusinessProfile} options={{title: 'ProfileScreen'}} initialParams={{ currentUser: this.props.user, requests: this.props.requests, uploadImage: this.props.uploadImage, refresh: this.props.refresh, business: this.props.business }}/>
        <Stack.Screen name="Friends" component={Friends} options={{title: 'Friends'}}  initialParams={{ requests: this.props.requests, user: this.props.user, friends: this.props.friends, refresh: this.props.refresh, business: this.props.business }}/>
        <Stack.Screen name="Edit" component={Edit} options={{title: 'Edit'}} initialParams={{ user: this.props.user, friends: this.props.friends, requests: this.props.requests, refresh: this.props.refresh, business: this.props.business }}/>
        <Stack.Screen name="EditBusiness" component={EditBusiness} options={{title: 'Edit'}}   initialParams={{user: this.props.user,  requests: this.props.requests, friends: this.props.friends, refresh: this.props.refresh, business: this.props.business}}/>
        <Stack.Screen name="Search" component={Search} options={{title: 'Search'}} initialParams={{ currentUser: this.props.user }} />
        <Stack.Screen name="QRCode" component={QRCode} options={{title: 'QRCode'}} />
        <Stack.Screen name="ScanQR" component={ScanQR} options={{title: 'ScanQR'}} />
      </Stack.Navigator>
    )
  }
};