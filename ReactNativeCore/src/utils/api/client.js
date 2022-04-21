const axios = require('axios');

import {
    CLOUD_FUNCTIONS_BASE_URL,
} from 'react-native-dotenv';

export const client = axios.create({
    baseURL: CLOUD_FUNCTIONS_BASE_URL
})

console.log('client', client)