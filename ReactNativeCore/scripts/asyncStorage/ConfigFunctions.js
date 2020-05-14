import React from 'react';
import { AsyncStorage } from 'react-native';
const Config = {
    SetAsyncStorageVar: async (name, value) => {
        await AsyncStorage.getItem(name, async function(err, result){
            if (!result) {
                console.log('No previous varible!');
                await AsyncStorage.setItem(name, value, function(err){
                    if (err) {
                        console.log('Async Setting Storage Error');
                    }
                    else {
                        console.log('Set varible!');
                    }
                });
            }
            else {
                console.log('Previous version of varible found!');
                await AsyncStorage.removeItem(name, async function(err){
                    if (err) {
                        console.log(err + ' Async Removing Storage Error');
                    }
                    else {
                        console.log('Removed previous version of varible!');
                        await AsyncStorage.setItem(name, value, function(err){
                            if (err) {
                                console.log(err + 'Async Setting Storage Error');
                            }
                            else {
                                console.log('Set new version of varible!');
                            }
                        });
                    }
                });
            }
        });
    }
} 
export default Config;