import {client} from './client'
import {auth} from "../firebase";
import {alert} from "../util";

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


export const updateOrDeleteFavorites = async (user, business, isAdding, id) => {
    // if not adding, add id to update obj
    console.log('updateOrDeleteFavorites')
    let update = {
        user, business, isAdding
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

export const createCheckIn = async (user, business, isPrivate) => {
    // if not adding, add id to update obj
    console.log('createCheckIn')
    const token = 'token'
    try {
        const {data} = await client.post('/createCheckIn', {
            user, business, isPrivate
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
