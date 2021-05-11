import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FriendsList from '../components/Profile/FriendsList';
import EditProfile from '../components/Profile/EditProfile';
import EditBusinessProfile from '../components/Profile/EditBusinessProfile';
import UserSearch from '../components/Profile/UserSearch';
import QRCodeScreen from '../components/Profile/QR Code';
import ScanQRCodeScreen from '../components/Profile/ScanQRCode';
import ProfileScreen from '../components/Profile/Profile';
import Business from '../components/Profile/BusinessProfile';

function Friends({route, navigation}){
  const { user, friends, requests, refresh, openRequests} = route.params;
  return(
    <FriendsList refresh={refresh} requests={requests} friends={friends}  user={user} openRequests={openRequests}  navigation={navigation} onDrawerPress={() => navigation.openDrawer()} ></FriendsList>
  );
}

function UserProfile({route, navigation}){
  const { uploadImage, isUserProfile} = route.params;
  return(
    <ProfileScreen uploadImage={uploadImage}  isUserProfile={isUserProfile} onDrawerPress={() => navigation.openDrawer()}  navigation={navigation}></ProfileScreen>
  );
}

function BusinessProfile({route, navigation}){
  const { user, currentUser, requests, refresh} = route.params;
  return(
    <Business currentUser={currentUser} refresh={refresh} requests={requests} user={user} onDrawerPress={() => navigation.openDrawer()} isUserProfile={true}  navigation={navigation}></Business>
  );
}

function OtherProfile({route, navigation}){
  const { currentUser, friends, requests, refresh, uploadImage, profileUser} = route.params;
  return(
    <ProfileScreen uploadImage={uploadImage} refresh={refresh} requests={requests} friends={friends} profileUser={profileUser}  currentUser={currentUser} isUserProfile={true} onDrawerPress={() => navigation.openDrawer()}  navigation={navigation}></ProfileScreen>
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

class ProfileStack extends React.Component  {
  render(){
    return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="ProfileScreen" component={UserProfile} options={{title: 'ProfileScreen'}} initialParams={{ uploadImage: this.props.uploadImage, isUserProfile:true }}/>
        <Stack.Screen name="OtherProfile" component={OtherProfile} options={{title: 'ProfileScreen'}} initialParams={{uploadImage: this.props.uploadImage, requests: this.props.requests, refresh: this.props.refresh, business: this.props.business }}/>
        <Stack.Screen name="BusinessProfile" component={BusinessProfile} options={{title: 'ProfileScreen'}} initialParams={{ currentUser: this.props.user, requests: this.props.requests, uploadImage: this.props.uploadImage, refresh: this.props.refresh, business: this.props.business }}/>
        <Stack.Screen name="Friends" component={Friends} options={{title: 'Friends'}} />
        <Stack.Screen name="Edit" component={Edit} options={{title: 'Edit'}} />
        <Stack.Screen name="EditBusiness" component={EditBusiness} options={{title: 'Edit'}}   initialParams={{user: this.props.user,  requests: this.props.requests, friends: this.props.friends, refresh: this.props.refresh, business: this.props.business}}/>
        <Stack.Screen name="Search" component={Search} options={{title: 'Search'}}  />
        <Stack.Screen name="QRCode" component={QRCode} options={{title: 'QRCode'}} />
        <Stack.Screen name="ScanQR" component={ScanQR} options={{title: 'ScanQR'}} />
      </Stack.Navigator>
    )
  }
};



export default ProfileStack;