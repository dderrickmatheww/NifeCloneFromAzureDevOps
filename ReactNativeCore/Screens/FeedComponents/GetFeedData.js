import React from 'react';
import * as Facebook from 'expo-facebook';
import { AsyncStorage  } from 'react-native';
import { FACEBOOK_APP_ID } from 'react-native-dotenv';
import * as firebase from 'firebase';
import UserLocationObject from './UserLocationData';
//Intialize Facebook Login
const BUNDLE_ID = 'com.reactnativecore';

export default async function getFeedData (token, provider, query, callBack) {
    if(query) {
        if(provider == 'facebook.com') {
            let dataObj = {};
            await Facebook.initializeAsync(FACEBOOK_APP_ID, BUNDLE_ID);
            token = await AsyncStorage.getItem('FBToken');
            try {
                // Get the user's name using Facebook's Graph API
                fetch('https://graph.facebook.com/search?type=place&q='+ query +'&fields=id,name,location,link,about,description,phone,restaurant_specialties,website&access_token='+ token)
                .then(response => response.json())
                .then(async data => {
                    dataObj['data'] = data;
                    callBack(dataObj);
                })
                .catch(e => console.log(e))
            } catch ({ message }) {
                alert(`Facebook Login Error: ${message}`);
            }
        }
    }
    else {
        if(provider == 'facebook.com') {
            let dataObj = {};
            await Facebook.initializeAsync(FACEBOOK_APP_ID, BUNDLE_ID);
            try {
                // Get the user's name using Facebook's Graph API
                fetch('https://graph.facebook.com/search?type=place&q=bars&fields=id,name,location,link,about,description,phone,restaurant_specialties,website&access_token='+ token)
                .then(response => response.json())
                .then(async data => {
                    dataObj['data'] = data;
                    callBack(dataObj);
                })
                .catch(e => console.log(e))
            } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
            }
        }
    }
} 