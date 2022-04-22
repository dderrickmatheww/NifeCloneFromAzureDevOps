import { Alert } from 'react-native';
import {
    YELP_PLACE_KEY,
    ClientKey,
    AndroidClientKey,
    IOSClientKeyStandAlone,
    IOSClientKey,
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
    photoUrlToken
} from 'react-native-dotenv';
import * as Google from 'expo-google-app-auth';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { isPointWithinRadius, getDistance } from 'geolib';
import * as ImagePicker from 'expo-image-picker';
import * as Constants from "expo-device";
import * as Notifications from "expo-notifications";
import uuid from 'react-native-uuid';

// const YELP_PLACE_KEY = process.env.YelpApiKey,
//     ClientKey = process.env.GoogleAndroidStandAloneClientKey,
//     AndroidClientKey = process.env.GoogleAndroidClientKey,
//     IOSClientKeyStandAlone = process.env.GoogleiOSStandAloneClientKey,
//     IOSClientKey = process.env.GoogleiOSClientKey,
//     apiKey = process.env.GoogleApiKey,
//     authDomain = process.env.FirebaseAuthDomain,
//     databaseURL = process.env.FirebaseDBURL,
//     projectId = process.env.FirebaseProjectId,
//     storageBucket = process.env.FirebaseStorageBucket,
//     messagingSenderId = process.env.FirebaseMessagingSenderId,
//     appId = process.env.FirebaseAppId,
//     measurementId = process.env.FirebaseMeasurementId,
//     photoUrlToken = process.env.FirebasePhotoToken

