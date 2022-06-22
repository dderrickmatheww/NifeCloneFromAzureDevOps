import { client } from './client'
import { auth } from "../firebase";
import { alert } from "../util";

export const getUserFriendById = async ({ userId, friendId }) => {
     // TODO write getToken func
     try {
         const token = 'token';
         const { data } = await client.post('/getUserFriendById', {
            userId,
            friendId
         }, 
         {
             headers: {
                 authorization: `Bearer ${token}`
             }
         });
         return data;
     } catch (e) {
         console.log(e);
         alert('API ERROR!', 'An Error occurred! Please restart!')
         throw Error(e.message);
     }
};

export const getUserFriends = async ({ userId }) => {
    try {
        const token = 'token';
        const { data } = await client.post('/getUserFriends', {
            userId
        }, {
                headers: {
                    authorization: `Bearer ${token}`
                }
        });
        return data;
    } catch (e) {
        console.log(e);
        alert('API ERROR!', 'An Error occurred! Please restart!')
        throw Error(e.message);
    }
};

export const getUserFriendsPaginated = async ({ userId, skip, take }) => {
    try {
        const token = 'token';
        const { data } = await client.post('/getUserFriendsPaginated', {
            userId,
            skip,
            take
        }, 
        {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (e) {
        console.log(e);
        alert('API ERROR!', 'An Error occurred! Please restart!')
        throw Error(e.message);
    }
};

export const deleteUserFriendship = async ({ userId, friendId }) => {
    try {
        const token = 'token';
        const { data } = await client.post('/deleteUserFriendship', {
            userId,
            friendId
        }, 
        {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (e) {
        console.log(e);
        alert('API ERROR!', 'An Error occurred! Please restart!')
        throw Error(e.message);
    }
};