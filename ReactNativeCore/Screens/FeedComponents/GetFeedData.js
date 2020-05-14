import React from 'react';
import * as Facebook from 'expo-facebook';
import { FACEBOOK_APP_ID } from 'react-native-dotenv';
import FBPlaceData from './APICalls/FBPlaceData';
import * as firebase from 'firebase';
//Intialize Facebook Login
const BUNDLE_ID = 'com.reactnativecore';

export default async function getFeedData (provider, query, returnData) {
    
    if(query) {
        if(provider == 'facebook.com') {
            await Facebook.initializeAsync(FACEBOOK_APP_ID, BUNDLE_ID);
            FBPlaceData(true, (dataObj) => {
                returnData(dataObj);
            });
        }
    }
    else {
        if(provider == 'facebook.com') {
            await Facebook.initializeAsync(FACEBOOK_APP_ID, BUNDLE_ID);
            FBPlaceData(false, (dataObj) => {
                returnData(dataObj);
            });
        }
    }
} 