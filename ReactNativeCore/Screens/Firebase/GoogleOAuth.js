import React from 'react';
import { GOOGLE_OAUTH_WEB_CODE,  ANDROID_GOOGLE_OAUTH_WEB_CODE, IOS_GOOGLE_OAUTH_WEB_CODE} from 'react-native-dotenv';
import * as firebase from 'firebase';
import * as Google from 'expo-google-app-auth';
import {VerifyUser} from '../Firebase/UserUtil'

async function FirebaseGoogleLogin (callBack) {
    let dataObj = {};
    try {
        let result = await Google.logInAsync({
            androidClientId: ANDROID_GOOGLE_OAUTH_WEB_CODE,
            iosClientId:IOS_GOOGLE_OAUTH_WEB_CODE,
            clientId: GOOGLE_OAUTH_WEB_CODE
        });
        if (result.type === 'success') {
           
            /* `accessToken` is now valid and can be used to get data from the Google API with HTTP requests */
            
            const googleCredential = firebase.auth.GoogleAuthProvider.credential(result.idToken);
            // Sign-in the user with the credential
            await firebase.auth().signInWithCredential(googleCredential).catch((error) => {console.log("poop " + error)});
            dataObj['data'] = result.user;
            dataObj['token'] = result.accessToken;
            dataObj['user'] = firebase.auth().currentUser;
            console.log(dataObj.user);
            VerifyUser(firebase.firestore(), dataObj.user, dataObj.user.email, (data) =>{
                console.log(data);
            });
            callBack(dataObj);
        }
    } 
    catch ({ message }) {
        alert(`Google Login Error: ${message}`);
    }
}

export default FirebaseGoogleLogin;
