import * as React from 'react';
import {View, ActivityIndicator} from 'react-native';
import { createDrawerNavigator} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MapStack from '../routes/mapStack';
import SettingsTab from '../Screens/SettingsTab';
import theme from '../Styles/theme';
import { styles } from '../Styles/style';
import PoppinStack from './poppinStack';
import TestingStack from './testingStack';
import ProfileStack from './profileStack';
import Util from '../scripts/Util';
import Loading from '../Screens/AppLoading';
import * as Permissions from 'expo-permissions';
import Login from '../Screens/Login Screen';
import { DrawerContent } from '../Screens/Components/Drawer Components/Drawer Content';




const Drawer = createDrawerNavigator();


function CustomDrawerContent(props, {navigation}){
  return(
      <DrawerContent {...props} navigate={navigation}/>
  ) 
}

function Poppin ({route, navigation}){
  const {user, friends, business, favorites, refresh, uploadImage} = route.params;
  return(
    <PoppinStack uploadImage={uploadImage} favorites={favorites} refresh={refresh} user={user} friends={friends} navigate={navigation} business={business}/>
  )
}

function Profile ({route, navigation}){
  const {user, friends, refresh, business, uploadImage, request } = route.params;
  return(
    <ProfileStack uploadImage={uploadImage} refresh={refresh} user={user} friends={friends} navigate={navigation} request={request} business={business}/>
  )
}


function MapMain ({route, navigation}){
  const {user, friends, refresh} = route.params;
  return(
    <MapStack  refresh={refresh} user={user} friends={friends} navigate={navigation} />
  )
}

function Settings ({route, navigation}){
  const {user, friends, refresh} = route.params;
  return(
    <SettingsTab   onDrawerPress={() => navigation.openDrawer()} refresh={refresh} user={user} friends={friends} navigate={navigation} />
  )
}

class Navigator extends React.Component {

  state = {
    userData: null,
    friendData: [],
    authLoaded: false,
    userChecked: false,
    friendRequests: null,
    dataLoaded: false,
    userExists: false,
    displayName: null,
    uploading: false,
    businessData: null,
    isBusiness: false, //only set at business sign up for first time
    businessState: null,
    favoritePlaceData: null,
  }

  getNeededData = async (currentUser) => {
    //if user exits get user data, get friend data set to async
    if (currentUser) {
        //load user
        await Util.user.GetUserData(currentUser.email, (userData) => {
          if(userData) {
            //user data set in filterfriends
            if(userData.isBusiness) {
                this.setState({
                  businessData: userData.businessData,
                  userData: userData
                });
            }
            else {
              if(userData.friendData) {
                this.setState({
                  friendData: userData.friendData.acceptedFriends,
                  friendRequests: userData.friendData.requests,
                  userChecked: true,
                  userData: userData
                });
              }
            }
          }
          else {
            this.setState({ userChecked: true });
          }
        });
    } else {
      alert(`A user could not be found. Error code: 0001`);
    }
  }

  refreshFromAsync = (userData, friendData, requests, businessData) => {
    if(userData){
      this.setState({ userData: userData });
    }
    if(friendData){
      this.setState({ friendData: friendData });
    }
    if(requests){
      this.setState({ friendRequests: requests });
    }
    if(businessData){
      this.setState({ businessData: businessData });
    }
  }


  firstTimeSignUp = (user) => {
    if(this.state.displayName){
      user.updateProfile({ displayName: this.state.displayName }).then(()=>{
        this.initializeParams(user);
      });
    }
  }

  onSignUpStates = (obj) => {
    if (!this.state.isBusiness) {
      this.setState({ displayName: obj.displayName });
    }
    else {
      this.setState({ displayName: obj.businessName });
    }
  }

  handleUploadImage = (callback) => {
    let isBusiness = this.state.isBusiness;
    let userData = this.state.userData;
    this.setState({ uploading: true});
    Util.user.HandleUploadImage(isBusiness, userData, (resUri, userData) => {
      this.setState({
        userData: userData,
        uploading: false
      });
      callback(resUri);
    });
  }

  setIsBusiness = (bool, signUpState) => {
    this.setState({ isBusiness: bool });
    if (signUpState) {
      this.setState({ businessState: signUpState });
    }
  }

  initializeParams = async (user) => {
    await Util.user.VerifyUser(user, user.email);
    await this.getNeededData(user);
    Permissions.askAsync(Permissions.LOCATION).then((status) => {
      if (status.status === 'granted') {
        Util.location.GetUserLocation(null, user);
      } else {
        throw new Error('Location permission not granted');
      }
    });
  }

  componentDidMount() {
    Util.user.CheckAuthStatus((user) => {
      this.setState({ authLoaded: true });
      if (user) {
        this.setState({
            userExists: true
        });
        if(user.displayName) {
            this.initializeParams(user);
        }
        else {
            this.firstTimeSignUp(user);
        }
      } 
      else {
        this.setState({
            authLoaded: true,
            userData: null,
            userExists: false
        });
      }
    })
  }

  render() {
    return (
      this.state.authLoaded ?
      this.state.userData ? 
        <NavigationContainer>
          <Drawer.Navigator 
            drawerContentOptions={{
              activeTintColor: theme.LIGHT_PINK,
              inactiveTintColor: theme.LIGHT_PINK
            }}
            drawerStyle={{
              backgroundColor: theme.DARK
            }}
            initialRouteName='My Feed'

            overlayColor="#20232A"
            drawerContent={props => <CustomDrawerContent {...props} uploading={this.state.uploading} uploadImage={this.handleUploadImage} refresh={this.refreshFromAsync} requests={this.state.friendRequests} friends={this.state.friendData} user={this.state.userData}/>}
            drawerType={"front"}
            overlayColor={"rgba(32, 35, 42, 0.50)"}
          >
            <Drawer.Screen name="Test" component={TestingStack} />
            <Drawer.Screen name="Profile" component={Profile} initialParams={{ uploadImage: this.handleUploadImage, user: this.state.userData, refresh: this.refreshFromAsync, business: this.state.businessData ? this.state.businessData : null, requests: this.state.friendRequests }}/>
            <Drawer.Screen name="My Feed" component={Poppin} initialParams={{ uploadImage: this.handleUploadImage, user: this.state.userData, friends: this.state.friendData, refresh: this.refreshFromAsync, business: this.state.businessData ? this.state.businessData : null, favorites: this.state.favoritePlaceData}}/>
            <Drawer.Screen name="Map" component={MapMain} initialParams={{user:this.state.userData, friends:this.state.friendData, refresh:this.refreshFromAsync}}/>
            <Drawer.Screen name="Settings" component={Settings}  initialParams={{user:this.state.userData, friends:this.state.friendData, refresh:this.refreshFromAsync}}/>
          </Drawer.Navigator>
        </NavigationContainer>
        : 
         this.state.userExists ? 
          <View style={styles.viewDark}>
            <ActivityIndicator size="large" color={theme.LIGHT_PINK}></ActivityIndicator>
          </View> 
          :
          <Login setBusiness={this.setIsBusiness} onSignUp={this.onSignUpStates} text={"Please login to continue!"}></Login>  
        :
        <Loading></Loading>
    );
  }
}

export default Navigator;
