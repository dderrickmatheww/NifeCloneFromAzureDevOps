import * as React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import { createDrawerNavigator} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MapStack from './mapStack';
import SettingsTab from '../components/Settings/SettingsTab';
import theme from '../../src/styles/theme';
import PoppinStack from './poppinStack';
//import TestingStack from './testingStack';
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

function MapMain ({navigation}){
  return(
    <MapStack  navigate={navigation} />
  )
}

function Settings ({navigation}){
  return(
    <SettingsTab   onDrawerPress={() => navigation.openDrawer()}  navigate={navigation} />
  )
}

class Navigator extends React.Component {

  state = {
    userData: this.props.userData,
    friendData: this.props.friendData,
    feedData: this.props.feedData,
    authLoaded: false,
    userChecked: false,
    friendRequests: null,
    dataLoaded: false,
    userExists: false,
    displayName: null,
    uploading: false,
    businessSignUp: null,
    isBusiness: false,
    //only set at business sign up for first time
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
    if(this.state.displayName || this.state.businessSignUp.businessName) {
      user.updateProfile({ displayName: this.state.businessSignUp ? this.state.businessSignUp.businessName :  this.state.displayName})
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
    let userData = this.props.userData;
    let isBusiness = this.props.userData.isBusiness;
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
        businessSignUp: signUpState,
        authLoaded: true,
        displayName: signUpState.businessName,
      });
    }
  }

  initializeParams = async (user) => {
    await Util.user.VerifyUser(user, user.email, this.state.businessSignUp, (userObj) => {
      let user = userObj;
      this.getNeededData(user);
      //get push notification permissions
      Util.user.registerForPushNotificationsAsync((token) => {
        Util.user.UpdateUser(user.email, token);
      });
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
        Comfortaa: require('../../src/media/Fonts/Comfortaa/static/Comfortaa-Regular.ttf'),
        ComfortaaLight: require('../../src/media/Fonts/Comfortaa/static/Comfortaa-Light.ttf'),
        ComfortaaBold: require('../../src/media/Fonts/Comfortaa/static/Comfortaa-Bold.ttf')
      });
    }
    catch (error) {
      //console.log(error);
    }
    await Util.user.CheckAuthStatus(async (user) => {
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
          userExists: false
        });
        this.props.refresh(null);
      }
    })
  }

  getNeededData = (currentUser) => {
    //if user exits get user data, get friend data set to async
    if (currentUser) {
      //load user
      const req = {
        email: currentUser.email,
        take: 50,
        skip: 0,
        getUserFeed: true
      }
      Util.user.GetUserData(req.email, (userData) => {
        Util.user.getFeed(req, async (feed) => {
          if(userData) {
            //user data set in filterfriends
            if(userData.isBusiness) {
              Util.dataCalls.Yelp.getBusinessData(userData.businessId, (data) => {
                userData.businessData['data'] = data;
                Util.business.UpdateUser(userData.email, { data: data });
                this.props.refresh(userData, feed);
              });
            }
            else {
              if(userData.friendData) {
                this.setState({
                  userChecked: true,
                });
                this.props.refresh(userData, feed);
              }
              else {
                this.props.refresh(userData, feed);
              }
            }
          }
          else {
            this.setState({ userChecked: true });
          }
        });
      });
    } else {
      alert(`A user could not be found. Error code: 0001`);
    }
  }

 
  Login ({route, navigation}){
    const {user, friends, business, favorites, refresh, uploadImage} = route.params;
    return(
      <LoginScreen navigate={navigation} setIsBusiness={this.setIsBusiness} refresh={refresh} onSignUp={this.onSignUpStates} text={"Please login to continue!"} ></LoginScreen>
    )
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
              drawerContent={props => <CustomDrawerContent {...props} uploading={this.state.uploading} uploadImage={this.handleUploadImage} refresh={this.props.refresh} requests={this.props.friendRequests} friends={this.props.friendData} user={this.props.userData}/>}
              drawerType={"front"}
              overlayColor={"rgba(32, 35, 42, 0.50)"}
            >
              {/* <Drawer.Screen name="Test" component={TestingStack} /> */}
              <Drawer.Screen name="Profile" component={Profile} initialParams={{ uploadImage: this.handleUploadImage, user: this.props.userData, business: this.props.businessData ? this.props.businessData : null, requests: this.props.friendRequests }}/>
              <Drawer.Screen name="My Feed" component={Poppin} initialParams={{ uploadImage: this.handleUploadImage, user: this.props.userData, friends: this.props.friendData,  business: this.props.businessData ? this.props.businessData : null, favorites: this.state.favoritePlaceData}}/>
              <Drawer.Screen name="Map" component={MapMain}/>
              <Drawer.Screen name="Settings" component={Settings}  initialParams={{ user: this.state.userData, friends: this.state.friendData, refresh: this.props.refresh }}/>
              <Drawer.Screen name="Login" component={ this.Login }  initialParams={{ user: this.state.userData, friends: this.state.friendData, refresh: this.props.refresh }}/>
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
  return {
    userData: state.userData,
    feedData: state.feedData,
    friendRequests: state.friendRequests,
    friendData: state.friendData,
    businessData: state.businessData,
  }
}

function mapDispatchToProps(dispatch){
  return {
    refresh: (userData, feedData) => dispatch({ type:'REFRESH', data: userData, feed: feedData }),
    yelpDataRefresh: (data) => dispatch({ type:'YELPDATA', data: data }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigator);
