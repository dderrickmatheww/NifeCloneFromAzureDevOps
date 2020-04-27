import React from 'react';
import { GOOGLE_OAUTH_WEB_CODE } from 'react-native-dotenv';
import * as firebase from 'firebase';
import * as Google from 'expo-google-app-auth';

async function FirebaseGoogleLogin (callBack) {
    let dataObj = {};
    try {
        let { type, accessToken, user } = await Google.logInAsync({
            clientId: GOOGLE_OAUTH_WEB_CODE
        });
        if (type === 'success') {
            /* `accessToken` is now valid and can be used to get data from the Google API with HTTP requests */
            console.log(user);
            // Create a Google credential with the token
            const googleCredential = firebase.auth.GoogleAuthProvider.credential(accessToken);
            // Sign-in the user with the credential
            await firebase.auth().signInWithCredential(googleCredential).catch((error) => {console.log(error)});
            dataObj['data'] = data;
            dataObj['token'] = token;
            dataObj['user'] = firebase.auth().currentUser;
            callBack(dataObj);
        }
    } 
    catch ({ message }) {
        alert(`Google Login Error: ${message}`);
    }
}

export default FirebaseGoogleLogin;
