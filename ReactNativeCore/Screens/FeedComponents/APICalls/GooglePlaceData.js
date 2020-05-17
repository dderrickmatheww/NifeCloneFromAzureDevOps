import React from 'react';
import { AsyncStorage } from 'react-native';
import { GOOGLE_API_KEY } from 'react-native-dotenv';

const GooglePlaceData = async (boolean, query, returnData) => {
    let dataObj = {};
    let token, lat, long;
    try {
        // Get the Whats Poppin feed using Google's Map API for user query
        if(boolean) {
            fetch("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input="+ query +"&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=" + GOOGLE_API_KEY)
            .then(response => response.json())
            .then(async data => {
                dataObj['data'] = data.data;
                //Grabs post from Google based on query
                returnData(dataObj);
            })
            .catch(e => console.log(e));
        } 
        // Get the Whats Poppin feed using Google's Map API for default
        else {
            fetch("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=bar&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=" + GOOGLE_API_KEY)
            .then(response => response.json())
            .then(async data => {
                dataObj['data'] = data.data;
                //Grabs post from Google based for default
                returnData(dataObj);
            })
            .catch(e => console.log(e));
        }
    } catch ({ message }) {
        alert(`Facebook Query Error: ${message}`);
    }
} 

export default GooglePlaceData;