import React from 'react';
import { AsyncStorage } from 'react-native';


export default SetUserLocationData = async (region) => {
    console.log(region)
    var latAndLong = region.latitude + ',' + region.longitude
    await AsyncStorage.getItem('userLocationData', async function(err, result){
        if (!result) {
            await AsyncStorage.setItem('userLocationData', latAndLong, function(err){
                if (err) {
                    console.log('Async Setting Storage Error');
                }
                else {
                    console.log('Set user location!');
                }
            });
        }
        else {
            await AsyncStorage.removeItem('userLocationData', async function(err){
                if (err) {
                    console.log(err + ' Async Removing Storage Error');
                }
                else {
                    console.log('Removed User Location!');
                    await AsyncStorage.setItem('userLocationData', latAndLong, function(err){
                        if (err) {
                            console.log(err + 'Async Setting Storage Error');
                        }
                        else {
                            console.log('Set user location!');
                        }
                    });
                }
            });
        }
    });
}
