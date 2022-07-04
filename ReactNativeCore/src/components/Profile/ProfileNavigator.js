import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserProfile from './UserProfile/UserProfile'
import FriendsList from "../FriendsList/FriendsList";
import EditProfile from "./UserProfile/EditProfile";
import ScanQRCode from "../QRCode/ScanQRCode";
import UserSearch from "../UserSearch/UserSearch";
import BusinessProfile from "./BusinessProfile/BusinessProfile";


const Stack = createStackNavigator();

class ProfileNavigator extends React.Component  {
  render(){
    return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="UserProfile" component={UserProfile} options={{title: 'UserProfile'}}/>
        <Stack.Screen name="OtherProfile" component={UserProfile} options={{title: 'OtherProfile'}} initialParams={{openDrawer: this.props.navigation.openDrawer}}/>
        <Stack.Screen name="BusinessProfile" component={BusinessProfile} options={{title: 'BusinessProfile'}} initialParams={{openDrawer: this.props.navigation.openDrawer}}/>
        <Stack.Screen name="OtherBusinessProfile" component={BusinessProfile} options={{title: 'OtherBusinessProfile'}} initialParams={{openDrawer: this.props.navigation.openDrawer}}/>
        <Stack.Screen name="Friends" component={FriendsList} options={{title: 'Friends'}} initialParams={{openDrawer: this.props.navigation.openDrawer}} />
        <Stack.Screen name="Edit" component={EditProfile} options={{title: 'Edit'}} />
        {/*<Stack.Screen name="EditBusiness" component={EditBusiness} options={{title: 'Edit'}}   initialParams={{user: this.props.user,  requests: this.props.requests, friends: this.props.friends, refresh: this.props.refresh, business: this.props.business}}/>*/}
        <Stack.Screen name="Search" component={UserSearch} options={{title: 'Search'}}  />
        {/*<Stack.Screen name="QRCode" component={QRCode} options={{title: 'QRCode'}} />*/}
        <Stack.Screen name="ScanQR" component={ScanQRCode} options={{title: 'ScanQR'}} />
      </Stack.Navigator>
    )
  }
}



export default ProfileNavigator;