import React from 'react';
import Util from '../../../scripts/Util';
//Intialize Facebook Login

export default async function getFeedData (query, returnData) {
    if(query) {
        Util.dataCalls.Facebook.placeData(true, query, (dataObj) => {
            // Util.dataCalls.Twitter.tweetData(dataObj, (combinedDataObj) => {
            //     returnData(combinedDataObj);
            // });
            returnData(dataObj);
        });
    }
    else {
        Util.dataCalls.Facebook.placeData(false, null, (dataObj) => {
            // Util.dataCalls.Twitter.tweetData(dataObj, (combinedDataObj) => {
            //     returnData(combinedDataObj);
            // });
            returnData(dataObj);
        });
    }
} 