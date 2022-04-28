import { initializeApp } from 'firebase/app';
import {
    getAuth, EmailAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

import {
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
} from 'react-native-dotenv';
import { alert, logger } from "./util";
import { updateUser } from "./api/users";

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
const storage = getStorage(Firebase);

export const firebaseSignUp = async ({email, password, displayName}) => {
    console.log(email, password)
    if (email && password) {
        try {
            let { type, accessToken, user, idToken }= await createUserWithEmailAndPassword(auth, email, password)
            logger("Nife's User sign-up", true);
            const {uid, phoneNumber, photoURL} = user
            const data = await updateUser({
                email,
                userUID: uid,
                phoneNumber,
                photoSource: photoURL,
                created: new Date(),
                lastModified: new Date(),
            });
            return data
        } catch ({message}) {
            logger("Nife's User sign-up", false);
            alert('Nife User Sign-Up Error', message, null);
        }
    }
}

export const fireBaseLogin = async (email, password)=> {
    if (email && password) {
        try {
            let { type, accessToken, user, idToken }= await signInWithEmailAndPassword(auth, email, password)
            logger("Nife's User sign-up", true);
            const {uid, phoneNumber, photoURL} = user
            const data = await updateUser({
                email,
                phoneNumber,
                lastModified: new Date(),
            });
            return data
        } catch ({message}) {
            logger("Nife's User sign-up", false);
            alert('Nife User Sign-Up Error', message, null);
        }
    }
}

export const firebaseStorageUpload = async (photoUri, email, photoKey) => {
    try {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                alert('API ERROR!', 'An Error occurred! Please restart!');
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', photoUri, true);
            xhr.send(null);
        });
        const storageRef = ref(storage, `${email}/${photoKey}`);
        const snapshot = await uploadBytes(storageRef, blob);
        const imageUrl = await snapshot.ref.getDownloadURL();
        return imageUrl;
    }
    catch ({ message }) {
        logger("Nife's Storage Upload", false);
        alert('Nife Storage Upload Error', message, null);
    }
}