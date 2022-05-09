import { client } from './client'
import { auth } from "../firebase";
import { alert } from "../util";

export const getWhatsPoppinFeed = async (latitude, longitude) => {
    // TODO write getToken func
    const token = 'token'
    try {
        const { data } = await client.post('/getWhatsPoppinFeed', {
            latitude,
            longitude
        },{
            headers:{
                authorization: `Bearer ${token}`
            }
        });
        console.log(data);
        return data
    } catch (e) {
        console.log(e);
        alert('API ERROR!', 'An Error occurred! Please restart!')
        throw Error(e.message);
    }
}