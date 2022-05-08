import { client } from './client'
import { auth } from "../firebase";
import { alert } from "../util";

export const updatePostById = async (postId) => {
    // TODO write getToken func
    const token = 'token'
    try {
        const { data } = await client.post('/updatePostById', {
            postId
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

export const getPosts = async (userId) => {
    // TODO write getToken func
    const token = 'token'
    try {
        const { data }  = await client.post('/getPosts', {
            userId
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

export const getPostsPaginated = async (postObj) => {
    // TODO write getToken func
    const token = 'token'
    try {
        const { data } = await client.post('/getPostsPaginated', postObj, {
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

export const getPostsById = async (postId) => {
    // TODO write getToken func
    const token = 'token'
    try {
        const { data } = await client.post('/getPosts', {
            postId
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

export const deletePostsById = async (postId) => {
    // TODO write getToken func
    const token = 'token'
    try {
        const { data } = await client.post('/getPosts', {
            postId
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

export const createPost = async (description, type, image, businessId, latitude, longitude, userId) => {
    // TODO write getToken func
    const token = 'token'
    try {
        const { data } = await client.post('/createPost', {
            description,
            type,
            image,
            businessId,
            latitude,
            longitude,
            userId,
            created: new Date()
        }, {
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