import { client } from './client'
import { auth } from "../firebase";
import { alert } from "../util";
import * as ImagePicker from 'expo-image-picker';
import { firebaseStorageUpload } from "../../utils/firebase";

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


export const updateOrDeleteFavorites = async (user, business, isAdding, id) => {
    // TODO write getToken func
    const token = 'token'
    try {
        const {data} = await client.post('/updateOrDeleteFavorites', {
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


export const uploadImage = async (email) => {
    try {
        const [status, requestPermission] = await ImagePicker.useMediaLibraryPermissions()
        if (status == "granted") {
            const image = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            })
            const photoUri = image.uri;
            const imageUrl = await firebaseStorageUpload(photoUri, email, photoUri);
            return imageUrl;
        } 
        else {
            this.setState({
                isVerified: false
            });
        }
    }
    catch ({ message }) {
        logger("Nife's Photo Upload", false);
        alert('Nife Photo Upload Error', message, null);
    }
}