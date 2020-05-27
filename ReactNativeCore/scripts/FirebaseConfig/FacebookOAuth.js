import React from 'react';
import * as Facebook from 'expo-facebook';
import { FACEBOOK_APP_ID } from 'react-native-dotenv';
import { AsyncStorage  } from 'react-native';
import * as firebase from 'firebase';
import Config from '../Universal Components/ConfigFunctions';
//Intialize Facebook Login
const BUNDLE_ID = 'com.reactnativecore';

async function FireBaseFacebookLogin (callBack) {
  let dataObj = {};
  // Listen for authentication state to change.
  await Facebook.initializeAsync(FACEBOOK_APP_ID, BUNDLE_ID);
  try {
    const {
      type,
      token,
      expires,
      permissions,
      declinedPermissions,
    } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
      permissions: ['public_profile'],
    });
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`)
        .then(response => response.json())
        .then(async data => {
          const credential = firebase.auth.FacebookAuthProvider.credential(token);
          await firebase.auth().signInWithCredential(credential).catch((error) => {console.log('Firebase Facebook Auth Error: ' + error)});
          dataObj['data'] = firebase.auth().currentUser;
          dataObj['token'] = token;
          dataObj['user'] = firebase.auth().currentUser;
          Config.SetAsyncStorageVar('FBToken', token);
          callBack(dataObj);
        })
        .catch(e => console.log(e))
    } else {
      // type === 'cancel'
    }
  } catch ({ message }) {
    alert(`Facebook Login Error: ${message}`);
  }
}
export default FireBaseFacebookLogin;