import * as React from 'react';
import Navigator from './routes/drawer';
import {decode, encode} from 'base-64';
import * as firebase from 'firebase';
import Util from './scripts/Util'
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
// import AppLoading from './Screens/AppLoading';
// import Settings from './Screens/SettingsTab';

if (! global.btoa) {global.btoa = encode}

if (! global.atob) {global.atob = decode}

//Intialize Firebase Database
firebase.initializeApp(Util.dataCalls.Firebase.config);

  
//When a user is signed into firebase, gets user/friend data sets to async, sets users location to async
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log('Auth Changed!');
    // console.log("App.js user: " + user);
      getLocationAsync((location)=>{
        setWantedData(firebase.firestore(), user, location,()=>{
          getNeededData(firebase.firestore(), user);
        });        
      }
    )
  } else {
    console.log('No user');
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
  } else {
    console.log('no user!')
  }
}

async function getLocationAsync(callback) {
  // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
  const { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status === 'granted') {
    var loc;
    Location.getCurrentPositionAsync({enableHighAccuracy:true}).then((location) => {
      console.log("Lat: " + location.coords.latitude + " Long: " + location.coords.longitude);
      Location.reverseGeocodeAsync(location.coords).then((region)=>{
        loc = {
          coords: location.coords,
          region: region[0]
        }                  
        console.log(loc);
        callback(loc)
      });
    });
    
  } else {
    throw new Error('Location permission not granted');
  }
}


//sends user login location to db
function setWantedData(db, currentUser, location, callback){
  Util.location.SaveLocation(db, currentUser.email, location, () =>{
    console.log('save location');
    callback();
  });
}

export default function App() {
  console.ignoredYellowBox = ['Setting a timer'];
  return(
      <Navigator />
  );
}

