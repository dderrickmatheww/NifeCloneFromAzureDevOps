import { AsyncStorage } from 'react-native';
import { FACEBOOK_APP_ID, GOOGLE_API_KEY, YELP_PLACE_KEY, TWITTER_CONSUMER_API_KEY, TWITTER_ACCESS_SECRET, TWITTER_CONSUMER_SECERT_API_SECRET, TWITTER_PERSONALIZATION_ID, TWITTER_GUEST_ID, TWITTER_ACCESS_TOKEN, ClientKey, BUNDLE_ID, AndroidClientKey, IOSClientKey, apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId, measurementId } from 'react-native-dotenv';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import jsSHA from "jssha";
import * as Device from 'expo-device';
import * as Location from 'expo-location';

const Util = {
    friends: {
        GetFriends: function(db, email, callback) {
            let friendsArr = [];
            var path = new firebase.firestore.FieldPath('friends', email);
            let docRef = db.collection('users').where(path, '==', true);
            docRef.get().then((friends) => {
                friends.forEach(function(friend) {
                    if(friend.data().displayName) {
                        friendsArr.push(friend.data());
                    }
                });
                Util.basicUtil.consoleLog('GetFriends', true);
                callback(friendsArr);
            })
            .catch((error) => {
                Util.basicUtil.consoleLog('GetFriends', false);
                console.log("Firebase Error: " + error);
            });
        },
        AddFriend: function(db, email, callback){
            Util.basicUtil.consoleLog('AddFriend', true);
        }
    },
    user: {
        VerifyUser: function(db, user, email, callback){
            db.collection('users').doc(email).get()
            .then(async (data) => {
                if(data.data()){
                    await db.collection('users').doc(email).set({lastLoginAt: new Date().toUTCString()}, {merge:true});
                    Util.basicUtil.consoleLog('VerifyUser', true);
                    callback(data.data());
                } 
                else {
                    if(user != undefined || user != null) {
                        let buildUser = {
                            createdAt: new Date().toUTCString(),
                            displayName: user.displayName,
                            email: user.email,
                            emailVerified: user.emailVerified,
                            lastLoginAt: new Date().toUTCString(),
                            phoneNumber: (user.phoneNumber == undefined || user.phoneNumber == null ? "555-555-5555" : user.phoneNumber),
                            photoSouce: user.photoURL,
                            providerData: user.providerData[0]
                        }
                        db.collection('users').doc(email).set(buildUser)
                        .then((data) => {
                            callback(buildUser);
                            Util.basicUtil.consoleLog('VerifyUser', true);
                        });
                    } else {
                        Util.basicUtil.consoleLog('VerifyUser', false);
                    }
                }
            });
        },
        GetUserData: function(db, email, callback){
            db.collection('users').doc(email).get()
            .then((data) => {
              if(data.data()){
                db.collection('users').doc(email).set({lastLoginAt: new Date().toUTCString()}, {merge:true});
                Util.basicUtil.consoleLog('GetUserData', true);
                callback(data.data());
              }
              else {
                Util.basicUtil.consoleLog('GetUserData', false);
              }
          })
          .catch((error) => {
                Util.basicUtil.consoleLog('GetUserData', false);
                console.log("Firebase Error: " + error);
          });
        },
        UpdateUser: function(db, email, updateObject, callback){
            let userRef = db.collection('users').doc(email);
            userRef.set(updateObject, {merge:true})
            .then(() => {
                Util.basicUtil.consoleLog('UpdateUser', true);
                callback()
            })
            .catch((error) => {
                Util.basicUtil.consoleLog('UpdateUser', false);
                console.log("Firebase Error: " + error);
            });
        },
        CheckIn: async (buisnessUID, email, privacy, returnData) => {
            let db = firebase.firestore();
            let setLoc = await db.collection('users').doc(email);
            let lastVisited = {};
            lastVisited[buisnessUID] = {
                checkInTime: new Date().toUTCString(),
                privacy: privacy
            }
            setLoc.set({
                checkIn: {
                    buisnessUID: buisnessUID,
                    checkInTime: new Date().toUTCString(),
                    privacy: privacy
                },
                lastVisited
            },
            {
                merge: true
            })
            .then(() => {
                Util.basicUtil.consoleLog('CheckIn', true);
                returnData('true');
            })
            .catch((error) => {
                Util.basicUtil.consoleLog('CheckIn', false);
                console.log("Firebase Error: " + error);
            });
        },
        CheckOut: async (email, returnData) => {
            let db = firebase.firestore();
            let setLoc = await db.collection('users').doc(email);
            setLoc.set({
            checkIn: {
                buisnessUID: "",
                checkInTime: "",
                privacy: ""
            }},
            {
                merge: true
            })
            .then(() => {
                Util.basicUtil.consoleLog('CheckOut', true);
                returnData('false');
            })
            .catch((error) => {
                Util.basicUtil.consoleLog('CheckOut', false);
                console.log("Firebase Error: " + error);
            });
        },
        IsUserCheckedIn: (email, buisnessUID, returnData) => {
            let db = firebase.firestore();
            try {
                Util.user.GetUserData(db, email, (userData) => {
                    let user = userData;
                    if(user.checkIn.checkInTime == "") {
                        returnData("false");
                    }
                    else if (user.checkIn.buinessUID == buisnessUID) {
                        returnData("true");
                    }
                    else {
                        returnData("true");
                    }
                });
                Util.basicUtil.consoleLog('IsUserCheckedIn', true);
            }
            catch (error) {
                Util.basicUtil.consoleLog('IsUserCheckedIn', false);
                console.log('Catch error: ' + error);
            }
        },
        QueryPublicUsers: function(db, query, take, callback){
            var path = new firebase.firestore.FieldPath('privacy', "public");
            let usersRef = db.collection('users').limit(take);
            usersRef.where(path, '==', true)
            .then((data) => {
              if(data.data()){
                let queriedUsers = data.data();
                let wantedUsers = [];
                Util.basicUtil.consoleLog('QueryUsers', true);
                queriedUsers.forEach((user)=>{
                    if(user.indexOf(query) != -1){
                        wantedUsers.push(user);
                    }
                });
                callback(wantedUsers);
              }
              else {
                Util.basicUtil.consoleLog('QueryUsers', false);
              }
          })
          .catch((error) => {
                Util.basicUtil.consoleLog('QueryUsers', false);
                console.log("Firebase Error: " + error);
          });
        },
        QueryPrivateUsers: function(db, query, take, callback){
            var path = new firebase.firestore.FieldPath('privacy', "public");
            let usersRef = db.collection('users').limit(take);
            usersRef.where(path, '==', false).where('email', '==', query)
            .then((data) => {
              if(data.data()){
                Util.basicUtil.consoleLog('QueryUsers', true);
                callback(data.data());
              }
              else {
                Util.basicUtil.consoleLog('QueryUsers', false);
              }
          })
          .catch((error) => {
                Util.basicUtil.consoleLog('QueryUsers', false);
                console.log("Firebase Error: " + error);
          });
        },
    },
    location: {
        SaveLocation: function(db, email, location, callback){
            let setLoc = db.collection('users').doc(email);
            setLoc
            .set({ loginLocation: location }, {merge: true})
            .then(() => {
                Util.basicUtil.consoleLog('SaveLocation', true);
                callback();
            })
            .catch((error) => {
                Util.basicUtil.consoleLog('SaveLocation', false);
                console.log("Firebase Error: " + error);
            });
        },
        SetUserLocationData: function (region) {
            var latAndLong = region.latitude + ',' + region.longitude;
            Util.asyncStorage.SetAsyncStorageVar('userLocationData', latAndLong);
            Util.basicUtil.consoleLog('SaveLocation', true);
        },
        GetUserLocation: (returnData) => {
            Location.getCurrentPositionAsync({enableHighAccuracy:true}).then((location) => {
                Util.location.SetUserLocationData(location.coords);
                Util.basicUtil.consoleLog('GetUserLocation', true);
                returnData(location.coords);
            })
            .catch((error) => {
                Util.basicUtil.consoleLog('GetUserLocation', false);
                console.log("Expo Location Error: " + error);
            });
        }
    },
    asyncStorage: {
        SetAsyncStorageVar: async (name, value) => {
            await AsyncStorage.getItem(name, async function(err, result){
                if(err) {
                    Util.basicUtil.consoleLog("SetAsyncStorageVar's getItem", false);
                    console.log('Async Getting Storage Error: ' + err);
                }
                else {
                    if (!result) {
                        await AsyncStorage.setItem(name, value, function(err){
                            if (err) {
                                Util.basicUtil.consoleLog("SetAsyncStorageVar's setItem", false);
                                console.log('Async Setting Storage Error: ' + err);
                            }
                            else {
                                Util.basicUtil.consoleLog("SetAsyncStorageVar's setItem", true);
                            }
                        });
                    }
                    else {
                        await AsyncStorage.removeItem(name, async function(err){
                            if (err) {
                                Util.basicUtil.consoleLog("SetAsyncStorageVar's removeItem", false);
                                console.log('Async Removing Storage Error: ' + err);
                            }
                            else {
                                await AsyncStorage.setItem(name, value, function(err){
                                    if (err) {
                                        Util.basicUtil.consoleLog("SetAsyncStorageVar's setItem", false);
                                        console.log('Async Setting Storage Error: ' + err);
                                    }
                                    else {
                                        Util.basicUtil.consoleLog("SetAsyncStorageVar's setItem", true);
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
                    Util.basicUtil.consoleLog("IsAsyncVariableSet's getItem", false);
                    console.log('Async Getting Storage Error: ' + err);
                }
                else {
                    if(result) {
                        Util.basicUtil.consoleLog("IsAsyncVariableSet's getItem", true);
                        return true;
                    }
                    else {
                        Util.basicUtil.consoleLog("IsAsyncVariableSet's getItem", true);
                        return false;
                    }
                }
            })
        },
        MultiGetAsyncVar: async (arrayOfNames, callback) => {
            let returnArray = [];
            await AsyncStorage.multiGet(arrayOfNames, (err, result) => {
                if (err) {
                    Util.basicUtil.consoleLog("MultiGetAsyncVar's multiGet", false);
                    console.log('Async Multiget Storage Error: ' + err);
                }
                else {
                    returnArray.push(result);
                }
            });
            if (returnArray.length > 0) {
                Util.basicUtil.consoleLog("MultiGetAsyncVar's multiGet", true);
                callback(returnArray[0]);
            }
            else {
                console.log('No results found of variable names: ' + arrayOfNames);
                Util.basicUtil.consoleLog("MultiGetAsyncVar's multiGet", true);
            }
        },
        GetAsyncStorageVar: async (name, callback) => {
            let returnArray = [];
            await AsyncStorage.getItem(name, async (err, result) => { 
                if(err) {
                    Util.basicUtil.consoleLog("GetAsyncStorageVar's getItem", false);
                    console.log('Async Error getting variable ' + name + ' ' + err);
                }
                else {
                    returnArray.push(result);
                }
            });
            if (returnArray.length > 0) {
                Util.basicUtil.consoleLog("GetAsyncStorageVar's getItem", true);
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
                            Util.basicUtil.consoleLog("Facbook's placeData", true);
                            //Grabs post from FB based for user query
                            returnData(dataObj);
                        })
                        .catch((e) => {
                            Util.basicUtil.consoleLog("Facbook's placeData", false);
                            console.log("Facebook Graph API Error: " + e);
                        });
                    } 
                    // Get the Whats Poppin feed using Facebook's Graph API for default
                    else {
                        fetch('https://graph.facebook.com/search?type=place&q=bar&center='+lat+','+long+'&distance=32186&fields=id,name,location,link,about,description,phone,restaurant_specialties,website&access_token='+ token)
                        .then(response => response.json())
                        .then(async data => {
                            dataObj['data'] = data.data;
                            Util.basicUtil.consoleLog("Facbook's placeData", true);
                            //Grabs post from FB based for default
                            returnData(dataObj);
                        })
                        .catch((e) => {
                            Util.basicUtil.consoleLog("Facbook's placeData", false);
                            console.log("Facebook Graph API Error: " + e);
                        });
                    }
                } catch ({ message }) {
                    Util.basicUtil.consoleLog("Facbook's placeData", false);
                    console.log(`Facebook's placeData Query Error: ${message}`);
                }
            },
            postData: async (dataObj, token, returnData) => {
                await Facebook.initializeAsync(FACEBOOK_APP_ID, BUNDLE_ID);
                try {
                    // Get the user's name using Facebook's Graph API
                    fetch('https://graph.facebook.com/v7.0/' + dataObj.page.id + '/posts?&access_token='+ token)
                    .then(response => response.json())
                    .then(async data => {
                        dataObj['PostData'] = data;
                        Util.basicUtil.consoleLog("Facbook's postData", true);
                        returnData(dataObj);
                    })
                    .catch((e) => {
                        Util.basicUtil.consoleLog("Facbook's postData", false);
                        console.log("Facebook Graph API Error: " + e);
                    });
                } catch ({ message }) {
                    Util.basicUtil.consoleLog("Facbook's postData", false);
                    console.log(`Facebook's postData Query Error: ${message}`);
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
                        await firebase.auth().signInWithCredential(credential)
                        .catch((error) => { 
                            Util.basicUtil.consoleLog("Facbook's login", false);
                            console.log('Firebase Facebook Auth Error: ' + error); 
                        });
                        dataObj['data'] = firebase.auth().currentUser;
                        Util.basicUtil.consoleLog("Facbook's login", true);
                        Util.asyncStorage.SetAsyncStorageVar('FBToken', token);
                        Util.user.VerifyUser(firebase.firestore(), firebase.auth().currentUser, firebase.auth().currentUser.email);
                        callBack(dataObj);
                    })
                    .catch((error) => {
                        Util.basicUtil.consoleLog("Facbook's login", false);
                        console.log("Firebase Facebook Auth Error: " + error.message);
                    });
                  } else {
                    // type === 'cancel'
                  }
                } catch ({ message }) {
                  Util.basicUtil.consoleLog("Facbook's login", false);
                  console.log(`Facebook Login Error: ${message}`);
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
                            if(result && !result.errors && result.statuses.length > 0) {
                                twitObj['TwitterData'] = result.statuses;
                            }
                        })
                        .catch((error) => {
                            Util.basicUtil.consoleLog("Twitter's tweetData", false);
                            console.log(`Twitter's tweetData Error: ${error}`);
                        });
                        if(twitObj.TwitterData){
                            dataObj.data[i]['TwitterData'] = twitObj.TwitterData;
                        }
                    } catch ({ message }) {
                        Util.basicUtil.consoleLog("Twitter's tweetData", false);
                        alert(`Twitter Query Error: ${message}`);
                    }
                }
                Util.basicUtil.consoleLog("Twitter's tweetData", true);
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
                            Util.basicUtil.consoleLog("Google's placeData", true);
                            returnData(dataObj);
                        })
                        .catch((e) => {
                            Util.basicUtil.consoleLog("Google's placeData", false);
                            console.log("Google Map Query API Error: " + e);
                        });
                    }
                    // Get the Whats Poppin feed using Google's Map API for default
                    else {
                        fetch("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=bar&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=" + GOOGLE_API_KEY)
                        .then(response => response.json())
                        .then(async data => {
                            dataObj['data'] = data.data;
                            //Grabs post from Google based for default
                            Util.basicUtil.consoleLog("Google's placeData", true);
                            returnData(dataObj);
                        })
                        .catch((e) => {
                            Util.basicUtil.consoleLog("Google's placeData", false);
                            console.log("Google Map Default API Error: " + e);
                        });
                    }
                } catch ({ message }) {
                    Util.basicUtil.consoleLog("Google's placeData", false);
                    alert(`Google placeData Error: ${message}`);
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
                        const googleCredential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken);
                        await firebase.auth().signInWithCredential(googleCredential)
                        .catch((error) => {
                            Util.basicUtil.consoleLog("Google's login", false);
                            console.log("Firebase Google Auth Error: " + error.message);
                        });
                        dataObj['user'] = firebase.auth().currentUser;
                        dataObj['data'] = firebase.auth();
                        Util.basicUtil.consoleLog("Google's login", true);
                        Util.user.VerifyUser(firebase.firestore(), firebase.auth().currentUser, firebase.auth().currentUser.email);
                        callBack(dataObj);
                    }
                    else{
                        //Handles cancel
                    }
                } 
                catch ({ message }) {
                    Util.basicUtil.consoleLog("Google's login", false);
                    alert(`Google login Error: ${message}`);
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
                        firebase.auth().createUserWithEmailAndPassword(email, password)
                        .catch(function(error) {
                            Util.basicUtil.consoleLog("Nife's sign-up", false);
                            console.log("Nife sign-up Error: " + error);
                        });
                        dataObj['data'] = firebase.auth().currentUser;
                        dataObj['token'] = null;
                        dataObj['user'] = firebase.auth().currentUser;
                        Util.basicUtil.consoleLog("Nife's sign-up", true);
                        callBack(dataObj);
                    } catch ({ message }) {
                        Util.basicUtil.consoleLog("Nife's sign-up", false);
                        alert(`Nife sign-up Error: ${message}`);
                    }
                }
                else {
                    try {
                        let email = loginInfo.email;
                        let password = loginInfo.password1
                        firebase.auth().signInWithEmailAndPassword(email, password)
                        .catch(function(error) {
                            Util.basicUtil.consoleLog("Nife's login", false);
                            console.log("Nife login Error: " + error);
                        });
                        dataObj['data'] = firebase.auth().currentUser;
                        dataObj['token'] = null;
                        dataObj['user'] = firebase.auth().currentUser;
                        Util.basicUtil.consoleLog("Nife's login", true);
                        callBack(dataObj);
                    } catch ({ message }) {
                        Util.basicUtil.consoleLog("Nife's login", false);
                        alert(`Nife login Error: ${message}`);
                    }
                }
            }
        },
        Yelp: {
            placeData: (baseUrl, params, friendData, returnData) => {
                fetch(baseUrl + params, 
                    {headers: new Headers({'Authorization':"Bearer "+ YELP_PLACE_KEY})
                })
                .then((data) => data.json())
                .then((response) => {
                    let friends = JSON.parse(friendData);
                    let bars = response['businesses'];
                    if(friends.length > 0){
                        var tempFriendArr = [];
                        bars.forEach((bar) => {
                            friends.forEach((friend) => {
                                if((friend.lastVisited) && (friend.lastVisited.buinessUID == bar.id)){
                                    tempFriendArr.push(friend);
                                }
                            });
                        });
                        response["businesses"]['lastVisitedBy'] = tempFriendArr;
                    }
                    Util.basicUtil.consoleLog("Yelp's placeData", true);
                    returnData(response['businesses']);
                })
                .catch((err) => {
                    Util.basicUtil.consoleLog("Yelp's placeData", false);
                    console.log("Yelp's placeData Error: " + err);
                });
            },
            buildParameters: (lat, long, radius) => {
                var paramString ="";
                //location, lat long
                paramString += "latitude=" + lat+ "&longitude=" + long + "&";
                //radius in meters
                paramString +="radius="+radius+"&";
                //type
                paramString +="categories=bars"
                return paramString;
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
        },
        consoleLog: (fucnName, type) => {
            if(type == true) {
                console.log('\n');
                console.log("" + fucnName + " ran successfully!");
            }
            else {
                console.log('\n');
                console.log("" + fucnName + " failed.");
            }
        }
    }
}


export default Util;