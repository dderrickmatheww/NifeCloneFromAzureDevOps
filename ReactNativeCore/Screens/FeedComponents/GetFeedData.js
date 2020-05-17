import React from 'react';
import * as Facebook from 'expo-facebook';
import { FACEBOOK_APP_ID } from 'react-native-dotenv';
import FBPlaceData from './APICalls/FBPlaceData';
import TwitterTweetData from './APICalls/TwitterTweetData';
//Intialize Facebook Login
const BUNDLE_ID = 'com.reactnativecore';

export default async function getFeedData (provider, query, returnData) {
    if(query) {
        await Facebook.initializeAsync(FACEBOOK_APP_ID, BUNDLE_ID);
        FBPlaceData(true, query, (dataObj) => {
            TwitterTweetData(dataObj, (combinedDataObj) => {
                returnData(combinedDataObj);
            });
        });
    }
    else {
        await Facebook.initializeAsync(FACEBOOK_APP_ID, BUNDLE_ID);
        FBPlaceData(false, null, (dataObj) => {
            TwitterTweetData(dataObj, (combinedDataObj) => {
                returnData(combinedDataObj);
            });
        });
    }
} 