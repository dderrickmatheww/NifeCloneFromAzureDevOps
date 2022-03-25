import * as Google from "expo-google-app-auth";
import {AndroidClientKey, ClientKey, IOSClientKey, IOSClientKeyStandAlone} from "react-native-dotenv";
import * as firebase from "firebase";
import {logger, alert} from "./Util";

export const googleLogin =  async () => {
    let dataObj = {};
    console.log('googleLogin hit!')
    try {
        let result = await Google.logInAsync({
            androidClientId: AndroidClientKey,
            iosClientId: IOSClientKey,
            clientId: ClientKey,
            androidStandaloneAppClientId: AndroidClientKey,
            iosStandaloneAppClientId: IOSClientKeyStandAlone
        });
        if (result.type === 'success') {
            /* `accessToken` is now valid and can be used to get data from the Google API with HTTP requests */
            const googleCredential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken);
            await firebase.auth().signInWithCredential(googleCredential)
                .catch((error) => {
                    logger("Google's login", false);
                    alert('Google Login Error', error.message, null);
                });
            dataObj['user'] = firebase.auth().currentUser;
            dataObj['data'] = firebase.auth();
            logger("Google's login", true);
            return dataObj
        } else {
            logger("Google's login canceled", false);
        }
    } catch ({message}) {
        logger("Google's login", false);
        alert('Google Login Error', message, null);
    }
}