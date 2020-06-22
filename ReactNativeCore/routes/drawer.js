import * as React from 'react';
import {View, ActivityIndicator} from 'react-native';
import { createDrawerNavigator} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from '../routes/homeStack';
import MapStack from '../routes/mapStack';
import SettingsTab from '../Screens/SettingsTab';
import theme from '../Styles/theme';
import {styles} from '../Styles/style';
import PoppinStack from './poppinStack';
import TestingStack from './testingStack';
import profileStack from './profileStack';
import Util from '../scripts/Util';
import * as firebase from 'firebase';
import Loading from '../Screens/AppLoading';
import * as Permissions from 'expo-permissions';
import Login from '../Screens/Login Screen';
import {DrawerContent} from '../Screens/Components/Drawer Components/Drawer Content';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props, {navigation}){
  return(
      <DrawerContent {...props} navigate={navigation}/>
  )
  
}

class Navigator extends React.Component {

  state = {
    userData: null,
    friendData: [],
    authLoaded: false,
    userChecked: false,
  }
  //sends user login location to db
  setWantedData = (db, currentUser, location, callback) => {
    Util.location.SaveLocation(db, currentUser.email, location, () => {
      callback();
    });
  }

  getLocationAsync = (callback) => {
    // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
    Permissions.askAsync(Permissions.LOCATION).then(status => {
      if (status.status === 'granted') {
        Util.location.GetUserLocation((location) => {
          callback(location);
        });
      } else {
        throw new Error('Location permission not granted');
      }
    });
  }

  getNeededData = (db, currentUser) => {
    //if user exits get user data, get friend data set to async 
    console.log('wantedData App.js', currentUser)
    if (currentUser) {
      Util.user.GetUserData(db, currentUser.email, (data) => {
          if(data) {
            let user = JSON.stringify(data);
            Util.asyncStorage.SetAsyncStorageVar('User', user);
            this.setState({userData:data});
            this.setState({userChecked:true});
            Util.friends.GetFriends(db, currentUser.email, (data) => {
              let friends = JSON.stringify(data);
              Util.asyncStorage.SetAsyncStorageVar('Friends', friends);
              this.setState({friendData: data})
            });
          }
          else {
            this.setState({userChecked:true});
          }
        });
    } else {
      console.log('no user!');
    }
  }

  componentDidMount() {
    try{
      firebase.auth().onAuthStateChanged((user) =>{
        if (user) {
          Util.user.VerifyUser(user, user.email, () => {
            this.getLocationAsync((location) => {
              this.setWantedData(firebase.firestore(), user, location, () => {
                this.getNeededData(firebase.firestore(),  user);
                this.setState({authLoaded: true});
              });        
            });
          });
        } else {
          this.setState({authLoaded: true});
          console.log('No user');
        }
      });
    }
    catch (error){
        console.error(error);
    }  
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
            initialRouteName='Home'
            overlayColor="#20232A"
            drawerContent={props => <CustomDrawerContent {...props} friends={this.state.friendData} user={this.state.userData}/>}
            drawerType={"front"}
            overlayColor={"rgba(32, 35, 42, 0.85)"}
          >
            <Drawer.Screen name="Test" component={TestingStack} />
            <Drawer.Screen name="Profile" component={profileStack} />
            <Drawer.Screen name="Home" component={HomeStack} />
            <Drawer.Screen name="What's Poppin'?" component={PoppinStack} />
            <Drawer.Screen name="Map" component={MapStack} />
            <Drawer.Screen name="Settings" component={SettingsTab} />
          </Drawer.Navigator>
        </NavigationContainer>
        : 
        <Login text={"Please login so we can show you where you should have a night to remember..."}></Login> 
        :
        <Loading></Loading>
    );
  }
}

export default Navigator;