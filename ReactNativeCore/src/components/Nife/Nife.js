import * as React from 'react';
import {connect} from "react-redux";
import {alert} from "../../utils/util";
import LoginScreen from "../Login/LoginScreen";
import {initiateAuthObserver, loadFonts} from './helpers'
import {Loading} from "../Loading";
import DrawerComponent from "../Drawer/Drawer";

//TODO update store state

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

  handleAuthChange = async ({authLoaded}) => {
    this.setState({authLoaded})
  }

  async componentDidMount() {
    try {
      await initiateAuthObserver(this.props.refresh, this.handleAuthChange);
      await loadFonts()
    }
    catch (error) {
      alert('NIFE ERROR!', 'ERROR LOADING USER INFO PLEASE RESTART');
    }
  }


  render() {
    return (
        this.state.authLoaded ?
            this.props.userData ?
              <DrawerComponent />:
              <LoginScreen />
            :
            <Loading />
      );
  }
}


function mapStateToProps(state){
  return {
    ...state
  }
}

function mapDispatchToProps(dispatch){
  return {
    refresh: (userData, feedData) => dispatch({ type:'REFRESH', data: userData, feed: feedData }),
    yelpDataRefresh: (data) => dispatch({ type:'YELPDATA', data: data }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NifeApp);
