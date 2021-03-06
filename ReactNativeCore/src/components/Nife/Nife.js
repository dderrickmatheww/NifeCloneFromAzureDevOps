import * as React from 'react';
import { connect } from "react-redux";
import { alert } from "../../utils/util";
import LoginScreen from "../Login/LoginScreen";
import { initiateAuthObserver, loadFonts } from './helpers'
import { Loading } from "../Loading";
import DrawerComponent from "../Drawer/Drawer";

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

  updateState = async ({authLoaded, userData}) => {
    this.setState({ authLoaded, userData })
  }

  async componentDidMount() {
    try {
      await initiateAuthObserver(this.props.refresh, this.updateState);
      await loadFonts()
    }
    catch (error) {
      alert('NIFE ERROR!', 'ERROR LOADING USER INFO PLEASE RESTART');
    }
  }


  render() {
    return (
        // have to use state.userData instead of props.userData because it wouldn't render correctly
        this.state.authLoaded ?
            this.state.userData ?
              <DrawerComponent />
              :
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

function mapDispatchToProps(dispatch) {
  return {
      refresh: ({ userData, businessData }) => dispatch({
          type:'REFRESH', 
          data: {
              userData,
              businessData 
          }
      })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NifeApp);
