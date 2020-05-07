import React from 'react';
import { GOOGLE_OAUTH_WEB_CODE } from 'react-native-dotenv';
import * as firebase from 'firebase';
import * as Google from 'expo-google-app-auth';

async function FirebaseGoogleLogin (callBack) {
    let dataObj = {};
    try {
        let { type, accessToken, user } = await Google.logInAsync({
            androidClientId: "690308281698-i9t0qi4r00qbkr1k69b0qf0edc81lfl5.apps.googleusercontent.com",
            iosClientId:"690308281698-s3g5bo9uahmd3orm4aeljhac5gnlgr1l.apps.googleusercontent.com"
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
