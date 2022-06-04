import {initializeApp} from 'firebase/app';
import {createUserWithEmailAndPassword, EmailAuthProvider, getAuth, signInWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import reactUuid from 'react-native-uuid';

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
import {updateBusiness} from "./api/businesses";

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

export const firebaseSignUp = async ({ 
    email, 
    password, 
    displayName, 
    businessName, 
    street, city, 
    state, 
    phoneNumber, 
    zip, 
    proofOfAddress, 
    uuid, 
    verified 
}) => {
    if (email && password) {
        try {
            const lowerEmail = email.toLowerCase();
            await createUserWithEmailAndPassword(auth, lowerEmail, password);
            await updateProfile(auth.currentUser, { displayName });
            let businessData = [];
            let userData = await updateUser({ 
                email: lowerEmail, 
                displayName,
                created: new Date(),
                lastLogin: new Date() 
            });
            if (businessName) {
                proofOfAddress = await firebaseStorageUpload(proofOfAddress, reactUuid.v4());
                businessData = await updateBusiness({ 
                    email, 
                    displayName: businessName, 
                    ownerName: displayName, 
                    street, 
                    city, 
                    state, 
                    phoneNumber, 
                    zip, 
                    proofOfAddress, 
                    userId: initialUser.id,
                    created: new Date(),
                    lastLogin: new Date(),
                    uuid,
                    verified
                });
                userData = await updateUser({ 
                    email: lowerEmail, 
                    displayName: businessName,
                    businessId: business.businessId, 
                    businessUID: uuid,  
                    lastModified: new Date()
                });
            }
            logger("Nife's User sign-up", true);
            return { businessData, userData }
        } catch ({ message }) {
            logger("Nife's User sign-up", false);
            alert('Nife User Sign-Up Error', message, null);
        }
    }
}

export const fireBaseLogin = async (email, password)=> {
    if (email && password) {
        try {
            const lowerEmail = email.toLowerCase();
            let businessData = [];
            await signInWithEmailAndPassword(auth, lowerEmail, password);
            const userData = await updateUser({ 
                email: lowerEmail, 
                lastModified: new Date(),
                lastLogin: new Date()
            });
            if (userData.businessUID) {
                businessData = await updateBusiness({ 
                    lastModified: new Date(),
                    lastLogin: new Date(),
                    uuid: userData.businessUID
                });
            }
            logger("Nife's User Login", true);
            return { userData, businessData };
        } catch ({ message }) {
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