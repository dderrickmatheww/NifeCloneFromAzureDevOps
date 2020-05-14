import React from 'react';
import { AsyncStorage } from 'react-native';

const FBPlaceData = async (boolean, returnData) => {
    let dataObj = {};
    let token, lat, long;
    await AsyncStorage.multiGet(['FBToken', 'userLocationData'], function(err, result){
        if (err) {
            console.log('Async Storage Error!');
        }
        else {
            token = result[0][1];
            lat = result[1][1].split(',')[0];
            long = result[1][1].split(',')[1];
            console.log('Grabbed user token, lat, and long from Async Storage!');
        }
    });

    try {
        // Get the Whats Poppin feed using Facebook's Graph API for user query
        if(boolean) {
            fetch('https://graph.facebook.com/search?type=place&q='+ query +'&center='+lat+','+long+'&distance=32186&fields=id,name,location,link,about,description,phone,restaurant_specialties,website&access_token='+ token)
            .then(response => response.json())
            .then(async data => {
                console.log(data)
                dataObj['data'] = data.data;
                //Grabs post from FB based on query
                returnData(dataObj);
            })
            .catch(e => console.log(e));
        } 
        // Get the Whats Poppin feed using Facebook's Graph API for default
        else {
            fetch('https://graph.facebook.com/search?type=place&q=bar&center='+lat+','+long+'&distance=32186&fields=id,name,location,link,about,description,phone,restaurant_specialties,website&access_token='+ token)
            .then(response => response.json())
            .then(async data => {
                console.log(data)
                dataObj['data'] = data.data;
                //Grabs post from FB based for default
                returnData(dataObj);
            })
            .catch(e => console.log(e));
        }
    } catch ({ message }) {
        alert(`Facebook Query Error: ${message}`);
    }
} 

export default FBPlaceData;