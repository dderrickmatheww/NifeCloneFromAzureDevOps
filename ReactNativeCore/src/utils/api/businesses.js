import {client} from './client'
import {auth} from "../firebase";
import {alert} from "../util";

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
