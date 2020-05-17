import React from 'react';
import { AndroidClientKey, IOSClientKey, ClientKey } from 'react-native-dotenv';
import * as firebase from 'firebase';
import * as Google from 'expo-google-app-auth';
import Config from '../Universal Components/ConfigFunctions';

async function FirebaseGoogleLogin (callBack) {
    let dataObj = {};
    try {
        let result = await Google.logInAsync({
            androidClientId: AndroidClientKey,
            iosClientId: IOSClientKey,
            clientId: ClientKey
        });
        if (result.type === 'success') {
            /* `accessToken` is now valid and can be used to get data from the Google API with HTTP requests */
            const googleCredential = firebase.auth.GoogleAuthProvider.credential(result.idToken);
            // Sign-in the user with the credential
            await firebase.auth().signInWithCredential(googleCredential).catch((error) => {console.log("Firebase Google Auth Error: " + error)});
            Config.SetAsyncStorageVar('GOToken', result.accessToken);
            dataObj['data'] = firebase.auth().currentUser;
            dataObj['user'] = firebase.auth().currentUser;
            callBack(dataObj);
        }
    } 
    catch ({ message }) {
        alert(`Google Login Error: ${message}`);
    }
}

export default FirebaseGoogleLogin;
