import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { styles } from '../Styles/style';
import * as firebase from 'firebase';
import Util from '../scripts/Util';
import Random from '../scripts/random/Random';
import theme from '../Styles/theme'
import ExpandableArea from '../Screens/Universal Components/ExpandableArea';
import 'firebase/firestore'



class TestingScreen extends React.Component  {

    state = {
        user: null,
        isLoggedIn: firebase.auth().currentUser ? true : false,
        db: firebase.firestore(),
        friendData:[]
    }

    FriendsVisitedItems = (friend) => {
        console.log(friend);
        return(
            <Text style={{color:theme.LIGHT_PINK}}>{friend.displayName}</Text>
        )
    }

    getAsyncStorageData = () => {
        Util.asyncStorage.GetAsyncStorageVar('User', (userData) => {
          this.setState({user: JSON.parse(userData)});
        //   console.log("Current User: " + this.state.user);
        });
        Util.asyncStorage.GetAsyncStorageVar('Friends', (friends) => {
            this.setState({friendData: JSON.parse(friends)});
            // console.log('Friends: ' + this.state.friendData);
          });
      }

    componentDidMount () {
        
        this.getAsyncStorageData();
        this.setState({db: firebase.firestore()});
        
    }

    testFunc = (returnData) => {
        var allUsers =[];
        let baseURL = 'https://api.yelp.com/v3/businesses/search?';
        let params = Util.dataCalls.Yelp.buildParameters("32.989323", "-80.0066694", 8000);
        Util.dataCalls.Yelp.placeData(baseURL, params, {}, (data) => {
            let localBusinesses = data;
            let userRef = firebase.firestore().collection('users').where("email", ">", "").get()
            .then((res)=>{
                res.forEach((data)=>{
                    if(data.data()){
                        allUsers.push(data.data());
                    }
                });
                if(allUsers.length > 0){
                    allUsers.forEach((user)=>{
                        console.log("User: " + JSON.stringify(user))
                        let randomBusiness = localBusinesses[this.getRandomInt(localBusinesses.length-1)];
                        let db = firebase.firestore();
                        let setLoc =  db.collection('users').doc(user.email);
                        setLoc.set({
                            privacySettings:{
                                DOBPrivacy:false,
                                checkInPrivacy:false,
                                favoritingPrivacy:false,
                                genderPrivacy:false,
                                orientationPrivacy:false,
                                searchPrivacy:false,
                                visitedPrivacy:false,
                            },

                            checkIn: {
                                checkInTime: new Date(),
                                latAndLong: randomBusiness.coordinates.latitude +","+randomBusiness.coordinates.longitude,
                                privacy: "Public",
                                buisnessUID: randomBusiness.id,
                                name: randomBusiness.name,
                                phone: randomBusiness.phone,
                                address: randomBusiness.location.address1+", "+randomBusiness.location.city+", "+randomBusiness.location.state+" "+randomBusiness.location.zip_code,
                                barPhoto: randomBusiness.image_url,
                            },
                            lastVisited:{}
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
                    });
                } else {
                    console.log('yo query wrong bitch');
                }

            });
        });
    }

    getRandomInt = (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    }

    render() {
        return (
            this.state.user ? 
            <View style={localStyles.loggedInContainer}>
                <TouchableOpacity style={localStyles.btn} onPress={() => this.testFunc(()=>{console.log('ay')})}>
                        <Text>Test</Text>
                </TouchableOpacity>
            </View>
            
            : 
            <View style={styles.viewDark}>
                <ActivityIndicator size="large" color={theme.LIGHT_PINK}></ActivityIndicator>
            </View> 
            
        )
    }
}

const localStyles = StyleSheet.create({
    loggedInContainer:{
      flex: 1, 
      justifyContent: "center",
      backgroundColor: theme.DARK,
      alignItems:"center",
    },
    btn: {
        backgroundColor: 'grey',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 50,
        width: 210,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderColor: 'white',
        borderWidth: 1
      },
    
    });
  
export default TestingScreen;