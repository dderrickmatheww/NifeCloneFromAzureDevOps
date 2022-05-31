import { client } from './client'
import { auth } from "../firebase";
import { alert, logger } from "../util";
import * as ImagePicker from 'expo-image-picker';
import { firebaseStorageUpload } from "../firebase";
import uuid from 'react-native-uuid';

export const updateUser = async (user) => {
    // TODO write getToken func
    const token = 'token'
    try {
        const {data} = await client.post('/updateUser', {
            user
        },{
            headers:{
                authorization: `Bearer ${token}`
            }
        });
        return data
    } catch (e) {
        console.log(e);
        alert('API ERROR!', 'An Error occurred! Please restart!')
        throw Error(e.message);
    }
}

export const getUser = async (email) => {
    // TODO send UUID instead of email
    const token = 'token'
    try {
        const {data} = await client.post('/getUser', {
            email
        },{
            headers:{
                authorization: `Bearer ${token}`
            }
        });
        return data
    } catch (e) {
        console.log(e);
        alert('API ERROR!', 'An Error occurred! Please restart!')
        throw Error(e.message);
    }
}

export const getUserById = async (userId) => {
    // TODO send UUID instead of email
    const token = 'token'
    try {
        const {data} = await client.post('/getUser', {
            userId
        },{
            headers:{
                authorization: `Bearer ${token}`
            }
        });
        return data
    } catch (e) {
        console.log(e);
        alert('API ERROR!', 'An Error occurred! Please restart!')
        throw Error(e.message);
    }
}

export const updateOrDeleteFavorites = async (user, business, businessName,isAdding, id) => {
    // if not adding, add id to update obj
    console.log('updateOrDeleteFavorites')
    let update = {
        user, business, isAdding, businessName
    }
    if(!isAdding){
        update = {...update, id}
    }
    const token = 'token'
    try {
        const {data} = await client.post('/updateOrDeleteFavorites', {
            ...update
        },{
            headers:{
                authorization: `Bearer ${token}`
            }
        });
        return data
    } catch (e) {
        console.log(e);
        alert('API ERROR!', 'An Error occurred! Please restart!')
        throw Error(e.message);
    }
}

export const createCheckIn = async (user, business, isPrivate, businessName) => {
    // if not adding, add id to update obj
    console.log('createCheckIn')
    const token = 'token'
    try {
        const {data} = await client.post('/createCheckIn', {
            user, business, isPrivate, businessName
        },{
            headers:{
                authorization: `Bearer ${token}`
            }
        });
        return data
    } catch (e) {
        console.log(e);
        alert('API ERROR!', 'An Error occurred! Please restart!')
        throw Error(e.message);
    }
}

export const deleteCheckIn = async (id) => {
    // if not adding, add id to update obj
    console.log('deleteCheckIn')
    const token = 'token'
    try {
        const {data} = await client.post('/deleteCheckIn', {
            id
        },{
            headers:{
                authorization: `Bearer ${token}`
            }
        });
        return data
    } catch (e) {
        console.log(e);
        alert('API ERROR!', 'An Error occurred! Please restart!')
        throw Error(e.message);
    }
}


export const uploadImage = async () => {
    try {
        await ImagePicker.requestMediaLibraryPermissionsAsync()
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
        console.log(status)
        if (status === "granted") {
            const { uri } = await ImagePicker.launchImageLibraryAsync();
            console.log(uri + " get");
            return await firebaseStorageUpload(uri, uuid.v4());
        }
        else {
            return false;
        }
    }
    catch ({ message }) {
        logger("Nife's Photo Upload", false);
        alert('Nife Photo Upload Error', message, null);
    }
}