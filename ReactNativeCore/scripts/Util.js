import { GetFriends, AddFriend } from "./friends/FriendsUtil";
import { AsyncStorage } from 'react-native';
import { VerifyUser, GetUserData, UpdateUser } from "./user/UserUtil";
import { SaveLocation } from "./location/LocationUtil";
import { FACEBOOK_APP_ID, GOOGLE_API_KEY, TWITTER_CONSUMER_API_KEY, TWITTER_ACCESS_TOKEN, ClientKey, BUNDLE_ID, AndroidClientKey, IOSClientKey, apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId, measurementId } from 'react-native-dotenv';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';

const Util = {
    friends: {
        GetFriends: function(db, email, callback){
            GetFriends(db, email, callback)
        },
        AddFriend: function(db, email, callback){
            AddFriend(db, email, callback)
        }
    },
    user: {
        VerifyUser: function(db, user, email, callback){
            VerifyUser(db, user, email, callback);
        },
        GetUserData: function(db, email, callback){
            GetUserData(db, email, callback)
        },
        UpdateUser: function(db, email, updateObject, callback){
            UpdateUser(db, email, updateObject, callback)
        }
    },
    location: {
        SaveLocation: function(db, email, location, callback){
            SaveLocation(db, email, location, callback);
        },
        SetUserLocationData: function (region) {
            var latAndLong = region.latitude + ',' + region.longitude;
            Util.asyncStorage.SetAsyncStorageVar('userLocationData', latAndLong);
        }
    },
    asyncStorage: {
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
        },
        MultiGetAsyncVar: async (arrayOfNames, callback) => {
            let returnArray = [];
            await AsyncStorage.multiGet(arrayOfNames, (err, result) => {
                if (err) {
                    console.log('Async Multiget Storage Error: ' + err);
                }
                else {
                    console.log('Grabbed all items from Async Storage!');
                    returnArray.push(result);
                }
            });
            if (returnArray.length > 0) {
                callback(returnArray[0]);
            }
        },
        GetAsyncVar: async (name, callback) => {
            await AsyncStorage.getItem(name, async (err, result) => { 
                if(err) {
                    console.log('Async Error getting variable ' + name + ' ' + err);
                }
                if(result) {
                    callback(result);
                    console.log('Grabbed Async variable: ' + name + ' from Async Storage!');
                }
            });
        }
    },
    dataCalls: {
        Facebook: {
            placeData: async (boolean, query, returnData) => {
                let dataObj = {};
                let token, lat, long;
                if (Util.asyncStorage.IsAsyncVariableSet('FBToken')) {
                    let varibleArray = ['FBToken', 'userLocationData'];
                    await Util.asyncStorage.MultiGetAsyncVar(varibleArray, (result) => {
                        token = result[0][1];
                        lat = result[1][1].split(',')[0];
                        long = result[1][1].split(',')[1];
                    });
                } 
                else {
                    token = FACEBOOK_APP_ID;
                    Util.asyncStorage.GetAsyncVar('userLocationData', (result) => {
                        lat = result.split(',')[0];
                        long = result.split(',')[1];
                    });
                }
                try {
                    // Get the Whats Poppin feed using Facebook's Graph API for user query
                    if(boolean) {
                        fetch('https://graph.facebook.com/search?type=place&q='+ query +'&center='+lat+','+long+'&distance=32186&fields=id,name,location,link,about,description,phone,restaurant_specialties,website&access_token='+ token)
                        .then(response => response.json())
                        .then(async data => {
                            dataObj['data'] = data.data;
                            console.log(dataObj.data);
                            //Grabs post from FB based for user query
                            returnData(dataObj);
                        })
                        .catch(e => console.log(e));
                    } 
                    // Get the Whats Poppin feed using Facebook's Graph API for default
                    else {
                        fetch('https://graph.facebook.com/search?type=place&q=bar&center='+lat+','+long+'&distance=32186&fields=id,name,location,link,about,description,phone,restaurant_specialties,website&access_token='+ token)
                        .then(response => response.json())
                        .then(async data => {
                            dataObj['data'] = data.data;
                            console.log(dataObj.data);
                            //Grabs post from FB based for default
                            returnData(dataObj);
                        })
                        .catch(e => console.log(e));
                    }
                } catch ({ message }) {
                    alert(`Facebook Query Error: ${message}`);
                }
            },
            postData: async (dataObj, token, returnData) => {
                console.log(dataObj);
                await Facebook.initializeAsync(FACEBOOK_APP_ID, BUNDLE_ID);
                try {
                    // Get the user's name using Facebook's Graph API
                    fetch('https://graph.facebook.com/v7.0/' + dataObj.page.id + '/posts?&access_token='+ token)
                    .then(response => response.json())
                    .then(async data => {
                        dataObj['PostData'] = data;
                        returnData(dataObj);
                    })
                    .catch(e => console.log(e));
                } catch ({ message }) {
                    alert(`Facebook Query Error: ${message}`);
                }
            },
            login: async (callBack) => {
                let dataObj = {};
                // Listen for authentication state to change.
                await Facebook.initializeAsync(FACEBOOK_APP_ID, BUNDLE_ID);
                try {
                  const {
                    type,
                    token,
                    expires,
                    permissions,
                    declinedPermissions,
                  } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
                    permissions: ['public_profile'],
                  });
                  if (type === 'success') {
                    // Get the user's name using Facebook's Graph API
                    fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`)
                      .then(response => response.json())
                      .then(async data => {
                        const credential = firebase.auth.FacebookAuthProvider.credential(token);
                        await firebase.auth().signInWithCredential(credential).catch((error) => { console.log('Firebase Facebook Auth Error: ' + error); });
                        dataObj['data'] = firebase.auth().currentUser;
                        Util.asyncStorage.SetAsyncStorageVar('FBToken', token);
                        callBack(dataObj);
                      })
                      .catch((error) => {
                        console.log("Firebase Google Auth Error: ");
                        console.log("Error Code: " + error.code);
                        console.log("Error Message: " + error.message);
                        console.log("Error Email: " + error.email);
                        console.log("Error Creds: " + error.credential);
                    });
                  } else {
                    // type === 'cancel'
                  }
                } catch ({ message }) {
                  alert(`Facebook Login Error: ${message}`);
                }
            }
        },
        Twitter: {
            tweetData: async (dataObj, returnData) => {
                let tweetData = [];
                let lat, long;
                Util.asyncStorage.GetAsyncVar('userLocationData', (result) => {
                    lat = result.split(',')[0];
                    long = result.split(',')[1];
                });
                for(i = 0; i < dataObj.data.length; i++) {
                    try {
                        console.log('Twitter Key: ' + TWITTER_CONSUMER_API_KEY);
                        console.log('--------------------------------')
                        console.log('Twitter Token: ' + TWITTER_ACCESS_TOKEN);
                        console.log('--------------------------------')
                        console.log(dataObj.data[i].name);
                        
                        var myHeaders = new Headers();
                        myHeaders.append("Authorization", "OAuth oauth_consumer_key=\"8OoSRU84Gfb6T0IbP0yY7qD6E\",oauth_token=\"296469241-ejzzBd6CUdUmd2Vx8e4jzTZfV1Jx4xzxKwNei9Wq\",oauth_signature_method=\"HMAC-SHA1\",oauth_timestamp=\"1590613600\",oauth_nonce=\"5ON4IEI3hhM\",oauth_version=\"1.0\",oauth_signature=\"oKIG4aZ7sPVt6G2ZGZ5h3lkqm4w%3D\"");
                        myHeaders.append("Cookie", "personalization_id=\"v1_tjATmWWAiUBgrIjq7IMu2A==\"; lang=en; guest_id=v1%3A159061359971224804");

                        var requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow'
                        };

                        fetch("https://api.twitter.com/1.1/search/tweets.json?q="+ dataObj.data[i].name +"&result_type=recent&count=5", requestOptions)
                        .then(response => response.json())
                        .then(async data => {
                            console.log(data);
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
        },
        Google: {
            placeData: async (boolean, query, returnData) => {
                let dataObj = {};
                let token, lat, long;
                try {
                    // Get the Whats Poppin feed using Google's Map API for user query
                    if(boolean) {
                        fetch("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input="+ query +"&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=" + GOOGLE_API_KEY)
                        .then(response => response.json())
                        .then(async data => {
                            dataObj['data'] = data.data;
                            //Grabs post from Google based on query
                            returnData(dataObj);
                        })
                        .catch(e => console.log(e));
                    }
                    // Get the Whats Poppin feed using Google's Map API for default
                    else {
                        fetch("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=bar&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=" + GOOGLE_API_KEY)
                        .then(response => response.json())
                        .then(async data => {
                            dataObj['data'] = data.data;
                            //Grabs post from Google based for default
                            returnData(dataObj);
                        })
                        .catch(e => console.log(e));
                    }
                } catch ({ message }) {
                    alert(`Facebook Query Error: ${message}`);
                }
            },
            login: async function (callBack) {
                let dataObj = {};
                try {
                    let result = await Google.logInAsync({
                        androidClientId: AndroidClientKey,
                        iosClientId: IOSClientKey,
                        clientId: ClientKey
                    });
                    console.log(result);
                    if (result.type === 'success') {
                        /* `accessToken` is now valid and can be used to get data from the Google API with HTTP requests */
                        const googleCredential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken);
                        // Sign-in the user with the credential
                        console.log(googleCredential);
                        await firebase.auth().signInWithCredential(googleCredential).catch((error) => {
                            console.log("Firebase Google Auth Error: ");
                            console.log("Error Code: " + error.code);
                            console.log("Error Message: " + error.message);
                            console.log("Error Email: " + error.email);
                            console.log("Error Creds: " + error.credential);
                        });
                        dataObj['user'] = firebase.auth().currentUser;
                        dataObj['data'] = firebase.auth();
                        // Util.asyncStorage.SetAsyncStorageVar('GOToken', result.accessToken);
                        callBack(dataObj);
                    }
                    else{
                        console.log(result);
                    }
                } 
                catch ({ message }) {
                    alert(`Google Login Error: ${message}`);
                }
            }
        },
        Nife: {
            login: async function (signUpInfo, loginInfo, callBack) {
                let dataObj = {};
                // Listen for authentication state to change.
                if(signUpInfo) {
                    try {
                        let email = signUpInfo.email;
                        let password = signUpInfo.password1
                        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                            // Handle Errors here.
                            if(error) {
                                var errorMessage = error.message;
                                callBack(null, errorMessage)
                            }
                        });
                        dataObj['data'] = firebase.auth().currentUser;
                        dataObj['token'] = null;
                        dataObj['user'] = firebase.auth().currentUser;
                        callBack(dataObj);
                    } catch ({ message }) {
                        alert(`Nife Sign-up Error: ${message}`);
                    }
                }
                else {
                    try {
                        let email = loginInfo.email;
                        let password = loginInfo.password1
                        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                            // Handle Errors here.
                            if(error) {
                                var errorMessage = error.message;
                                callBack(null, errorMessage)
                            }
                        });
                        dataObj['data'] = firebase.auth().currentUser;
                        dataObj['token'] = null;
                        dataObj['user'] = firebase.auth().currentUser;
                        callBack(dataObj);
                    } catch ({ message }) {
                        alert(`Nife Login Error: ${message}`);
                    }
                }
            }
        },
        Firebase: {
            config: {
                apiKey: apiKey,
                authDomain: authDomain,
                databaseURL: databaseURL,
                projectId: projectId,
                storageBucket: storageBucket,
                messagingSenderId: messagingSenderId,
                appId: appId,
                measurementId: measurementId
            }
        }
    }
}


export default Util;