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
import ProfileStack from './profileStack';
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

function Poppin ({route, navigation}){
  const {user, friends, refresh} = route.params;
  return(
    <PoppinStack refresh={refresh} user={user} friends={friends} navigate={navigation}/>
  )
}

function Profile ({route, navigation}){
  const {user, friends, refresh} = route.params;
  return(
    <ProfileStack refresh={refresh} user={user} friends={friends} navigate={navigation}/>
  )
}

class Navigator extends React.Component {

  state = {
    userData: null,
    friendData: [],
    authLoaded: false,
    userChecked: false,
    friendRequests:null,
    dataLoaded:false,
    userExists:false,
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

  getNeededData = (db, currentUser, callback) => {
    //if user exits get user data, get friend data set to async 
    console.log('wantedData App.js', currentUser)
    if (currentUser) {
      //load user
      Util.user.GetUserData(db, currentUser.email, (userData) => {
          if(userData) {
            let user = JSON.stringify(userData);
            Util.asyncStorage.SetAsyncStorageVar('User', user);
            
            //load users who are friends or have requested the user
            Util.friends.GetFriends(db, currentUser.email, (data) => {
              this.filterFriends(data, userData);
              callback();
              // console.log(JSON.stringify(data));
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

  filterFriends = (friendsData, userData)=> {
    let userFriends = userData.friends;
    let usersThatRequested = friendsData;
    let requests = [];
    let acceptedFriends = [];
    if(userFriends){
      let keys = Object.keys(userFriends);
      keys.forEach(function(key){
        if(userFriends[key] == null){
          usersThatRequested.forEach((user)=>{
            if(key == user.email){
              requests.push(user);
            }
          });
        }
        if(userFriends[key] == true){
          usersThatRequested.forEach((user)=>{
            if(key == user.email){
              acceptedFriends.push(user);
            }
          });
        }
      });
    }
    
    let friends = JSON.stringify(friendsData);
    Util.asyncStorage.SetAsyncStorageVar('Friends', friends);
    
    this.setState({friendData: acceptedFriends});
    this.setState({friendRequests: requests});
    this.setState({userData:userData});
    this.setState({userChecked:true});
  }

  refreshFromAsync = (userData, friendData, requests) => {
    if(userData){
      this.setState({userData: userData});
    }
    if(friendData){
      this.setState({friendData: friendData});
    }
    if(requests){
     
      this.setState({friendRequests: requests});
    }
  }

  componentDidMount() {
    try{
      firebase.auth().onAuthStateChanged((user) =>{
        this.setState({authLoaded: true});
        if (user) {  
          this.setState({dataLoaded:true});
          this.setState({userExists:true})
          Util.user.VerifyUser(user, user.email, () => {
            
            this.getLocationAsync((location) => {
              this.setWantedData(firebase.firestore(), firebase.auth().currentUser, location, () => {
                this.getNeededData(firebase.firestore(),  firebase.auth().currentUser, ()=>{console.log('got data')});
                
              });        
            });
          });
        } else {
          this.setState({authLoaded: true});
          this.setState({dataLoaded:true});
          this.setState({userExists:false});
          this.setState({userData: null});
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
      this.state.dataLoaded ? 
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
            drawerContent={props => <CustomDrawerContent {...props} refresh={this.refreshFromAsync} requests={this.state.friendRequests} friends={this.state.friendData} user={this.state.userData}/>}
            drawerType={"front"}
            overlayColor={"rgba(32, 35, 42, 0.50)"}
          >
            <Drawer.Screen name="Test" component={TestingStack} />
            <Drawer.Screen name="Profile" component={Profile} initialParams={{user:this.state.userData, friends:this.state.friendData, refresh:this.refreshFromAsync}}/>
            <Drawer.Screen name="My Feed" component={Poppin} initialParams={{user:this.state.userData, friends:this.state.friendData, refresh:this.refreshFromAsync}}/>
            <Drawer.Screen name="Map" component={MapStack} />
            <Drawer.Screen name="Settings" component={SettingsTab} />
          </Drawer.Navigator>
        </NavigationContainer>
        : 
         this.state.userExists ? 
          <View style={styles.viewDark}>
            <ActivityIndicator size="large" color={theme.LIGHT_PINK}></ActivityIndicator>
          </View> 
          :
          <Login text={"Please login so we can show you where you should have a night to remember..."}></Login> 
        :
        <View style={styles.viewDark}>
          <ActivityIndicator size="large" color={theme.LIGHT_PINK}></ActivityIndicator>
        </View> 
        :
        <Loading></Loading>
    );
  }
}

export default Navigator;