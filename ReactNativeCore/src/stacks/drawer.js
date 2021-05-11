import * as React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import { createDrawerNavigator} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MapStack from './mapStack';
import SettingsTab from '../components/Settings/SettingsTab';
import theme from '../../Styles/theme';
import PoppinStack from './poppinStack';
import TestingStack from './testingStack';
import ProfileStack from './profileStack';
import Util from '../scripts/Util';
import Loading from '../components/Universal/AppLoading';
import * as Permissions from 'expo-permissions';
import LoginScreen from '../components/Login/Login Screen';
import { DrawerContent } from '../components/Drawer/Drawer Content';
import * as Font from 'expo-font';
import {connect} from "react-redux";

//TODO update redux state

/**
 * Store - holds our state - THERE IS ONLY ONE STATE
 * Action - State can be modified using actions - SIMPLE OBJECTS
 * Dispatcher - Action needs to be sent by someone - known as dispatching an action
 * Reducer - receives the action and modifies the state to give us a new state
 *  - pure functions
 *  - only mandatory argument is the 'type'
 * Subscriber - listens for state change to update the ui
 */

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
  const { uploadImage } = route.params;
  return(
    <ProfileStack uploadImage={uploadImage} navigate={navigation}/>
  )
}

function MapMain ({route, navigation}){
  const {user, friends, refresh} = route.params;
  return(
    <MapStack  refresh={refresh} user={user} friends={friends} navigate={navigation} />
  )
}

function Settings ({navigation}){
  return(
    <SettingsTab   onDrawerPress={() => navigation.openDrawer()}  navigate={navigation} />
  )
}

function FriendList({navigation}, data){
  return navigation.navigate('Profile', {screen:'Friends',
    params: data,
  })
}

class Navigator extends React.Component {

  state = {
    userData: this.props.userData,
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
    notification: null,
  }

  //todo replace with global state updater
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
    if(this.state.displayName) {
      user.updateProfile({ displayName: this.state.displayName })
      .then(() => {
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
    let userData = this.props.userData;
    this.setState({ uploading: true});
    Util.user.HandleUploadImage(isBusiness, userData, (resUri) => {
      this.setState({
        // userData: userData, //todo remove
        uploading: false
      });
      callback(resUri);
    });
  }

  setIsBusiness = (bool, signUpState) => {
    this.setState({ isBusiness: bool });
    if (signUpState) {
      this.setState({ 
        businessState: signUpState,
        authLoaded: true
      });
    }
  }

  initializeParams = async (user) => {
    await Util.user.VerifyUser(user, user.email, (userObj) => {
      let user = userObj;
      this.getNeededData(user);
      Permissions.askAsync(Permissions.LOCATION).then((status) => {
        if (status.status === 'granted') {
          Util.location.GetUserLocation(null, user);
        } 
        else {
          Util.basicUtil.Alert('Nife Message', 'Nife is used primary based on location. We use your location to show you event going on around your current location! For more information please see our privacy statement, thank you for downloading!', null);
        }
      });
    });
  }

  async componentDidMount() {
    //load fonts
    try {
      await Font.loadAsync({
        Comfortaa: require('../../Media/Fonts/Comfortaa/static/Comfortaa-Regular.ttf'),
        ComfortaaLight: require('../../Media/Fonts/Comfortaa/static/Comfortaa-Light.ttf'),
        ComfortaaBold: require('../../Media/Fonts/Comfortaa/static/Comfortaa-Bold.ttf')
      });
    }
    catch (error) {
      console.log(error);
    }
    await Util.user.CheckAuthStatus((user) => {
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
        //get push notification permissions
        Util.user.registerForPushNotificationsAsync((token) => {
          Util.user.UpdateUser(user.email, token);
        });
      }
      else {
        this.setState({
          authLoaded: true,
          // userData: null, //TODO remove
          userExists: false
        });

        this.props.refresh(null);
      }
    })
    //register notifications
  }

  getNeededData = (currentUser) => {
    //if user exits get user data, get friend data set to async
    if (currentUser) {
      //load user
      Util.user.GetUserData(currentUser.email, (userData) => {
        if(userData) {
          //user data set in filterfriends
          if(userData.isBusiness) {
            this.props.refresh(userData);
          }
          else {
            if(userData.friendData) {
              this.props.refresh(userData);
              this.setState({
                userChecked: true,
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

  render() {
    return (
      this.state.authLoaded ?
        this.props.userData ?
          <NavigationContainer>
            <Drawer.Navigator 
              drawerContentOptions={{
                activeTintColor: theme.generalLayout.backgroundColor,
                inactiveTintColor: theme.loadingIcon.color,
                labelStyle: {
                  color: theme.generalLayout.textColor,
                  fontFamily: theme.generalLayout.font
                }
              }}
              drawerStyle={{
                backgroundColor: theme.generalLayout.backgroundColor
              }}
              initialRouteName='My Feed'
              drawerContent={props => <CustomDrawerContent {...props} uploading={this.state.uploading} uploadImage={this.handleUploadImage} refresh={this.refreshFromAsync} requests={this.props.friendRequests} friends={this.props.friendData} user={this.props.userData}/>}
              drawerType={"front"}
              overlayColor={"rgba(32, 35, 42, 0.50)"}
            >
              <Drawer.Screen name="Test" component={TestingStack} />
              <Drawer.Screen name="Profile" component={Profile} initialParams={{ uploadImage: this.handleUploadImage, user: this.props.userData, business: this.props.businessData ? this.props.businessData : null, requests: this.props.friendRequests }}/>
              <Drawer.Screen name="My Feed" component={Poppin} initialParams={{ uploadImage: this.handleUploadImage, user: this.props.userData, friends: this.props.friendData,  business: this.props.businessData ? this.props.businessData : null, favorites: this.state.favoritePlaceData}}/>
              <Drawer.Screen name="Map" component={MapMain} initialParams={{user:this.state.userData, friends:this.state.friendData, refresh: this.refreshFromAsync}}/>
              <Drawer.Screen name="Settings" component={Settings}  initialParams={{user:this.state.userData, friends:this.state.friendData, refresh: this.refreshFromAsync}}/>
            </Drawer.Navigator>
          </NavigationContainer>
        : 
            this.state.userExists ? 
              <View style={localStyles.viewDark}>
                <ActivityIndicator size="large" color={theme.loadingIcon.color}></ActivityIndicator>
              </View> 
            :
              <LoginScreen setIsBusiness={this.setIsBusiness} onSignUp={this.onSignUpStates} text={"Please login to continue!"}></LoginScreen>
      :
        <Loading></Loading>
    );
  }
}

const localStyles = StyleSheet.create({
  viewDark: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center' ,
    backgroundColor: theme.generalLayout.backgroundColor
  }
})

function mapStateToProps(state){
  return{
    userData: state.userData,
    friendRequests: state.friendRequests,
    friendData: state.friendData,
    businessData: state.businessData,
  }
}

function mapDispatchToProps(dispatch){
  return {
    refresh: (userData) => dispatch({type:'REFRESH', data:userData})
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Navigator);
