import { GetFriends, AddFriend } from "./friends/FriendsUtil";
import { AsyncStorage } from 'react-native';
import { VerifyUser, GetUserData } from "./user/UserUtil";
import { SaveLocation } from "./location/LocationUtil";
import { FACEBOOK_APP_ID, GOOGLE_API_KEY, TWITTER_CONSUMER_API_KEY, TWITTER_ACCESS_SECRET, TWITTER_CONSUMER_SECERT_API_SECRET, TWITTER_PERSONALIZATION_ID, TWITTER_GUEST_ID, TWITTER_ACCESS_TOKEN, ClientKey, BUNDLE_ID, AndroidClientKey, IOSClientKey, apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId, measurementId } from 'react-native-dotenv';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import jsSHA from "jssha";
import * as Device from 'expo-device';
import * as Location from 'expo-location';

const Util = {
    friends: {
        GetFriends: function(db, email, callback){
            GetFriends(db, email, callback);
        },
        AddFriend: function(db, email, callback){
            AddFriend(db, email, callback);
        }
    },
    user: {
        VerifyUser: function(db, user, email, callback){
            VerifyUser(db, user, email, callback);
        },
        GetUserData: function(db, email, callback){
            GetUserData(db, email, callback);
        },
        CheckIn: async (buisnessUID, email, privacy, returnData) => {
            let db = firebase.firestore();
            let setLoc = await db.collection('users').doc(email);
            setLoc.set({
            checkIn: {
                buisnessUID: buisnessUID,
                checkInTime: new Date().toUTCString(),
                privacy: privacy
            }},
            {
                merge: true
            });
            returnData(true);
        },
        CheckOut: async (buisnessUID, email, returnData) => {
          let db = firebase.firestore();
          let setCheckInData = await db.collection('userCheckIn').doc(email);
          //Grab the buisness UID
          //Make sure the user exists
          setCheckInData.get().data().forEach(element, index, () => {
            let elementBuisnessUID = element.buisnessUID;
            if(buisnessUID == elementBuisnessUID) {
              setCheckInData.delete()
              .then(() => {
                returnData(false);
              })
              .catch((err) => {
                console.log('Error deleting CheckIn: ', err);
              });
            }
          });
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
            let returnArray = [];
            await AsyncStorage.getItem(name, async (err, result) => { 
                if(err) {
                    console.log('Async Error getting variable ' + name + ' ' + err);
                }
                else {
                    returnArray.push(result);
                    console.log('Grabbed Async variable: ' + name + ' from Async Storage!');
                }
            });
            if (returnArray.length > 0) {
                console.log(returnArray[0]);
                callback(returnArray[0]);
            }
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
                      .catch(e => console.log(e))
                  } else {
                    // type === 'cancel'
                  }
                } catch ({ message }) {
                  alert(`Facebook Login Error: ${message}`);
                }
            }
        },
        Twitter: {
            tweetData: async function (dataObj, returnData) {
                var twitObj = {
                    method: 'GET'
                };
                await Util.asyncStorage.GetAsyncVar('userLocationData', (result) => {
                    twitObj['lat'] = result.split(',')[0].slice(0, 5);
                    twitObj['long'] = result.split(',')[1].slice(0, 6);
                });
                for(i = 0; i < dataObj.data.length; i++) {
                    twitObj['url'] = "https://api.twitter.com/1.1/search/tweets.json";
                    twitObj['paramObj'] = {"q": dataObj.data[i].name, "count": "1", "geocode": twitObj.lat+","+twitObj.long+",20mi", "result_type": "recent"};
                    twitObj['paramStr'] = "?q="+dataObj.data[i].name+"&count=1&geocode="+twitObj.lat+","+twitObj.long+",20mi&result_type=recent";
                    twitObj['OAuthString'] = await Util.dataCalls.OAuth.grantAuthorization(twitObj.method, twitObj.url, twitObj.paramObj);
                    try {
                        var myHeaders = new Headers();
                        myHeaders.append("Authorization", twitObj.OAuthString);
                        myHeaders.append("Cookie", "personalization_id=\""+TWITTER_PERSONALIZATION_ID+"\"; guest_id="+TWITTER_GUEST_ID+"; lang=en");
                        var requestOptions = {
                          method: 'GET',
                          headers: myHeaders,
                          redirect: 'follow'
                        };
                        await fetch(twitObj.url + twitObj.paramStr, requestOptions)
                        .then(response => response.json())
                        .then(result => {
                            console.log(result)
                            if(result && !result.errors && result.statuses.length > 0) {
                                twitObj['TwitterData'] = result.statuses;
                            }
                        })
                        .catch(error => console.log('error', error));
                        if(twitObj.TwitterData){
                            dataObj.data[i]['TwitterData'] = twitObj.TwitterData;
                        }
                    } catch ({ message }) {
                        alert(`Twitter Query Error: ${message}`);
                    }
                }
                returnData(dataObj);
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
                    if (result.type === 'success') {
                        /* `accessToken` is now valid and can be used to get data from the Google API with HTTP requests */
                        const googleCredential = firebase.auth.GoogleAuthProvider.credential(result.idToken);
                        // Sign-in the user with the credential
                        await firebase.auth().signInWithCredential(googleCredential).catch((error) => {console.log("Firebase Google Auth Error: " + error)});
                        dataObj['data'] = firebase.auth().currentUser;
                        Util.asyncStorage.SetAsyncStorageVar('GOToken', result.accessToken);
                        Util.user.VerifyUser(firebase.firestore(), dataObj.data, dataObj.data.email, (data) =>{
                            console.log(data);
                        });
                        callBack(dataObj);
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
        },
        OAuth: {
            grantAuthorization: async (httpMethod, baseUrl, reqParams) => {
                const consumerKey = TWITTER_CONSUMER_API_KEY,
                    consumerSecret = TWITTER_CONSUMER_SECERT_API_SECRET,
                    accessToken = TWITTER_ACCESS_TOKEN,
                    accessTokenSecret = TWITTER_ACCESS_SECRET;
                // timestamp as unix epoch
                let timestamp  = Math.round(Date.now() / 1000);;
                // nonce as base64 encoded unique random string
                let nonce = btoa(consumerKey + ':' + timestamp);
                // generate signature from base string & signing key
                let baseString = Util.dataCalls.OAuth.generateBaseString(httpMethod, baseUrl, reqParams, consumerKey, accessToken, timestamp, nonce);
                let signingKey = Util.dataCalls.OAuth.generateSigningKey(consumerSecret, accessTokenSecret);
                let signature  = Util.dataCalls.OAuth.generateSignature(baseString, signingKey);
                // return interpolated string
                return oAuthObjstr = 'OAuth ' +
                    'oauth_consumer_key="'  + consumerKey       + '", ' +
                    'oauth_nonce="'         + nonce             + '", ' +
                    'oauth_signature="'     + signature         + '", ' +
                    'oauth_signature_method="HMAC-SHA1", '              +
                    'oauth_timestamp="'     + timestamp         + '", ' +
                    'oauth_token="'         + accessToken       + '", ' +
                    'oauth_version="1.0"';
                   
            },
            generateSignature: (base_string, signing_key) => {
                var signature = Util.dataCalls.OAuth.generateHMAC_SHA1Hash(base_string, signing_key);
                return Util.dataCalls.OAuth.percentEncode(signature);
            },
            generateBaseString: (method, url, params, key, token, timestamp, nonce) => {
                return method
                + '&' + Util.dataCalls.OAuth.percentEncode(url)
                + '&' + Util.dataCalls.OAuth.percentEncode(Util.dataCalls.OAuth.generateSortedParamString(params, key, token, timestamp, nonce));
            },
            generateSigningKey: (consumer_secret, token_secret) => {
                return consumer_secret + '&' + token_secret;
            },
            percentEncode: (str) => {
                return encodeURIComponent(str).replace(/[!*()']/g, (character) => {
                    return '%' + character.charCodeAt(0).toString(16);
                });
            },
            generateHMAC_SHA1Hash: (string, secret) => {
                let shaObj = new jsSHA("SHA-1", "TEXT");
                shaObj.setHMACKey(secret, "TEXT");
                shaObj.update(string);
                let hmac = shaObj.getHMAC("B64");
                return hmac;
            },
            generateSortedParamString: (params, key, token, timestamp, nonce) => {
                // Merge oauth params & request params to single object
                let paramObj = Util.BasicUtil.mergeObject(
                    {
                        oauth_consumer_key : key,
                        oauth_nonce : nonce,
                        oauth_signature_method : 'HMAC-SHA1',
                        oauth_timestamp : timestamp,
                        oauth_token : token,
                        oauth_version : '1.0'
                    },
                    params
                );
                // Sort alphabetically
                let paramObjKeys = Object.keys(paramObj);
                let len = paramObjKeys.length;
                paramObjKeys.sort();
                // Interpolate to string with format as key1=val1&key2=val2&...
                let paramStr = paramObjKeys[0] + '=' + paramObj[paramObjKeys[0]];
                for (var i = 1; i < len; i++) {
                    paramStr += '&' + paramObjKeys[i] + '=' + Util.dataCalls.OAuth.percentEncode(decodeURIComponent(paramObj[paramObjKeys[i]]));
                }
                return paramStr;
            }
        }
    },
    basicUtil: {
        mergeObject: (obj1, obj2) => {
            for (var attr in obj2) {
                obj1[attr] = obj2[attr];
            }
            return obj1;
        },
        grabCurrentDeviceInfo: (returnData) => {
            let dataObj = {};
            dataObj['simulator'] = Device.isDevice;
            dataObj['modelName'] = Device.modelName;
            dataObj['userGivenDeviceName'] = Device.deviceName;
            dataObj['osName'] = Device.osName;
            dataObj['totalMemory'] = Device.totalMemory;
            returnData(dataObj);
        }
    }
}


export default Util;