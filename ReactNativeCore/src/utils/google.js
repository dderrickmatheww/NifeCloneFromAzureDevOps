import * as Google from "expo-google-app-auth";
import {AndroidClientKey, ClientKey, IOSClientKey, IOSClientKeyStandAlone} from "react-native-dotenv";
import {
    signInWithCredential,
    GoogleAuthProvider
} from 'firebase/auth';
import {logger, alert} from "./Util";
import {updateUser} from "./api/users";
import {auth} from "./firebase";

export const googleLogin =  async () => {
    console.log('googleLogin hit!')
    try {
        let { type, accessToken, user, idToken } = await Google.logInAsync({
            androidClientId: AndroidClientKey,
            iosClientId: IOSClientKey,
            clientId: ClientKey,
            androidStandaloneAppClientId: AndroidClientKey,
            iosStandaloneAppClientId: IOSClientKeyStandAlone
        });
        if (type === 'success') {
            /* `accessToken` is now valid and can be used to get data from the Google API with HTTP requests */
            const googleCredential = GoogleAuthProvider.credential(idToken, accessToken);
            await signInWithCredential(auth, googleCredential)
            const {email, phoneNumber, uid} = user;
            await updateUser({
                email,
                phoneNumber,
                lastModified: new Date(),
                userUid: uid
            });
            return user;
        } else {
            logger("Google's login canceled", false);
        }
    } catch ({message}) {
        logger("Google's login", false);
        alert('Google Login Error', message, null);
    }
}