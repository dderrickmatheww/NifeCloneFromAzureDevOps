import Constants from 'expo-constants';
const axios = require('axios');

const { 
    CLOUD_FUNCTIONS_BASE_URL
 } = Constants.manifest.extra.google;

export const client = axios.create({
    baseURL: CLOUD_FUNCTIONS_BASE_URL
});