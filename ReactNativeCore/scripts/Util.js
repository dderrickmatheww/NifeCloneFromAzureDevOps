import { AsyncStorage, ProgressBarAndroidComponent, Alert } from 'react-native';
import { FACEBOOK_APP_ID, GOOGLE_API_KEY, YELP_PLACE_KEY, TWITTER_CONSUMER_API_KEY, TWITTER_ACCESS_SECRET, TWITTER_CONSUMER_SECERT_API_SECRET, TWITTER_PERSONALIZATION_ID, TWITTER_GUEST_ID, TWITTER_ACCESS_TOKEN, ClientKey, BUNDLE_ID, AndroidClientKey, IOSClientKey, apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId, measurementId } from 'react-native-dotenv';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import jsSHA from "jssha";
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { isPointWithinRadius, getDistance  } from 'geolib';

const Util = {
    friends: {
        GetFriends: function(email, callback) {
            let obj = {
                email: email
            }
            if(email) {
                fetch('https://us-central1-nife-75d60.cloudfunctions.net/getFriends', 
                { 
                    method: 'POST',
                    body: JSON.stringify(obj)
                })
                .then(response => response.json())
                .then(async data => {
                    callback(data.result);
                    Util.basicUtil.consoleLog('GetFriends', true);
                }).catch((error) => {
                    console.log(error)
                    Util.basicUtil.consoleLog('GetFriends', false);
                }); 
            }
        },
        FilterFriends: (obj, callback) => {
            if(obj) {
                fetch('https://us-central1-nife-75d60.cloudfunctions.net/filterFriends', 
                { 
                    method: 'POST',
                    body: JSON.stringify(obj)
                })
                .then(response => response.json())
                .then(async data => {
                    callback(data.result);
                    Util.basicUtil.consoleLog('FilterFriends', true);
                }).catch((error) => {
                    console.log(error)
                    Util.basicUtil.consoleLog('FilterFriends', false);
                }); 
            }
        },
        AddFriend: function(db, userEmail, friendEmail, callback){
            let updateUserObj = {
                friends:{}
            }
            // User that requested the friend
            updateUserObj.friends[friendEmail] = true;
            
            console.log('Attempting to add: ' +friendEmail+ " as a friend")
            Util.user.UpdateUser(db, userEmail, updateUserObj,()=>{
                Util.basicUtil.consoleLog("AddFriend " + userEmail, true);

                let updateFriendObj = {
                    friends:{}
                }
                // User that will have a friend request
                updateFriendObj.friends[userEmail] = null;
                
                Util.user.UpdateUser(db, friendEmail, updateFriendObj,()=>{
                    Util.basicUtil.consoleLog("AddFriend " + friendEmail, true);
                    callback();
                });
            });
        },
        RemoveFriend: function(db, userEmail, friendEmail, callback){
            let updateObj = {
                friends:{}
            }
            updateObj.friends[friendEmail] = false;
            
            Util.user.UpdateUser(db, userEmail, updateObj,()=>{
                Util.basicUtil.consoleLog("RemoveFriend " + userEmail, true);

                let friendUpdateObj = {
                    friends:{}
                }
                friendUpdateObj.friends[userEmail] = false;
                Util.user.UpdateUser(db, friendEmail, friendUpdateObj,()=>{
                    Util.basicUtil.consoleLog("RemoveFriend " + friendEmail, true);
                    callback();
                });
            });
        },
        AcceptFriendRequest: function(db, userEmail, friendEmail, callback){
            let updateUserObj = {
                friends:{}
            }
            // User that will have a friend request
            updateUserObj.friends[friendEmail] = true;
            console.log('Attempting to accept: ' +friendEmail+ " as a friend")
            Util.user.UpdateUser(db, userEmail, updateUserObj,()=>{
                Util.basicUtil.consoleLog("AddFriend ", true);
                callback();
            });
        },
    },
    user: {
        VerifyUser: function(user, email, callback){
            let obj = {
                user: user,
                email: email
            };
            if (user && email) {
                fetch('https://us-central1-nife-75d60.cloudfunctions.net/verifyUser', 
                { 
                    method: 'POST',
                    body: JSON.stringify(obj)
                })
                .then(response => response.json())
                .then(async data => {
                    callback(data.result);
                    Util.basicUtil.consoleLog('VerifyUser', true);
                }).catch((error) => {
                    console.log(error)
                    Util.basicUtil.consoleLog('VerifyUser', false);
                }); 
            }
        },
        BuildUserSchema: (obj) => {
            userObj = {};
            userObj['displayName'] = obj.displayName;
            userObj['email'] = obj.email;
            userObj['phoneNumber'] = obj.phoneNumber;
            userObj['photoSource'] = obj.photoURL;
            userObj['providerId'] = obj.providerId;
            userObj['uid'] = obj.uid;
            userObj['providerData'] = {
                displayName : obj.displayName,
                email : obj.email,
                phoneNumber : obj.phoneNumber,
                photoSource : obj.photoURL,
                providerId : obj.providerId,
                uid : obj.uid,
            }
            userObj['privacySettings'] = {public:true};
            
            return userObj;
        },
        GetUserData: function(email, callback){
            let obj = {
                email: email
            };
            if(email) {
                fetch('https://us-central1-nife-75d60.cloudfunctions.net/getUserData', 
                { 
                    method: 'POST',
                    body: JSON.stringify(obj)
                })
                .then(response => response.json())
                .then(async data => {
                    callback(data.result);
                    Util.basicUtil.consoleLog('GetUserData', true);
                }).catch((error) => {
                    console.log(error)
                    Util.basicUtil.consoleLog('GetUserData', false);
                });
            }
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
        CheckIn: async (checkInObj, returnData) => {
            let db = firebase.firestore();
            let setLoc = await db.collection('users').doc(checkInObj.email);
            let lastVisited = {};
            lastVisited[checkInObj.buisnessUID] = {
                checkInTime: new Date(),
                latAndLong: checkInObj.latAndLong,
                privacy: checkInObj.privacy,
                name: checkInObj.barName,
                phone: checkInObj.phone,
                address: checkInObj.address,
                barPhoto: checkInObj.image,
            }
            setLoc.set({
                checkIn: {
                    checkInTime: new Date(),
                    latAndLong: checkInObj.latAndLong,
                    buisnessUID: checkInObj.buisnessUID,
                    privacy: checkInObj.privacy,
                    name: checkInObj.barName,
                    phone: checkInObj.phone,
                    address: checkInObj.address,
                    barPhoto: checkInObj.image,
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
                privacy: "",
                latAndLong: "",
                name: "",
                phone: "",
                address: "",
                barPhoto: "",
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
                Util.user.GetUserData(email, (userData) => {
                    let user = userData;
                    if(!user.checkIn || !user.checkIn.checkInTime || user.checkIn.checkInTime == "") {
                        returnData("false");
                    }
                    else if (user.checkIn.buisnessUID && user.checkIn.buisnessUID == buisnessUID) {
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
        setFavorite: async (email, buisnessUID, boolean, buisnessName, callback) => {
            let db = firebase.firestore();
            let setLoc = db.collection('users').doc(email);
            let userData = await db.collection('users').doc(email).get();
            let userObj = userData.data();
            if(typeof userObj.favoritePlaces !== 'undefined' && Object.keys(userData.data().favoritePlaces).length > 10 ) {
                callback(false, true);
            }
            else {
                if (boolean) {
                    let favoritePlaces = {
                       [buisnessUID]: {
                           favorited: true,
                           name: buisnessName
                       }
                   }
                   setLoc.set({
                       favoritePlaces
                   },
                   {
                       merge: true
                   })
                   .then(() => {
                       Util.basicUtil.consoleLog('setFavorite', true);
                       callback(true, false);
                   })
                   .catch((error) => {
                       Util.basicUtil.consoleLog('setFavorite', false);
                       console.log("Firebase Error: " + error);
                   });
               }
               else {
                   // Remove the 'capital' field from the document
                   setLoc.update({
                       favoritePlaces: {
                           [buisnessUID]: {
                            favorited: false
                           }
                       }
                   })
                   .then(() => {
                       Util.basicUtil.consoleLog('setFavorite', true);
                       callback(false, false);
                   })
                   .catch((error) => {
                       Util.basicUtil.consoleLog('setFavorite', false);
                       console.log("Firebase Error: " + error);
                   });
               }
            }
        },
        isFavorited: async (buisnessUID, userData, returnData) => {
            if(userData.favoritePlaces) {
                let favorites = userData.favoritePlaces;
                if(favorites[buisnessUID]){
                    returnData(favorites[buisnessUID].favorited);
                } 
                else {
                    returnData(false);
                }
            } else {
                returnData(false);
            }
        },
        QueryPublicUsers: function(db, query, take, callback){
            let newQuery=  query.toLowerCase();
            var path = new firebase.firestore.FieldPath('privacySettings', "searchPrivacy");
            let usersRef = db.collection('users').where(path, '==', false)
            usersRef.get()
            .then((data) => {
              if(data){
                let queriedUsers = [];
                let wantedUsers = [];
                data.forEach((user)=>{
                    queriedUsers.push(user.data());
                });
                
                if(queriedUsers.length > 0){
                    queriedUsers.forEach((user)=>{
                        let qUserEmail = user.email.toLowerCase();
                        let qUserEmailRefined = qUserEmail.split('@')[0];
                        let qUserName = user.displayName.toLowerCase();
                        if((qUserEmail == newQuery || qUserName.includes(newQuery) || qUserEmailRefined.includes(newQuery) ) && user.email != firebase.auth().currentUser.email){
                            wantedUsers.push(user);
                        }
                    });
                    Util.basicUtil.consoleLog('QueryUsers', true);
                    callback(wantedUsers);
                }
                else {
                    Util.basicUtil.consoleLog('QueryUsers just no users', true);
                    callback([]);
                }
               
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
        GenerateQRCode: (userEmail) => {
            let email = encodeURI(userEmail);
            let QRSource = "http://api.qrserver.com/v1/create-qr-code/?data="+email+"&size=500x500&bgcolor=20232A&color=eca6c4"
            return QRSource;
        },
        UploadImage: async (uri, email, callback) => {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function() {
                  resolve(xhr.response);
                };
                xhr.onerror = function(e) {
                  console.log(e);
                  reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
              });
            
              const ref = firebase
                .storage()
                .ref()
                .child(email);
              const snapshot = await ref.put(blob);
            
              // We're done with the blob, close and release it
              blob.close();
              let image = await snapshot.ref.getDownloadURL();
              callback(image)
        }
    },
    business:{
        UploadAddressProof: async (uri, name, email, callback) => {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function() {
                  resolve(xhr.response);
                };
                xhr.onerror = function(e) {
                  console.log(e);
                  reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
              });
            
              const ref = firebase
                .storage()
                .ref()
                .child("businessProof/"+email);
              const snapshot = await ref.put(blob);
            
              // We're done with the blob, close and release it
              blob.close();
              let image = await snapshot.ref.getDownloadURL();
              callback(image)
        },
        VerifyUser: function(user, email, signUpState, callback){
            console.log(email)
            let db = firebase.firestore();
            db.collection('users').doc(email).get()
            .then((data) => {
                if(data.data()){
                    let dbUser = data.data();
                    Util.basicUtil.consoleLog('businessesVerifyUser', true);
                    callback(dbUser);
                }
                else {
                    if(user != undefined || user != null) {
                        let userObj = Util.business.BuildBusinessSchema(user.providerData[0], signUpState, false);
                        db.collection('users').doc(email).set(userObj, { merge:true });
                        let businessObj = Util.business.BuildBusinessSchema(user.providerData[0], signUpState, true);
                        db.collection('businesses').doc(email).set(businessObj, { merge:true });
                        callback(userObj);
                    }
                }
            })
            .catch((err) => {
                Util.basicUtil.consoleLog('businessesVerifyUser', false);
                console.log('Firebase Error: ' +  err);
            })
        },
        BuildBusinessSchema: (obj, signUpState, isBusinessTable) => {
            userObj = {};
            userObj['displayName'] = signUpState.businessName;
            userObj['email'] = obj.email;
            userObj['phoneNumber'] = signUpState.businessPhone;
            userObj['photoSource'] = obj.photoURL;
            userObj['providerId'] = obj.providerId;
            userObj['uid'] = obj.uid; //firebase uid
            userObj['businessId'] = signUpState.businessId;
            userObj['isBusiness'] = true;
            userObj['isVerified'] = false;
            userObj['providerData'] = {
                displayName : obj.displayName,
                email : obj.email,
                phoneNumber : obj.phoneNumber,
                photoSource : obj.photoURL,
                providerId : obj.providerId,
                uid : obj.uid,
            }
            if(isBusinessTable){
                
                userObj['state'] = signUpState.State; 
                userObj['zip'] = signUpState.zip; 
                userObj['city'] = signUpState.City;
                userObj['address'] = signUpState.Address;
                userObj['hours'] = {
                    open: "12:00PM",
                    close: "2:00AM",
                }
                userObj['events'] = {};
                userObj['specials'] = [];
                userObj['coordinates'] = signUpState.coordinates;
            }
            
            userObj['privacySettings'] = {public:true};

            return userObj;
        },
        GetBusinessData: function(email, callback){
            let obj = {
                email: email
            };
            if(email) {
                fetch('https://us-central1-nife-75d60.cloudfunctions.net/getBusinessData', 
                { 
                    method: 'POST',
                    body: JSON.stringify(obj)
                })
                .then(response => response.json())
                .then(async data => {
                    callback(data.result);
                    Util.basicUtil.consoleLog('GetBusinessData', true);
                }).catch((error) => {
                    Util.basicUtil.consoleLog('GetBusinessData', false);
                    console.log('Firebase Error: ' + error);
                }); 
            }
        },
        UpdateUser: function(db, email, updateObject, callback){
            let userRef = db.collection('businesses').doc(email);
            userRef.set(updateObject, {merge:true})
            .then(() => {
                Util.basicUtil.consoleLog('Updatebusinesses', true);
                callback()
            })
            .catch((error) => {
                Util.basicUtil.consoleLog('Updatebusinesses', false);
                console.log("Firebase Error: " + error);
            });
        },
        GetBusinessesByUserFavorites: function(favArr, callback){
            let obj = {
                favArr: favArr
            };
            if(favArr) {
                fetch('https://us-central1-nife-75d60.cloudfunctions.net/saveLocation', 
                { 
                    method: 'POST',
                    body: JSON.stringify(obj)
                })
                .then(response => response.json())
                .then(async data => {
                    callback(data.result);
                    Util.basicUtil.consoleLog('GetBusinessesByUserFavorites', true);
                }).catch((error) => {
                    Util.basicUtil.consoleLog('GetBusinessesByUserFavorites', false);
                    console.log('Firebase Error: ' + error);
                });
            }
        },
        GetBusinessByUID: async (uid, callback) => {
            let busRef = firebase.firestore().collection('businesses')
            try {
                const snapshot = await busRef.where('businessId', "==", uid).get();
                if(!snapshot.empty) {
                    let tempArr = [];
                    snapshot.forEach((doc) =>{
                        tempArr.push(doc.data())
                    })
                    callback(tempArr[0]);
                } else {
                    callback(false);
                }
                Util.basicUtil.consoleLog("GetBusinessByUID", true);
            }
            catch (error) {
                Util.basicUtil.consoleLog("GetBusinessByUID", false);
                console.log('Firebase Error: ' + error);
                callback(false);
            }
            
        }
    },
    location: {
        SaveLocation: function(email, location, callback){
            let obj = {
                location: location,
                email: email
            };
            if(email && location) {
                fetch('https://us-central1-nife-75d60.cloudfunctions.net/saveLocation', 
                { 
                    method: 'POST',
                    body: JSON.stringify(obj)
                })
                .then(response => response.json())
                .then(async data => {
                    callback(data.result);
                    Util.basicUtil.consoleLog('SaveLocation', true);
                }).catch((error) => {
                    Util.basicUtil.consoleLog('SaveLocation', false);
                    console.log('Firebase Error: ' + error);
                });
            }
        },
        SetUserLocationData: function (region) {
            var latAndLong = region.latitude + ',' + region.longitude;
            Util.asyncStorage.SetAsyncStorageVar('userLocationData', latAndLong);
            Util.basicUtil.consoleLog('SaveLocation', true);
        },
        GetUserLocation: (returnData) => {
            Location.getCurrentPositionAsync({enableHighAccuracy:true}).then((location) => {
                Location.reverseGeocodeAsync(location.coords).then((region)=>{
                    console.log(region)
                    let loc = location;
                    loc['region'] = region[0];
                    Util.location.SetUserLocationData(location.coords);
                    Util.basicUtil.consoleLog('GetUserLocation', true);
                    returnData(loc);
                })
                
            })
            .catch((error) => {
                Util.basicUtil.consoleLog('GetUserLocation', false);
                console.log("Expo Location Error: " + error);
            });
        },
        GrabWhatsPoppinFeed: async (query, email, returnData) => {
            if(!query) {
                Util.location.GetUserLocation((userLocation) => {
                    Util.location.checkUserCheckInCount(null, userLocation, (dataObj) => {
                        returnData(dataObj)
                    })
                });
            }
        },
        checkUserCheckInCount: async (buisnessUID, userLocation, returnData) => {
            obj = {
                buisnessUID: buisnessUID,
                userLocation: userLocation
            }
            if(userLocation) {
                fetch('https://us-central1-nife-75d60.cloudfunctions.net/checkInCount', 
                { 
                    method: 'POST',
                    body: JSON.stringify(obj)
                })
                .then(response => response.json())
                .then(async data => {
                    returnData(data.result);
                    Util.basicUtil.consoleLog('checkUserCheckInCount', true);
                }).catch((error) => {
                    console.log(error)
                    Util.basicUtil.consoleLog('checkUserCheckInCount', false);
                }); 
            }
        },
        IsWithinRadius: (checkIn, userLocation, boolean) => {
            let withinRadius;
            let checkInLat = parseInt(checkIn.latAndLong.split(',')[0]);
            let checkInLong = parseInt(checkIn.latAndLong.split(',')[1]);
            let userLat = parseInt(userLocation.coords.latitude);
            let userLong = parseInt(userLocation.coords.longitude);
            if(boolean) {
                return withinRadius = isPointWithinRadius(
                    {
                        latitude: checkInLat,
                        longitude: checkInLong
                    }, 
                    {
                        latitude: userLat,
                        longitude: userLong
                    }, 
                    100
                ); 
            }
            else {
                return withinRadius = isPointWithinRadius(
                    {
                        latitude: checkInLat,
                        longitude: checkInLong
                    }, 
                    {
                        latitude: userLat,
                        longitude: userLong
                    }, 
                    32000
                ); 
            }
        },
        DistanceBetween: (lat, long, userLocation, returnData) => {
            returnData(
                getDistance(
                    {
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude
                    },
                    {
                        latitude: lat,
                        longitude: long
                    },
                    1
                ) * 0.00062137119223733
            );
        }
    },
    date: {
        TimeSince: (date) => {
            // console.log(date)
            try {
                var seconds = Math.floor((new Date() - date) / 1000);
                var interval = Math.floor(seconds / 31536000);
                if (interval > 1) {
                    // Util.basicUtil.consoleLog('TimeSince', true);
                    return interval + " years";
                }
                interval = Math.floor(seconds / 2592000);
                if (interval > 1) {
                    // Util.basicUtil.consoleLog('TimeSince', true);
                    return interval + " months";
                }
                interval = Math.floor(seconds / 86400);
                if (interval > 1) {
                    // Util.basicUtil.consoleLog('TimeSince', true);
                    return interval + " days";
                }
                interval = Math.floor(seconds / 3600);
                if (interval > 1) {
                    // Util.basicUtil.consoleLog('TimeSince', true);
                    return interval + " hours";
                }
                interval = Math.floor(seconds / 60);
                if (interval > 1) {
                    // Util.basicUtil.consoleLog('TimeSince', true);
                    return interval + " minutes";
                }
                // Util.basicUtil.consoleLog('TimeSince', true);
                return "a few seconds";
            }
            catch (error) {
                Util.basicUtil.consoleLog('TimeSince', false);
                console.log("TimeSince Error: " + error);
            }
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
        },
        DeleteAllAsyncStorage: async (returnData) => {
            await AsyncStorage.clear();
            Util.basicUtil.consoleLog("DeleteAllAsyncStorage", true);
            returnData();
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
                    token = FB_CLIENT_ID;
                    Util.asyncStorage.GetAsyncStorageVar('userLocationData', (result) => {
                        lat = result.split(',')[0];
                        long = result.split(',')[1];
                        console.log('lat: ' + lat);
                        console.log('long: ' + long);
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
                            if(data.error){
                                Util.basicUtil.consoleLog("Facbook's placeData", false);
                                console.log('FaceBookError - Code: '+data.error.code + " Message: " + data.error.message);
                                returnData({});
                            }
                            else {
                                //Grabs post from FB based for default
                                dataObj['data'] = data.data;
                                Util.basicUtil.consoleLog("Facbook's placeData", true);
                                returnData(dataObj);
                            }
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
                    fetch(`https://graph.facebook.com/me?access_token=${token}&fields=email`)
                    .then(response => response.json())
                    .then(async data => {
                        const credential = firebase.auth.FacebookAuthProvider.credential(token);
                        await firebase.auth().signInWithCredential(credential)
                        .catch((error) => { 
                            Util.basicUtil.consoleLog("Facbook's login", false);
                            Util.basicUtil.Alert('Facebook Login Error', error.message, null);
                        });
                        dataObj['data'] = firebase.auth().currentUser;
                        Util.asyncStorage.SetAsyncStorageVar('FBToken', token);
                        Util.basicUtil.consoleLog("Facbook's login", true);
                        callBack(dataObj);
                    })
                    .catch((error) => {
                        Util.basicUtil.consoleLog("Facbook's login", false);
                        Util.basicUtil.Alert('Facebook Login Error', error.message, null);
                    });
                  } else {
                    // type === 'cancel'
                  }
                } catch ({ message }) {
                  Util.basicUtil.consoleLog("Facbook's login", false);
                  Util.basicUtil.Alert('Facebook Login Error', message, null);
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
                            dataObj = data['data'];
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
                        fetch("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=bars&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry,user_ratings_total,place_id&locationbias=circle:8000&key=" + GOOGLE_API_KEY)
                        .then(response => response.json())
                        .then(async data => {
                            dataObj['data'] = data;
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
                            Util.basicUtil.Alert('Google Login Error', error.message, null);
                        });
                        dataObj['user'] = firebase.auth().currentUser;
                        dataObj['data'] = firebase.auth();
                        Util.basicUtil.consoleLog("Google's login", true);
                        callBack(dataObj);
                    }
                    else{
                        //Handles cancel
                    }
                } 
                catch ({ message }) {
                    Util.basicUtil.consoleLog("Google's login", false);
                    Util.basicUtil.Alert('Google Login Error', message, null);
                }
            }
        },
        Nife: {
            login: async function (signUpInfo, loginInfo, callBack) {
                let dataObj = {};
                // Listen for authentication state to change.
                if(signUpInfo) {
                    if(!signUpInfo.businessEmail){
                       try {
                            let email = signUpInfo.email;
                            let password = signUpInfo.password1
                            firebase.auth().createUserWithEmailAndPassword(email, password)
                            .catch(function(error) {
                                Util.basicUtil.consoleLog("Nife's sign-up", false);
                                Util.basicUtil.Alert('Nife Business Sign-Up Error', error.message, null);
                            });
                            dataObj['data'] = firebase.auth().currentUser;
                            dataObj['token'] = null;
                            dataObj['user'] = firebase.auth().currentUser;
                            Util.basicUtil.consoleLog("Nife's Business sign-up", true);
                            callBack(dataObj);
                        } catch ({ message }) {
                            Util.basicUtil.consoleLog("Nife's Business sign-up", false);
                            Util.basicUtil.Alert('Nife Business Sign-Up Error', message, null);
                        } 
                    }
                    else {
                        try {
                            let email = signUpInfo.businessEmail;
                            let password = signUpInfo.password1
                            firebase.auth().createUserWithEmailAndPassword(email, password)
                            .catch(function(error) {
                                Util.basicUtil.consoleLog("Nife's User sign-up", false);
                                Util.basicUtil.Alert('Nife Sign-Up Error', error.message, null);
                            });
                            dataObj['data'] = firebase.auth().currentUser;
                            dataObj['token'] = null;
                            dataObj['user'] = firebase.auth().currentUser;
                            Util.basicUtil.consoleLog("Nife's User sign-up", true);
                            callBack(dataObj);
                        } catch ({ message }) {
                            Util.basicUtil.consoleLog("Nife's User sign-up", false);
                            Util.basicUtil.Alert('Nife Sign-Up Error', message, null);
                        } 
                    }
                }
                else {
                    try {
                        let email = loginInfo.email;
                        let password = loginInfo.password1
                        firebase.auth().signInWithEmailAndPassword(email, password)
                        .catch(function(error) {
                            Util.basicUtil.consoleLog("Nife's login", false);
                            Util.basicUtil.Alert('Nife Login Error', error.message, null);
                        });
                        dataObj['data'] = firebase.auth().currentUser;
                        dataObj['token'] = null;
                        dataObj['user'] = firebase.auth().currentUser;
                        Util.basicUtil.consoleLog("Nife's login", true);
                        callBack(dataObj);
                    } catch ({ message }) {
                        Util.basicUtil.consoleLog("Nife's login", false);
                        Util.basicUtil.Alert('Nife Login Error', message, null);
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
                    let friends = friendData;
                    let bars = response.businesses;
                    var friendArr = [];
                    var currentlyCheckIn = [];
                    if(friends.length > 0) {
                        bars.forEach((bar, index) => {
                            friends.forEach((friend) => {
                                if( (friend.checkIn) && (friend.checkIn.buisnessUID == bar.id) && (friend.checkIn.privacy != "Private") ) {
                                    currentlyCheckIn.push(friend);
                                }
                                if((friend.lastVisited) && (friend.lastVisited[bar.id]) &&  (friend.lastVisited[bar.id].privacy != "Private") && (!currentlyCheckIn.includes(friend))){
                                    friendArr.push(friend);
                                }
                            });
                            response.businesses[index].lastVisitedBy = friendArr;
                            response.businesses[index].currentlyCheckIn = currentlyCheckIn;
                        });
                    }
                    Util.basicUtil.consoleLog("Yelp's placeData", true);
                    returnData(response.businesses);
                })
                .catch((err) => {
                    Util.basicUtil.consoleLog("Yelp's placeData", false);
                    Util.basicUtil.Alert('Map Business Data Error (API Y PlaceData)', err.message, null);
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
            } ,
            businessVerification: (name, address, city, state, zip, country, callback) =>{
                fetch("https://api.yelp.com/v3/businesses/matches?match_threshold=default&name="+name+"&address1=" + address + "&city="+ city + "&state=" + state + "&zip=" + zip + "&country="+ country, 
                    {headers: new Headers({'Authorization':"Bearer "+ YELP_PLACE_KEY})
                })
                .then((data) => data.json())
                .then((response) => {
                    
                    Util.basicUtil.consoleLog("businessPhoneVerification", true);
                    callback(response);
                })
                .catch((err) => {
                    Util.basicUtil.consoleLog("businessPhoneVerification", false);
                    Util.basicUtil.Alert('Business Verification Error (API Y Businesses)', err.message, null);
                });
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
            },
            signOut: async()=>{
                firebase.auth().signOut();
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
        },
        compareValues: (key, order = 'asc') => {
            return function innerSort(a, b) {
                if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                // property doesn't exist on either object
                return 0;
                }
            
                const varA = (typeof a[key] === 'string')
                ? a[key].toUpperCase() : a[key];
                const varB = (typeof b[key] === 'string')
                ? b[key].toUpperCase() : b[key];
            
                let comparison = 0;
                if (varA > varB) {
                comparison = 1;
                } else if (varA < varB) {
                comparison = -1;
                }
                return (
                (order === 'desc') ? (comparison * -1) : comparison
                );
            };
        },
        Alert: (title, message, okFunction) => {
            Alert.alert(
                title,
                message,
                [
                  { 
                    text: "OK", 
                    onPress: okFunction ? okFunction() : () => {}
                  }
                ],
                { cancelable: false }
              );
        }
    }
}

export default Util;