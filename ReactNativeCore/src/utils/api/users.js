import {client} from './client'
import {auth} from "../firebase";
import {alert} from "../Util";

export const updateUser = async (user) => {
    // TODO write getToken func
    const token = 'token'
    console.log(client);
    try {
        console.log('updateUser fired!')
        return await client.post('/updateUser', {
            user
        },{
            headers:{
                authorization: `Bearer ${token}`
            }
        })
    } catch (e) {
        console.log(e);
        alert('API ERROR!', 'An Error occurred! Please restart!')
        throw Error(e.message);
    }
}
