import * as React from 'react';
import { View, Text } from 'react-native'
// import { createDrawerNavigator} from '@react-navigation/drawer';
// import { NavigationContainer } from '@react-navigation/native';
// import Util from "../scripts/Util";
// // import {DrawerContent} from "./Drawer/Drawer Content";
import {connect} from "react-redux";
import Util from "../scripts/Util";
import LoginScreen from "./Login/LoginScreen";

;

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

// const Drawer = createDrawerNavigator();



class NifeApp extends React.Component {
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
  async componentDidMount() {
    //load fonts
    try {
      // await Font.loadAsync({
      //   Comfortaa: require('../media/Fonts/Comfortaa/static/Comfortaa-Regular.ttf'),
      //   ComfortaaLight: require('../media/Fonts/Comfortaa/static/Comfortaa-Light.ttf'),
      //   ComfortaaBold: require('../media/Fonts/Comfortaa/static/Comfortaa-Bold.ttf')
      // });
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


  render() {
    return (
      <LoginScreen />
    );
  }
}


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

export default connect(mapStateToProps, mapDispatchToProps)(NifeApp);
