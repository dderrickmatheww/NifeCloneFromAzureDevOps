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
