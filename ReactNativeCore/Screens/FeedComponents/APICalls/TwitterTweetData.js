import React from 'react';
import { AsyncStorage } from 'react-native';
import { TWITTER_CONSUMER_API_KEY, TWITTER_CONSUMER_SECERT_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET } from 'react-native-dotenv';
import * as Crypto from 'expo-crypto';

const TwitterTweetData = async (dataObj, returnData) => {
    let tweetData = [];
    let lat, long;
    await AsyncStorage.getItem('userLocationData', async function(err, result){ 
        if(err) {
            console.log('Async Get userLocaitonData Error: ' + err);
        }
        else {
            console.log('Grabbed user location from Async Storage!')
            lat = result.split(',')[0];
            long = result.split(',')[1];
        }
    });
    for(i = 0; i < dataObj.data.length; i++) {
        try {
            fetch('https://api.twitter.com/1.1/search/tweets.json?q='+ dataObj.data[i].name +'&geocode='+lat+','+long+',20mi&result_type=recent&count=5', {
                headers: 'authorization: \
                OAuth oauth_consumer_key="'+ TWITTER_CONSUMER_API_KEY +'", \
                oauth_nonce="'+ Crypto.randomBytes(32).toString('hex') +'", \
                oauth_signature="'+ Crypto.randomBytes(32).toString('hex') +'", \
                oauth_signature_method="HMAC-SHA1", \
                oauth_timestamp="'+ Math.floor(new Date().getTime() / 1000)+'", \
                oauth_token="'+TWITTER_ACCESS_TOKEN+'", \
                oauth_version="1.0"'
            })
            .then(response => response.json())
            .then(async data => {
                console.log(data)
                // dataObj['data'] = data.data;
                // //Grabs post from FB based for default
                // returnData(dataObj);
            })
            .catch(e => console.log(e)); 
        } catch ({ message }) {
            alert(`Twitter Query Error: ${message}`);
        }
    }
} 

export default TwitterTweetData;