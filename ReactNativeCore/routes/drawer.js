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
import * as ImagePicker from 'expo-image-picker';



const Drawer = createDrawerNavigator();


function CustomDrawerContent(props, {navigation}){
  return(
      <DrawerContent {...props} navigate={navigation}/>
  ) 
}

function Poppin ({route, navigation}){
  const {user, friends, business, favorites, refresh} = route.params;
  return(
    <PoppinStack favorites={favorites} refresh={refresh} user={user} friends={friends} navigate={navigation} business={business}/>
  )
}

function Profile ({route, navigation}){
  const {user, friends, refresh, business, uploadImage} = route.params;
  return(
    <ProfileStack uploadImage={uploadImage} refresh={refresh} user={user} friends={friends} navigate={navigation} business={business}/>
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

  getNeededData = (currentUser) => {
    //if user exits get user data, get friend data set to async
    if (currentUser) {
        //load user
        Util.user.GetUserData(currentUser.email, (userData) => {
          if(userData) {
            let user = JSON.stringify(userData);
            Util.asyncStorage.SetAsyncStorageVar('User', user);
            //load users who are friends or have requested the user
            //user data set in filterfriends
            if(userData.isBusiness) {
              Util.business.GetBusinessData(currentUser.email, (businessData) => {
                //console.log(JSON.stringify(businessData))
                this.setState({
                  businessData: businessData,
                  userData: userData
                });
              });
            }
            else {
              Util.friends.GetFriends(currentUser.email, (data) => {
                let obj = {
                  userFriends: userData.friends,
                  usersThatRequested: data
                }
                Util.friends.FilterFriends(obj, (data) => {
                  this.setState({
                    friendData: data.acceptedFriends,
                    friendRequests: data.requests,
                    friendRequests: data.requests,
                    userChecked: true,
                    userData: userData
                  });
                })
              });
            }
          }
          else {
            this.setState({ userChecked: true });
          }
        });
    } else {
      console.log('No user found!');
    }
  }

  refreshFromAsync = (userData, friendData, requests, businessData) => {
    if(userData){
      this.setState({userData: userData});
    }
    if(friendData){
      this.setState({friendData: friendData});
    }
    if(requests){
      this.setState({friendRequests: requests});
    }
    if(businessData){
      this.setState({businessData: businessData});
    }
  }


  firstTimeSignUp = (user) => {
    //console.log('setting display name first time')
    if(this.state.displayName){
      user.updateProfile({displayName:this.state.displayName}).then(()=>{
        this.initializeParams(user);
      });
    }

  }

  onSignUpStates = (obj) => {
    if(!this.state.isBusiness){
      //console.log('setting display name first time')
      this.setState({displayName:obj.displayName});
    }
    else {
      //console.log('setting business name');
      this.setState({displayName: obj.businessName});
    }
  }

  handleUploadImage = (callback) => {
    let userEmail = firebase.auth().currentUser.email;
    ImagePicker.getCameraRollPermissionsAsync()
    .then((result)=>{
      if(result.status == "granted"){
        this.setState({uploading:true});
      ImagePicker.launchImageLibraryAsync()
      .then((image)=>{
        let uri = image.uri;
        Util.user.UploadImage(uri, userEmail, (resUri) =>{
          let userData = this.state.userData;
          userData['photoSource'] = resUri;
            Util.user.UpdateUser(firebase.firestore(), userEmail, {photoSource:resUri}, ()=>{
              this.setState({userData:userData});
              this.setState({uploading:false});
            });
            if(this.state.userData.isBusiness){
              Util.business.UpdateUser(firebase.firestore(), userEmail, {photoSource:resUri}, ()=>{
                
              });
            }
          callback(resUri);
        });
      });
      }
      else {
        ImagePicker.requestCameraRollPermissionsAsync()
        .then((result)=>{
          if(result.status == "granted"){
            this.setState({uploading:true});
      ImagePicker.launchImageLibraryAsync()
      .then((image)=>{
        let uri = image.uri;
        Util.user.UploadImage(uri, userEmail, (resUri) =>{
          let userData = this.state.userData;
          userData['photoSource'] = resUri;
          Util.user.UpdateUser(firebase.firestore(), userEmail, {photoSource:resUri}, ()=>{
            this.setState({userData:userData});
            this.setState({uploading:false});
          });
          if(this.state.userData.isBusiness){
            Util.business.UpdateUser(firebase.firestore(), userEmail, {photoSource:resUri}, ()=>{
              
            });
          }
          callback(resUri);
        });
      });
          }
        });
      }
    });

    
  }

  setIsBusiness = (bool, signUpState) => {
    this.setState({ isBusiness: bool });
    if(signUpState){
      this.setState({ businessState: signUpState });
    }
  }

  initializeParams = (user) => {
    Util.user.VerifyUser(user, user.email, () => { 
      this.getLocationAsync((location) => {
        Util.location.SaveLocation(user.email, location, () => {
          this.getNeededData(user);
        });
      });        
    });
  }
  componentDidMount() {
    try{
      firebase.auth().onAuthStateChanged((user) =>{
        //auth done loading
        this.setState({authLoaded: true});
        if (user) {
          this.setState({
            userExists: true
          });
          if(user.displayName){
            this.initializeParams(user);
          }
          else {
            this.firstTimeSignUp(user);
          }
        } else {
          this.setState({
            authLoaded: true,
            userData: null,
            userExists: false
          });
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
            initialRouteName='My Feed'

            overlayColor="#20232A"
            drawerContent={props => <CustomDrawerContent {...props} uploading={this.state.uploading} uploadImage={this.handleUploadImage} refresh={this.refreshFromAsync} requests={this.state.friendRequests} friends={this.state.friendData} user={this.state.userData}/>}
            drawerType={"front"}
            overlayColor={"rgba(32, 35, 42, 0.50)"}
          >
            <Drawer.Screen name="Test" component={TestingStack} />
            <Drawer.Screen name="Profile" component={Profile} initialParams={{uploadImage:this.handleUploadImage, refresh:this.refreshFromAsync, business:this.state.businessData?this.state.businessData:null}}/>
            <Drawer.Screen name="My Feed" component={Poppin} initialParams={{user:this.state.userData, friends:this.state.friendData, refresh:this.refreshFromAsync, business:this.state.businessData ?this.state.businessData:null, favorites:this.state.favoritePlaceData}}/>
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
