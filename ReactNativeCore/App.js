import * as React from 'react';
import Navigator from './routes/drawer';
import {decode, encode} from 'base-64';
import * as firebase from 'firebase';
import Util from './scripts/Util'
import config from './scripts/FirebaseConfig/FirebaseConfig';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

if (! global.btoa) {global.btoa = encode}

if (! global.atob) {global.atob = decode}
var userSignedIn = false;
var loadingDone = false;

//Intialize Firebase Database
firebase.initializeApp(config);

//When a user is signed into firebase, gets user/friend data sets to async, sets users location to async
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // setWantedData(firebase.firestore(), firebase.auth().currentUser);
    getNeededData(firebase.firestore(), firebase.auth().currentUser);
    getLocationAsync((location)=>{
      console.log(location);
      setWantedData(firebase.firestore(), firebase.auth().currentUser, location);
    });
    
    userSignedIn = true;
  } else {
    console.log('User signed out');
  }
});

async function getLocationAsync(callback) {
  // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
  const { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status === 'granted') {
    Location.getCurrentPositionAsync({enableHighAccuracy:true}).then((location) => {
      callback(location);
    });
    
  } else {
    throw new Error('Location permission not granted');
  }
}


function getNeededData(db, currentUser){
  let friends = null;
  let user = null;
  console.log('running data grabber')
  //if user exits get user data, get friend data set to async 
  if(currentUser){
    console.log('User exists');
    Util.user.GetUserData(db, currentUser.email, (data)=>{
      user = JSON.stringify(data);
      Util.asyncStorage.SetAsyncStorageVar('User', user);
      // console.log(user);
      // console.log("################################################################################################");
    });
  
    Util.friends.GetFriends(db, currentUser.email, (data)=>{
      console.log('Got Friend Data');
      friends = JSON.stringify(data);
      Util.asyncStorage.SetAsyncStorageVar('Friends', friends);
      // console.log(friends);
      // console.log("################################################################################################");
    });
    loadingDone = true;
  } else {
    console.log('no user!')
    loadingDone = true;
  }
}

//sends user login location to db
function setWantedData(db, currentUser, location ){
  Util.location.SaveLocation(db, currentUser.email, location, () =>{
    console.log('save location');
  });
}

export default function App() {
  
  return(

      <Navigator />
  );
}

