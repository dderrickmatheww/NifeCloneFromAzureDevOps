import { client } from './client'
import { auth } from "../firebase";
import { alert } from "../util";

export const getBusiness = async (uuid) => {
    // TODO write getToken func
    const token = 'token'
    try {
        const {data} = await client.post('/getBusiness', {
            uuid
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

export const updateBusiness = async (business) => {
    // TODO write getToken func
    const token = 'token'
    try {
        const {data} = await client.post('/updateBusiness', {
            business
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

export const searchBusinesses = async (latitude, longitude, search) => {
    // TODO write getToken func
    const token = 'token'
    try {
        const {data} = await client.post('/searchBusinesses', {
            latitude, longitude, search
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

export const getBusinessCheckIns = async (uuid) => {
    // TODO write getToken func
    const token = 'token'
    try {
        const {data} = await client.post('/getBusinessCheckIns', {
            uuid
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

export const getFriendCheckIns = async ( friends) => {
    // TODO write getToken func
    const token = 'token'
    try {
        const {data} = await client.post('/getFriendCheckIns', {
            friends
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

export const getNifeBusinessesByState = async (state) => {
    // TODO write getToken func
    const token = 'token'
    try {
        const {data} = await client.post('/getNifeBusinessesByState', {
            state
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
