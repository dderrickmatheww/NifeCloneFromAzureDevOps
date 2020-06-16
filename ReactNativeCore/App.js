import * as React from 'react';
import Navigator from './routes/drawer';
import {decode, encode} from 'base-64';
import * as firebase from 'firebase';
import Util from './scripts/Util';
import Location from 'expo-location'
import * as Permissions from 'expo-permissions';

if (! global.btoa) {global.btoa = encode}

if (! global.atob) {global.atob = decode}

//Intialize Firebase Database
firebase.initializeApp(Util.dataCalls.Firebase.config);

//When a user is signed into firebase, gets user/friend data sets to async, sets users location to async
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log('Auth Changed!');
      getLocationAsync((location) => {
        console.log('Location App.js')
        setWantedData(firebase.firestore(), user, location, () => {
          console.log('wantedData App.js')
          getNeededData(firebase.firestore(), user);
        });        
      })
  } else {
    console.log('No user');
  }
});

async function getLocationAsync(callback) {
  // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
 const { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status === 'granted') {
    Util.location.GetUserLocation((location) => {
      callback(location);
    });
  } else {
      throw new Error('Location permission not granted');
  }
}


function getNeededData(db, currentUser){
  //if user exits get user data, get friend data set to async 
  console.log('wantedData App.js', currentUser)
  if(currentUser){
    console.log('User exists');
    Util.user.GetUserData(db, currentUser.email, (data) => {
      let user = JSON.stringify(data);
      Util.asyncStorage.SetAsyncStorageVar('User', user);
    });
    Util.friends.GetFriends(db, currentUser.email, (data) => {
      let friends = JSON.stringify(data);
      Util.asyncStorage.SetAsyncStorageVar('Friends', friends);
    });
  } else {
    console.log('no user!');
  }
}

//sends user login location to db
function setWantedData(db, currentUser, location, callback){
  Util.location.SaveLocation(db, currentUser.email, location, () => {
    callback();
  });
}

export default function App() {
  console.ignoredYellowBox = ['Setting a timer'];
  return(
      <Navigator />
  );
}

