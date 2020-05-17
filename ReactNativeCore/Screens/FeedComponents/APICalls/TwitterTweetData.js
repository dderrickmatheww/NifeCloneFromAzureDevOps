import React from 'react';
import { AsyncStorage } from 'react-native';

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
            fetch('https://api.twitter.com/1.1/search/tweets.json?q='+ dataObj.data[i].name +'&geocode='+lat+','+long+',20mi&result_type=recent&count=5')
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