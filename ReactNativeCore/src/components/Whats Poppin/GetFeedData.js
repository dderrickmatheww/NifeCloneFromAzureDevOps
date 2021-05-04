import React from 'react';
import Util from '../../scripts/Util';
//Intialize Facebook Login

export default async function getFeedData (query, email, returnData) {
    if(query) {
        Util.location.GrabWhatsPoppinFeed(query, email, (dataObj) => {
            returnData(dataObj);
        });
    }
    else {
        Util.location.GrabWhatsPoppinFeed(null, email, (checkInArr) => {
            returnData(checkInArr);
        });
    }
} 