import { client } from './client';
import { auth } from "../firebase";
import { alert } from "../util";

export const createFriendRequest = async ({ userId, friendId }) => {
    const token = 'token'
    try {
        const {data} = await client.post('/createFriendRequest', {
            userId, 
            friendId
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
};

export const acceptFriendRequest = async ({ userId, friendId }) => {
    try {
        const { data } = await client.post('/acceptFriendRequest', {
            userId, 
            friendId
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
};

export const rejectFriendRequest = async ({ userId, friendId }) => {
    try {
        const { data } = await client.post('/rejectFriendRequest', {
            userId, 
            friendId
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
};

export const cancelFriendRequest = async ({ userId, friendId }) => {
    try {
        const { data } = await client.post('/cancelFriendRequest', {
            userId, 
            friendId
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
};

export const getUserSentFriendRequests = async ({ userId }) => {
    try {
        const { data } = await client.post('/getUserSentFriendRequests', {
            userId
        },{
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

export const getUserSentFriendRequestsPaginated = async ({ userId, skip, take }) => {
    try {
        const { data } = await client.post('/getUserSentFriendRequestsPaginated', {
            userId, 
            skip,
            take
        },{
            headers:{
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

export const getUserPendingFriendRequests = async ({ userId }) => {
    try {
        const { data } = await client.post('/getUserPendingFriendRequests', {
            userId
        },{
            headers:{
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

export const getUserPendingFriendRequestsPaginated = async ({ userId, skip, take }) => {
    try {
        const { data } = await client.post('/getUserPendingFriendRequests', {
            userId, 
            skip,
            take
        },{
            headers:{
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
