import Constants from 'expo-constants';
const axios = require('axios');

const { 
    CLOUD_FUNCTIONS_BASE_URL
 } = Constants.manifest.extra.google;

 console.log('client', CLOUD_FUNCTIONS_BASE_URL)
export const client = axios.create({
    baseURL: CLOUD_FUNCTIONS_BASE_URL
});

console.log('client', client)