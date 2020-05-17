import React from 'react';
import { AsyncStorage } from 'react-native';
import { TabRouter } from '@react-navigation/native';


const Config = {
    SetAsyncStorageVar: async (name, value) => {
        await AsyncStorage.getItem(name, async function(err, result){
            if(err) {
                console.log('Async Getting Storage Error: ' + err);
            }
            else {
                if (!result) {
                    console.log('No previous varible!');
                    await AsyncStorage.setItem(name, value, function(err){
                        if (err) {
                            console.log('Async Setting Storage Error: ' + err);
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
                            console.log('Async Removing Storage Error: ' + err);
                        }
                        else {
                            console.log('Removed previous version of varible!');
                            await AsyncStorage.setItem(name, value, function(err){
                                if (err) {
                                    console.log('Async Setting Storage Error: ' + err);
                                }
                                else {
                                    console.log('Set new version of varible!');
                                }
                            });
                        }
                    });
                }
            }
        });
    },
    IsAsyncVariableSet: async (name) => {
        await AsyncStorage.getItem(name, async function(err, result){ 
            if (err) {
                console.log('Async Getting Storage Error: ' + err);
            }
            else {
                if(result) {
                    console.log('Found Async Variable: ' + name);
                    return true;
                }
                else {
                    console.log('Did not find Async Variable: ' + name);
                    return false;
                }
            }
        })
    }
} 

export default Config;