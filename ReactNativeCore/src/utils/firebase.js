import {initializeApp} from 'firebase/app';
import {createUserWithEmailAndPassword, EmailAuthProvider, getAuth, signInWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';

import {
    apiKey,
    appId,
    authDomain,
    databaseURL,
    measurementId,
    messagingSenderId,
    projectId,
    storageBucket,
} from 'react-native-dotenv';
import {alert, logger} from "./util";
import {updateUser} from "./api/users";

export const emailProvider = new EmailAuthProvider();

export const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    databaseURL: databaseURL,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId
};


const Firebase = initializeApp(firebaseConfig)

export default Firebase;
export const auth = getAuth(Firebase);
export const db = getFirestore(Firebase);
export const storage = getStorage(Firebase);

export const firebaseSignUp = async ({email, password, displayName}) => {
    console.log(email, password, displayName)
    if (email && password) {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(auth.currentUser, {displayName})
            const lowerEmail = email.toLowerCase()
            await updateUser({email: lowerEmail, displayName})
            logger("Nife's User sign-up", true);
        } catch ({message}) {
            logger("Nife's User sign-up", false);
            alert('Nife User Sign-Up Error', message, null);
        }
    }
}

export const fireBaseLogin = async (email, password)=> {
    if (email && password) {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            logger("Nife's User Login", true);

        } catch ({message}) {
            logger("Nife's User Login", false);
            alert('Nife User Login Error', message, null);
        }
    }
}

export const firebaseStorageUpload = async (uri, photoKey) => {
    try {
        const blob = await new Promise((resolve, reject) => {
            try {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    alert('API ERROR!', 'An Error occurred! Please restart!');
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            }
            catch ({ message }) {
                logger("Nife's Storage Upload", false);
                alert('Nife Storage Upload Error', message, null);
            }
        });
        const storageRef = ref(storage, photoKey);
        await uploadBytes(storageRef, blob);
        blob.close();
        return await getDownloadURL(storageRef);
    }
    catch ({ message }) {
        logger("Nife's Storage Upload", false);
        alert('Nife Storage Upload Error', message, null);
    }
}