const Util = {
    friends: {
        GetFriends: function (email, callback) {
            let obj = {
                email: email
            }
            let userEmail = firebase.auth().currentUser.email;
            if (email) {
                fetch('https://us-central1-nife-75d60.cloudfunctions.net/getFriends',
                    {
                        method: 'POST',
                        body: JSON.stringify(obj)
                    })
                    .then(response => response.json())
                    .then(async data => {
                        if (callback) {
                            callback(data.result, userEmail);
                        }
                        logger('GetFriends', true);
                    }).catch((error) => {
                    alert('Function GetFriends - Error message:', error.message, null);
                    logger('GetFriends', false);
                });
            }
        },
        FilterFriends: (obj, callback) => {
            if (obj) {
                fetch('https://us-central1-nife-75d60.cloudfunctions.net/filterFriends',
                    {
                        method: 'POST',
                        body: JSON.stringify(obj)
                    })
                    .then(response => response.json())
                    .then(async data => {
                        if (callback) {
                            callback(data.result);
                        }
                        logger('FilterFriends', true);
                    }).catch((error) => {
                    alert('Function FilterFriends - Error message:', error.message, null);
                    logger('FilterFriends', false);
                });
            }
        },
        AddFriend: function (friendEmail, callback) {
            try {
                let userEmail = firebase.auth().currentUser.email;
                let updateUserObj = {
                    friends: {}
                }
                // User that requested the friend
                updateUserObj.friends[friendEmail] = true;
                Util.user.UpdateUser(userEmail, updateUserObj, () => {
                    logger("AddFriend", true);
                    let updateFriendObj = {
                        friends: {}
                    }
                    // User that will have a friend request
                    updateFriendObj.friends[userEmail] = null;
                    Util.user.UpdateUser(friendEmail, updateFriendObj, () => {
                        Util.user.sendFriendReqNotification(firebase.auth().currentUser.displayName, friendEmail, () => {
                            logger("sendFriendReqNotification", true);
                        })
                        logger("AddFriend", true);
                    });
                });
                if (callback) {
                    callback();
                }
            } catch (error) {
                logger("AddFriend", false);
                alert('Function: AddFriend - Error message: ', error.message, null);
            }
        },
        sendFriendRequest: function (friendEmail, callback) {
            try {
                let userEmail = firebase.auth().currentUser.email;
                let friendUpdateObj = {
                    requests: {}
                }
                // User that requested the friend
                friendUpdateObj.requests[friendEmail] = true;
                Util.user.UpdateUser(userEmail, friendUpdateObj, () => {
                    if (callback) {
                        callback();
                    }
                });

            } catch (error) {
                logger("sendFriendRequest", false);
                alert('Function: sendFriendRequest - Error message: ', error.message, null);
            }
        },
        handleFriendRequest: function (friendEmail, answer, callback) {
            try {
                let updateObj = {
                    friends: {}
                }
                let friendUpdateObj = {
                    friends: {},
                    requests: {}
                }
                updateObj.friends[friendEmail] = answer;
                friendUpdateObj.friends[firebase.auth().currentUser.email] = answer;

                friendUpdateObj.requests[firebase.auth().currentUser.email] = false;
                Util.user.UpdateUser(friendEmail, friendUpdateObj, () => {
                    Util.user.UpdateUser(firebase.auth().currentUser.email, updateObj, () => {
                        if (callback)
                            callback();
                    });
                });
            } catch (error) {
                logger("handleFriendRequest", false);
                alert('Function: handleFriendRequest - Error message: ', error.message, null);
            }
        },
    },
    user: {
        VerifyUser: async (user, email, business,callback) => {
            let obj = {
                user: user,
                email: email,
                business: business ? business : null,
            };
            if (user && email) {
                await fetch('https://us-central1-nife-75d60.cloudfunctions.net/verifyUser',
                    {
                        method: 'POST',
                        body: JSON.stringify(obj)
                    })
                    .then(response => response.json())
                    .then(async data => {
                        if (data.error) {
                            alert('Function VerifyUser - Error message:', data.error, null);
                            logger('VerifyUser', false);
                            return false;
                        }
                        if (callback) {
                            callback(data.result);
                        }
                        logger('VerifyUser', true);
                    }).catch((error) => {
                        alert('Function VerifyUser - Error message:', error.message, null);
                        logger('VerifyUser', false);
                    });
            }
        },
        IsFriend: (userData, friendEmail, callback) => {
            let boolean;
            if (userData.friends[friendEmail] == true || userData.requests[friendEmail] == true) {
                boolean = true;
            } else {
                boolean = false;
            }
            if (callback) {
                callback(boolean);
            }
        },
        CheckLoginStatus: (callback) => {
            let isLoggedIn = firebase.auth().currentUser ? true : false;
            if (callback) {
                callback(isLoggedIn);
            }
        },
        HandleUploadImage: (isBusiness, userData, callback, isStatusImage) => {
            let userEmail = firebase.auth().currentUser.email;
            ImagePicker.getMediaLibraryPermissionsAsync()
                .then((result) => {
                    if (result.status == "granted") {
                        ImagePicker.launchImageLibraryAsync()
                            .then((image) => {
                                let uri = image.uri;
                                Util.user.UploadImage(uri, userEmail, (resUri) => {

                                    if (!isStatusImage) {
                                        userData['photoSource'] = resUri;
                                        Util.user.UpdateUser(userEmail, {photoSource: resUri});
                                    }
                                    if (isBusiness) {
                                        Util.user.UpdateUser(userEmail, {photoSource: resUri});
                                        Util.business.UpdateUser(userEmail, {photoSource: resUri});
                                        Util.business.UpdateUser(userEmail, {data: {image_url: resUri}});
                                    }
                                    if (callback) {
                                        callback(resUri);
                                    }
                                }, null, isStatusImage);
                            });
                    } else {
                        ImagePicker.requestMediaLibraryPermissionsAsync()
                            .then((result) => {
                                if (result.status == "granted") {
                                    ImagePicker.launchImageLibraryAsync()
                                        .then((image) => {
                                            let uri = image.uri;
                                            Util.user.UploadImage(uri, userEmail, (resUri) => {
                                                if (!isStatusImage) {
                                                    userData['photoSource'] = resUri;
                                                    Util.user.UpdateUser(userEmail, {photoSource: resUri});
                                                }
                                                if (userData.isBusiness) {
                                                    Util.business.UpdateUser(userEmail, {photoSource: resUri});
                                                }
                                                if (callback) {
                                                    callback(resUri);
                                                }
                                            }, null, isStatusImage);
                                        });
                                }
                            });
                    }
                });
        },
        CheckAuthStatus: async (callback) => {
            try {
                firebase.auth().onAuthStateChanged((user) => {
                    if (callback) {
                        callback(user);
                    }
                });
            } catch (error) {
                alert('Function CheckAuthStatus - Error message:', error, null);
                logger('CheckAuthStatus', false);
            }
        },
        GetUserData: async (email, callback) => {
            let obj = {
                email: email
            }
            if (email && typeof obj.email !== 'undefined') {
                await fetch('https://us-central1-nife-75d60.cloudfunctions.net/getUserData',
                    {
                        method: 'POST',
                        body: JSON.stringify(obj)
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            alert('Function GetUserData - Error message:', data.error, null);
                            logger('GetUserData', false);
                            return false;
                        }
                        if (callback) {
                            callback(data.result);
                        }
                        logger('GetUserData', true);
                    })
                    .catch((error) => {
                        alert('Function GetUserData - Error message:', error.message, null);
                        logger('GetUserData', false);
                    });
            }
        },
        getFeed: async (obj, callback) => {
            if (obj && typeof obj.email !== 'undefined') {
                obj['take'] = obj.take ? obj.take : 50;
                obj['skip'] = obj.skip ? obj.skip : 0;
                obj['getUserFeed'] = obj.getUserFeed ? obj.getUserFeed : false;
                await fetch('https://us-central1-nife-75d60.cloudfunctions.net/getUserFeed',
                {
                    method: 'POST',
                    body: JSON.stringify(obj)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert('Function getFeed - Error message:', data.error, null);
                        logger('getFeed', false);
                        return false;
                    }
                    if (callback) {
                        callback(data.result);
                    }
                    logger('getFeed', true);
                })
                .catch((error) => {
                    alert('Function getFeed - Error message:', error.message, null);
                    logger('getFeed', false);
                });
            }
        },
        UpdateUser: (email, updateObject, callback) => {
            let db = firebase.firestore();
            
            let userRef = db.collection('users').doc(email);
            if (typeof updateObject !== 'undefined') {
                userRef.set(updateObject, { merge: true })
                .then(() => {
                    logger('UpdateUser', true);
                    if (callback) {
                        callback();
                    }
                })
                .catch((error) => {
                    logger('UpdateUser', false);
                    alert('Function UpdateUser - Error message:', error.message, null);
                });
            }
        },
        UpdateFeed: async (email, updateObject, callback) => {
            let db = firebase.firestore();
            let userRef = db.collection('feed').doc(email);
            let userFeed = await userRef.get();
            updateObject['uid'] = uuid.v4();
            let data = userFeed.data();
            Util.location.GetUserLocation((userLocation) => { 
                if (typeof updateObject !== 'undefined' && data) {
                    updateObject['location'] = userLocation;
                    if (data.timeline) {
                        data.timeline.push(updateObject);
                        userRef.set(data, { merge: true })
                        .then(() => {
                            logger('UpdateFeed', true);
                            if (callback) {
                                callback(data);
                            }
                        })
                        .catch((error) => {
                            logger('UpdateFeed', false);
                            alert('Function UpdateFeed - Error message:', error.message, null);
                        });
                    }
                    else {
                        data['timeline'] = [];
                        data.timeline.push(updateObject);
                        userRef.set(data, { merge: true })
                        .then(() => {
                            logger('UpdateFeed', true);
                            if (callback) {
                                callback();
                            }
                        })
                        .catch((error) => {
                            logger('UpdateFeed', false);
                            alert('Function UpdateFeed - Error message:', error.message, null);
                        });
                    }
                }
                else {
                    var userFeedStatus = {
                        checkIn: {},
                        lastVisited: {},
                        timeline: [],
                        isBusiness: updateObject.isBusiness,
                    }
                    updateObject['location'] = userLocation;
                    userFeedStatus.timeline.push(updateObject);
                    userRef.set(userFeedStatus)
                    .then(() => {
                        logger('UpdateUser', true);
                        if (callback) {
                            callback();
                        }
                    })
                    .catch((error) => {
                        logger('UpdateFeed', false);
                        alert('Function UpdateFeed - Error message:', error.message, null);
                    });
                }   
            });
        },
        CheckIn: async (checkInObj, callback) => {
            let db = firebase.firestore();
            let feed = db.collection('feed');
            let setLoc = feed.doc(checkInObj.email);
            let data = (await setLoc.get()).data();
            const { 
                latAndLong, 
                privacy,
                barName,
                phone,
                address,
                image,
                userImage,
                displayName,
                buisnessUID,
                email
            } = checkInObj;
            let lastVisited = {};
            lastVisited[buisnessUID] = {
                checkInTime: new Date(),
                latAndLong,
                privacy,
                name: barName,
                phone,
                address,
                barPhoto: image,
                image: userImage,
                uid: uuid.v4(),
                username: displayName
            }
            if (!data) {
                feed.doc(email).set({
                    checkIn: {
                        checkInTime: new Date(),
                        latAndLong,
                        buisnessUID,
                        privacy,
                        name: barName,
                        phone,
                        address,
                        barPhoto: image,
                        image: userImage,
                        uid: uuid.v4(),
                        username: displayName
                    },
                    lastVisited
                })
                .then(() => {
                    logger('CheckIn', true);
                    if (callback) {
                        callback('true');
                    }
                })
                .catch((error) => {
                    logger('CheckIn', false);
                    alert('Function CheckIn - Error message:', error.message, null);
                });
            }
            else {
                setLoc.set({
                    checkIn: {
                        checkInTime: new Date(),
                        latAndLong,
                        buisnessUID,
                        privacy,
                        name: barName,
                        phone,
                        address,
                        barPhoto: image,
                        image: userImage,
                        uid: uuid.v4(),
                        username: displayName
                    },
                    lastVisited
                },
                {
                    merge: true
                })
                .then(() => {
                    logger('CheckIn', true);
                    if (callback) {
                        callback('true');
                    }
                })
                .catch((error) => {
                    logger('CheckIn', false);
                    alert('Function CheckIn - Error message:', error.message, null);
                });
            }
        },
        CheckOut: async (email, callback) => {
            let db = firebase.firestore();
            let setLoc = await db.collection('feed').doc(email);
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
                    }
                },
                {
                    merge: true
                })
                .then(() => {
                    logger('CheckOut', true);
                    if (callback) {
                        callback('false');
                    }
                })
                .catch((error) => {
                    logger('CheckOut', false);
                    alert('Function CheckOut - Error message:', error.message, null);
                });
        },
        IsUserCheckedIn: (email, buisnessUID, callback) => {
            try {
                Util.user.getFeed({ email, getUserFeed: true }, (userData) => {
                    let user = userData.filter(x => (x.checkedIn && x.checkedIn === true) && (x.businessUID == buisnessUID));
                    if (user.length > 0) {
                        if (callback) {
                            callback("true");
                        }
                    }
                    else {
                        if (callback) {
                            callback("false");
                        }
                    }
                });
                logger('IsUserCheckedIn', true);
            } catch (error) {
                logger('IsUserCheckedIn', false);
                alert('Function IsUserCheckedIn - Error message:', error.message, null);
            }
        },
        setFavorite: async (user, buisnessUID, boolean, buisnessName, callback) => {
            let db = firebase.firestore();
            let setLoc = db.collection('users').doc(user.email);
            let userData = await setLoc.get();
            let oldFavorites = user.favoritePlaces ? user.favoritePlaces : {};
            let userObj = userData.data();
            if (typeof userObj.favoritePlaces !== 'undefined' && Object.keys(userData.data().favoritePlaces).length > 10) {
                if (callback) {
                    callback(false, true);
                }
            } else {
                if (boolean) {
                    let favoritePlaces = oldFavorites;
                    favoritePlaces[buisnessUID] = {
                        favorited: true,
                        name: buisnessName
                    }
                    setLoc.set({
                            favoritePlaces: favoritePlaces
                        },
                        {
                            merge: true
                        })
                        .then(() => {
                            logger('setFavorite', true);
                            if (callback) {
                                callback(true, false);
                            }
                        })
                        .catch((error) => {
                            logger('setFavorite', false);
                            alert('Function setFavorite - Error message:', error.message, null);
                        });
                } else {
                    // Remove the 'capital' field from the document
                    let favoritePlaces = oldFavorites;
                    favoritePlaces[buisnessUID] = {
                        favorited: false,
                    }
                    setLoc.update({
                        favoritePlaces: favoritePlaces
                    })
                        .then(() => {
                            logger('setFavorite', true);
                            if (callback) {
                                callback(false, false);
                            }
                        })
                        .catch((error) => {
                            logger('setFavorite', false);
                            alert('Function setFavorite - Error message:', error.message, null);
                        });
                }
            }
        },
        isFavorited: async (buisnessUID, userData, callback) => {
            if (userData) {
                if (userData.favoritePlaces) {
                    let favorites = userData.favoritePlaces;
                    if (favorites[buisnessUID]) {
                        if (callback) {
                            callback(favorites[buisnessUID].favorited);
                        }
                    } else {
                        if (callback) {
                            callback(false);
                        }
                    }
                } else {
                    if (callback) {
                        callback(false);
                    }
                }
            } else {
                alert('Function isFavorited - Error message:', 'No User Data Found', null);
                if (callback) {
                    callback(false);
                }
            }
        },
        QueryPublicUsers: function (query, take, callback) {
            let newQuery = query.toLowerCase();
            var path = new firebase.firestore.FieldPath('privacySettings', "searchPrivacy");
            let db = firebase.firestore();
            let usersRef = db.collection('users').where(path, '==', false);
            usersRef.get()
                .then((data) => {
                    if (data) {
                        let queriedUsers = [];
                        let wantedUsers = [];
                        data.forEach((user) => {
                            queriedUsers.push(user.data());
                        });
                        if (queriedUsers.length > 0) {
                            queriedUsers.forEach((user) => {
                                let qUserEmail = user.email.toLowerCase();
                                let qUserEmailRefined = qUserEmail.split('@')[0];
                                let qUserName = user.displayName.toLowerCase();
                                if ((qUserEmail == newQuery || qUserName.includes(newQuery) || qUserEmailRefined.includes(newQuery)) && user.email != firebase.auth().currentUser.email) {
                                    wantedUsers.push(user);
                                }
                            });
                            logger('QueryUsers', true);
                            if (callback) {
                                callback(wantedUsers);
                            }
                        } else {
                            logger('QueryUsers just no users', true);
                            if (callback) {
                                callback([]);
                            }
                        }
                    } else {
                        logger('QueryUsers', false);
                    }
                })
                .catch((error) => {
                    logger('QueryUsers', false);
                    alert('Function QueryPublicUsers - Error message:', error.message, null);
                });
        },
        GenerateQRCode: (userEmail) => {
            let email = encodeURI(userEmail);
            let QRSource = "http://api.qrserver.com/v1/create-qr-code/?data=" + email + "&size=500x500&bgcolor=301E48&color=F1BF42"
            return QRSource;
        },
        UploadImage: async (uri, email, callback, isProof, isStatusImage) => {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });

            let ref;
            if (!isStatusImage) {
                ref = firebase.storage().ref().child(!isProof ? email : email);
            } else {
                ref = firebase.storage().ref().child(email + '/status/' + uuid.v4())
            }

            const snapshot = await ref.put(blob);
            // We're done with the blob, close and release it
            blob.close();
            let image = await snapshot.ref.getDownloadURL();
            if (callback) {
                callback(image);
            }
        },
        registerForPushNotificationsAsync: async (cb) => {
            if (Constants.isDevice) {
                const {status: existingStatus} = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const {status} = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    alert('Failed to get push token for push notification!');
                    return;
                }
                const token = (await Notifications.getExpoPushTokenAsync()).data;
                cb({expoPushToken: token});
            } else {
                alert('Must use physical device for Push Notifications');
            }

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
        },
        sendFriendReqNotification: async (userName, friendEmail, callback) => {
            let obj = {
                user: userName,
                friendEmail: friendEmail
            };
            if (userName && friendEmail) {
                await fetch('https://us-central1-nife-75d60.cloudfunctions.net/sendFriendRequestNotification',
                    {
                        method: 'POST',
                        body: JSON.stringify(obj)
                    })
                    .then(response => response.json())
                    .then(async data => {
                        if (callback) {
                            callback(data.result);
                        }
                        logger('VerifyUser', true);
                    }).catch((error) => {
                        alert('Function VerifyUser - Error message:', error.message, null);
                        logger('VerifyUser', false);
                    });
            }
        }
    },
    business: {
        UploadAddressProof: async (uri, email, callback) => {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    alert('Function UploadAddressProof - Error message:', e.message, null);
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });

            const ref = firebase
                .storage()
                .ref()
                .child(email + " address proof");
            const snapshot = await ref.put(blob);

            // We're done with the blob, close and release it
            blob.close();
            let image = await snapshot.ref.getDownloadURL();
            if (callback) {
                callback(image);
            }
        },
        VerifyUser: (user, email, signUpState, callback) => {
            let db = firebase.firestore();
            db.collection('users').doc(email).get()
                .then((data) => {
                    if (data.data()) {
                        let dbUser = data.data();
                        logger('businessesVerifyUser', true);
                        if (callback) {
                            callback(dbUser);
                        }
                    } else {
                        if (user != undefined || user != null) {
                            let userObj = Util.business.BuildBusinessSchema(user.providerData[0], signUpState, false);
                            db.collection('users').doc(email).set(userObj, {merge: true});
                            let businessObj = Util.business.BuildBusinessSchema(user.providerData[0], signUpState, true);
                            db.collection('businesses').doc(email).set(businessObj, {merge: true});
                            if (callback) {
                                callback(userObj);
                            }
                        }
                    }
                })
                .catch((err) => {
                    logger('Businesses - VerifyUser', false);
                    alert('Function Businesses - VerifyUser - Error message:', err.message, null);
                })
        },
        BuildBusinessSchema: (obj, signUpState, isBusinessTable) => {
            let userObj = {};
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
                displayName: obj.displayName,
                email: obj.email,
                phoneNumber: obj.phoneNumber,
                photoSource: obj.photoURL,
                providerId: obj.providerId,
                uid: obj.uid,
            }
            if (isBusinessTable) {
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
            userObj['privacySettings'] = {public: true};
            return userObj;
        },
        GetBusinessData: (callback) => {
            let obj = {
                email: firebase.auth().currentUser.email
            };
            if (email) {
                fetch('https://us-central1-nife-75d60.cloudfunctions.net/getBusinessData',
                    {
                        method: 'POST',
                        body: JSON.stringify(obj)
                    })
                    .then(response => response.json())
                    .then(async data => {
                        if (callback) {
                            callback(data.result);
                        }
                        logger('GetBusinessData', true);
                    }).catch((error) => {
                    logger('GetBusinessData', false);
                    alert('Function GetBusinessData - Error message:', error.message, null);
                });
            }
        },
        UpdateUser: (email, updateObject, callback) => {
            let db = firebase.firestore();
            let userRef = db.collection('businesses').doc(email);
            userRef.set(updateObject, { merge: true })
                .then(() => {
                    logger('Updatebusinesses', true);
                    if (callback) {
                        callback();
                    }
                })
                .catch((error) => {
                    logger('Updatebusinesses', false);
                    alert('Function Updatebusinesses - Error message:', error.message, null);
                });
        },
        GetBusinessesByUserFavorites: (favArr, callback) => {
            let obj = {
                favArr: favArr
            };
            if (favArr) {
                fetch('https://us-central1-nife-75d60.cloudfunctions.net/saveLocation',
                    {
                        method: 'POST',
                        body: JSON.stringify(obj)
                    })
                    .then(response => response.json())
                    .then(async data => {
                        if (callback) {
                            callback(data.result);
                        }
                        logger('GetBusinessesByUserFavorites', true);
                    }).catch((error) => {
                    logger('GetBusinessesByUserFavorites', false);
                    alert('Function GetBusinessesByUserFavorites - Error message:', error.message, null);
                });
            }
        },
        GetBusinessByUID: async (uid, callback) => {
            try {
                let busRef = firebase.firestore().collection('businesses');
                const snapshot = await busRef.where('businessId', "==", uid).get();
                if (!snapshot.empty) {
                    let tempArr = [];
                    snapshot.forEach((doc) => {
                        tempArr.push(doc.data())
                    })
                    if (callback) {
                        callback(tempArr[0]);
                    }

                } else {
                    if (callback) {
                        callback(false);
                    }
                }
                logger("GetBusinessByUID", true);
            } catch (error) {
                alert('Function GetBusinessByUID - Error message:', error.message, null);
                logger("GetBusinessByUID", false);
                if (callback) {
                    callback(false);
                }
            }
        },
        GetFavoriteCount: (uid, callback) => {
            let path = new firebase.firestore.FieldPath('favoritePlaces', uid, 'favorited');
            let db = firebase.firestore();
            db.collection('users').where(path, '==', true).get()
                .then((data) => {
                    if (data) {
                        let tempArr = [];
                        data.forEach((item) => {
                            tempArr.push(item.data());
                        });
                        if (callback) {
                            callback(tempArr.length);
                        }
                        logger("Favorite Count ", true);
                    } else {
                        if (callback) {
                            callback(0);
                        }
                        logger("Favorite Count ", true);
                    }
                })
                .catch((error) => {
                    alert('Function GetFavoriteCount - Error message:', error.message, null);
                    logger("Favorite Count ", false);
                });
        },
        SendProofEmail: async (email, image) => {
            let obj = {
                image: image,
                email: email
            };
            if (email && image) {
                fetch('https://us-central1-nife-75d60.cloudfunctions.net/sendVerificationEmail',
                    {
                        method: 'POST',
                        body: JSON.stringify(obj)
                    })
                    .then(response => response.json())
                    .then(() => {
                        logger('SendProofEmail', true);
                    })
                    .catch((error) => {
                        alert('Function SendProofEmail - Error message:', error.message, null);
                        logger("SendProofEmail", false);
                    })
            }
        },
        getNifeBusinessesNearby: async (user, cb) => {
            let obj = {
                user: user
            }
            if (user && typeof obj.user !== 'undefined') {
                if (!user.loginLocation) {
                    Util.location.GetUserLocation(async () => {
                        await fetch('https://us-central1-nife-75d60.cloudfunctions.net/getNifeBusinessesNearby',
                        {
                            method: 'POST',
                            body: JSON.stringify(obj)
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (cb) {
                                cb(data.result);
                            }
                            logger('getNifeBusinessesNearby', true);
                        })
                        .catch((error) => {
                            alert('Function getNifeBusinessesNearby - Error message:', error.message, null);
                            logger('getNifeBusinessesNearby', false);
                        });
                    }, user);
                }
                else {
                    await fetch('https://us-central1-nife-75d60.cloudfunctions.net/getNifeBusinessesNearby',
                    {
                        method: 'POST',
                        body: JSON.stringify(obj)
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (cb) {
                            cb(data.result);
                        }
                        logger('getNifeBusinessesNearby', true);
                    })
                    .catch((error) => {
                        alert('Function getNifeBusinessesNearby - Error message:', error.message, null);
                        logger('getNifeBusinessesNearby', false);
                    });
                }  
            }
        }

    },
    location: {
        SaveLocation: function (email, location, callback) {
            let obj = {
                location: location,
                email: email
            };
            if (email && location) {
                fetch('https://us-central1-nife-75d60.cloudfunctions.net/saveLocation',
                    {
                        method: 'POST',
                        body: JSON.stringify(obj)
                    })
                    .then(response => response.json())
                    .then(async data => {
                        if (callback) {
                            callback(data.result);
                        }
                        logger('SaveLocation', true);
                    }).catch((error) => {
                    logger('SaveLocation', false);
                    alert('Function SaveLocation - Error message:', error.message, null);
                });
            }
        },
        GetUserLocation: (returnData, user) => {
            Location.getCurrentPositionAsync({enableHighAccuracy: true}).then((location) => {
                Location.reverseGeocodeAsync(location.coords).then((region) => {
                    let loc = location;
                    loc['region'] = region[0];
                    if (user) {
                        Util.location.SaveLocation(user.email, location);
                    }
                    logger('GetUserLocation', true);
                    if (returnData) {
                        returnData(loc, region);
                    }
                })
                    .catch((error) => {
                        logger('GetUserLocation', false);
                        alert('Function GetUserLocation > ReverseGeocode - Error message:', error.message, null);
                    });
            })
                .catch((error) => {
                    logger('GetUserLocation', false);
                    alert('Function GetUserLocation - Error message:', error.message, null);
                });
        },
        GrabWhatsPoppinFeed: async (query, email, returnData) => {
            if (!query) {
                Util.location.GetUserLocation((userLocation) => {
                    let obj = {
                        userLocation: userLocation
                    }
                    fetch('https://us-central1-nife-75d60.cloudfunctions.net/whatsPoppinFeed',
                    {
                        method: 'POST',
                        body: JSON.stringify(obj)
                    })
                    .then(response => response.json())
                    .then(data => {
                        returnData(data.result);
                        logger('GrabWhatsPoppinFeed', true);
                    }).catch((error) => {
                        alert('Function GrabWhatsPoppinFeed - Error message:', error.message, null);
                        logger('GrabWhatsPoppinFeed', false);
                    });
                });
            }
        },
        checkUserCheckInCount: async (buisnessUID, userLocation, returnData) => {
            let obj;
            obj = {
                buisnessUID: buisnessUID,
                userLocation: userLocation
            }
            if (userLocation) {
                fetch('https://us-central1-nife-75d60.cloudfunctions.net/checkInForBuisness',
                    {
                        method: 'POST',
                        body: JSON.stringify(obj)
                    })
                    .then(response => response.json())
                    .then(async data => {
                        returnData(data.result);
                        logger('checkUserCheckInCount', true);
                    }).catch((error) => {
                    alert('Function checkUserCheckInCount - Error message:', error.message, null);
                    logger('checkUserCheckInCount', false);
                });
            }
        },
        IsWithinRadius: (checkIn, userLocation, boolean) => {
            let withinRadius;
            let checkInLat = parseInt(checkIn.latAndLong.split(',')[0]);
            let checkInLong = parseInt(checkIn.latAndLong.split(',')[1]);
            let userLat = parseInt(userLocation.coords.latitude);
            let userLong = parseInt(userLocation.coords.longitude);
            if (boolean) {
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
            } else {
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
            try {
                let seconds = Math.floor((new Date() - date) / 1000);
                let interval = Math.floor(seconds / 31536000);
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
            } catch (error) {
                logger('TimeSince', false);
                alert('Function TimeSince - Error message:', e.message, null);
            }
        }
    },
    dataCalls: {
        Google: {

        },
        Nife: {
            login: async function ({email, password}, loginInfo, callback) {
                let dataObj = {};
                // Listen for authentication state to change.
                if (signUpInfo) {
                        try {
                            firebase.auth().createUserWithEmailAndPassword(email, password)
                                .catch(function (error) {
                                    logger("Nife's sign-up", false);
                                    alert('Nife User Sign-Up Error', error.message, null);
                                });
                            dataObj['data'] = firebase.auth().currentUser;
                            dataObj['token'] = null;
                            dataObj['user'] = firebase.auth().currentUser;
                            logger("Nife's User sign-up", true);
                            if (callback) {
                                callback(dataObj);
                            }
                        } catch ({message}) {
                            logger("Nife's User sign-up", false);
                            alert('Nife User Sign-Up Error', message, null);
                        }
                }

        },
        Yelp: {
            placeData: (baseUrl, params, friendData, returnData) => {
                fetch(baseUrl + params,
                    {
                        headers: new Headers({'Authorization': "Bearer " + YELP_PLACE_KEY})
                    }
                )
                    .then((data) => data.json())
                    .then((response) => {
                        let friends = friendData;
                        let bars = response.businesses;
                        var friendArr = [];
                        var currentlyCheckIn = [];
                        if (typeof bars !== 'undefined' && bars.length > 0) {
                            bars.forEach(async (bar, index) => {
                                if (friends && friends.length > 0) {
                                    friends.forEach((friend) => {
                                        if ((friend.checkIn) && (friend.checkIn.buisnessUID == bar.id) && (friend.checkIn.privacy != "Private")) {
                                            currentlyCheckIn.push(friend);
                                        }
                                        if ((friend.lastVisited) && (friend.lastVisited[bar.id]) && (friend.lastVisited[bar.id].privacy != "Private") && (!currentlyCheckIn.includes(friend))) {
                                            friendArr.push(friend);
                                        }
                                    });
                                }
                                response.businesses[index].lastVisitedBy = friendArr;
                                response.businesses[index].currentlyCheckIn = currentlyCheckIn;
                                if (typeof response.businesses[index].distance !== 'undefined') {
                                    let miles = parseInt(response.businesses[index].distance) / 1609;
                                    response.businesses[index].distance = miles.toFixed(1);
                                }
                            });
                        }
                        logger("Yelp's placeData", true);
                        returnData(response.businesses);
                    })
                    .catch((err) => {
                        logger("Yelp's placeData", false);
                        alert('Map Business Data Error (API Y PlaceData)', err.message, null);
                    });
            },
            buildParameters: (lat, long, radius, isQuery, term, region) => {
                var paramString = "";
                //Check to see if this is a search or loading map
                if (isQuery) {
                    paramString += 'term=' + term;
                    paramString += '&location=' + region[0].city + ', ' + region[0].region;
                } else {
                    //location, lat long
                    paramString += "latitude=" + lat + "&longitude=" + long + "&";
                    //radius in meters
                    paramString += "radius=" + radius + "&";
                }
                //    paramString += `&categories=
                //         bars,beergardens,musicvenues,pubs,brewpubs,
                //         irish_pubs,whiskeybars,vermouthbars,sportsbars,
                //         chicken_wings,barcrawl,danceclubs,pianobars,poolhalls`;
                return paramString;
            },
            businessVerification: (name, address, city, state, country, callback) => {
                fetch("https://api.yelp.com/v3/businesses/matches?match_threshold=default&name=" + name + "&address1=" + address + "&city=" + city + "&state=" + state + "&country=" + country,
                    {
                        headers: new Headers({'Authorization': "Bearer " + YELP_PLACE_KEY})
                    })
                    .then((data) => data.json())
                    .then((response) => {
                        logger("businessPhoneVerification", true);
                        if (callback) {
                            callback(response);
                        }
                    })
                    .catch((err) => {
                        logger("businessPhoneVerification", false);
                        alert('Business Verification Error (API Y Businesses)', err.message, null);
                    });
            },
            getBusinessData: (id, callback) => {
                fetch("https://api.yelp.com/v3/businesses/" + id,
                    {
                        headers: new Headers({'Authorization': "Bearer " + YELP_PLACE_KEY})
                    })
                    .then((data) => data.json())
                    .then((response) => {
                        logger("getBusinessData", true);
                        if (callback) {
                            callback(response);
                        }
                    })
                    .catch((err) => {
                        logger("getBusinessData", false);
                        alert('Business Verification Error (API Y Businesses)', err.message, null);
                    });
            },
            isBusinessRegistered:  async (businessId) => {
                let obj = {
                    businessId
                }
                let ret = await fetch('https://us-central1-nife-75d60.cloudfunctions.net/isBusinessRegistered',
                    {
                        method: 'POST',
                        body: JSON.stringify(obj)
                    })
                let isBusinessRegistered = await ret.json()
                return isBusinessRegistered.result
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
            databaseInstance: () => {
                return
            },
            signOut: async (callback) => {
                firebase.auth().signOut();
                if (callback) {
                    callback();
                }
            },
            passwordReset: async (email) => {
                var auth = firebase.auth();
                auth.sendPasswordResetEmail(email).then(function () {
                    logger("Firebase's Reset Password", true);
                    alert('Nife - Reset Password', 'Email was sent! Please check your email for further directions!', null);
                }).catch(function (error) {
                    logger("Firebase's Reset Password", false);
                    alert('Firebase Reset Password', error.message, null);
                });
            }
        },
    },
    basicUtil: {
        mergeObject: (obj1, obj2) => {
            for (var attr in obj2) {
                obj1[attr] = obj2[attr];
            }
            return obj1;
        },
        grabCurrentDeviceInfo: (callback) => {
            let dataObj = {};
            dataObj['simulator'] = Device.isDevice;
            dataObj['modelName'] = Device.modelName;
            dataObj['userGivenDeviceName'] = Device.deviceName;
            dataObj['osName'] = Device.osName;
            dataObj['totalMemory'] = Device.totalMemory;
            if (callback) {
                callback(dataObj);
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

        getMiles: (i) => {
            return i * 0.000621371192;
        },
        extend: (dest, src) => {
            for (var key in src) {
                if (key == 'dateOfBirth') {
                    dest[key] = {seconds: new Date(src[key]).getTime() / 1000};
                } else if (typeof (src[key]) == "string") {
                    dest[key] = src[key].replace(String.fromCharCode(92), '').replace('"', "");
                } else {
                    dest[key] = src[key];
                }
            }
            return dest;
        },
        defaultPhotoUrl: 'https://firebasestorage.googleapis.com/v0/b/nife-75d60.appspot.com/o/Nife%20Images%2FUpdatedLogoN.jpeg?alt=media&token=' + photoUrlToken,
        TouchableOpacity: () => {
            if (Device.osName == "Android") {
                return require('react-native-gesture-handler').TouchableOpacity;
            } else {
                return require('react-native').TouchableOpacity;
            }
        },
        VerticalLoader: ({layoutMeasurement, contentOffset, contentSize}) => {
            const paddingToBottom = 20;
            return layoutMeasurement.height + contentOffset.y >=
              contentSize.height - paddingToBottom;
        },
        getUUID: () => uuid.v4()
    }
}
}

export const logger = (funcName, type) => {
    if (type === true) {
        console.log('\n');
        console.log("" + funcName + " ran successfully!");
    } else {
        console.log('\n');
        console.log("" + funcName + " failed.");
    }
}

export const alert = (title, message, okFunction) => {
    Alert.alert(
        title,
        message,
        [
            {
                text: "OK",
                onPress: okFunction ? okFunction() : () => {
                }
            }
        ],
        {cancelable: false}
    );
}

export const passwordValidation = (pass1, pass2) => {
    console.log(pass1, pass2)
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    if(pass1 !== pass2){
        alert('Password Validation Failed!', 'Passwords do not match!');
        return false;
    }
    if(strongRegex.test(pass1)){
        return true
    } else {
        alert('Password Validation Failed!',
            'Passwords must contain 1 lower case letter, 1 uppercase letter,' +
            ' one number and one special symbol (!@#$%^&*)!');
        return false;
    }
}

export const defaultPhotoUrl = 'https://firebasestorage.googleapis.com/v0/b/nife-75d60.appspot.com/o/Nife%20Images%2FUpdatedLogoN.jpeg?alt=media&token=' + photoUrlToken

export default Util;