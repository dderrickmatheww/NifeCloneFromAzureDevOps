import {client} from './client'
import {alert} from "../util";

export const getBusinessesNearby = async ({latitude, longitude}) => {
    // TODO write getToken func
    const token = 'token'
    try {
        const {data} = await client.post('/getBusinessesNearby', {
            latitude, longitude
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

export const getBusinessesByPhoneNumber = async ({ phoneNumber }) => {
    // TODO write getToken func
    const token = 'token'
    try {
        const {data} = await client.post('/getBusinessesByPhoneNumber', {
            phoneNumber
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
