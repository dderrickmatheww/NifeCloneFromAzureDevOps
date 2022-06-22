import * as Google from "expo-google-app-auth";
import {
    signInWithCredential,
    GoogleAuthProvider
} from 'firebase/auth';
import Constants from 'expo-constants';
import { logger, alert } from "./util";
import { getUser, updateUser } from "./api/users";
import { auth } from "./firebase";
const { ios, andriod } = Constants.manifest.extra.google.oauth;
const { IOS_CLIENT_ID, IOS_STANDALONE_CLIENT_ID } = ios;
const { ANDROID_CLIENT_ID, ANDRIOD_STANDALONE_CLIENT_ID } = andriod;

export const googleLogin =  async () => {
    console.log('googleLogin hit!')
    try {
        let { type, accessToken, user, idToken } = await Google.logInAsync({
            androidClientId: ANDROID_CLIENT_ID,
            iosClientId: IOS_CLIENT_ID,
            androidStandaloneAppClientId: ANDRIOD_STANDALONE_CLIENT_ID,
            iosStandaloneAppClientId: IOS_STANDALONE_CLIENT_ID
        });
        if (type === 'success') {
            /* `accessToken` is now valid and can be used to get data from the Google API with HTTP requests */
            const googleCredential = GoogleAuthProvider.credential(idToken, accessToken);
            await signInWithCredential(auth, googleCredential)
            const {email, phoneNumber, uid, name, photoUrl} = user;
            const userExists = await getUser(email);
            if(userExists) {
                return await updateUser({
                    email,
                    phoneNumber,
                    lastModified: new Date(),
                    uuid: uid
                });
            } else {
                return await updateUser({
                    email,
                    phoneNumber,
                    lastModified: new Date(),
                    uuid: uid,
                    displayName: name,
                    photoSource: photoUrl
                });
            }
        } else {
            logger("Google's login canceled", false);
        }
    } catch ({message}) {
        logger("Google's login", false);
        alert('Google Login Error', message, null);
    }
}