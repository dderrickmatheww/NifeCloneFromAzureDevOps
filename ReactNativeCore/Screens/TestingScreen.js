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

    testFunc = () => {
        var i;
        for(i=1; i<12; i++){
            let email = "" + Random.first_names() + "@" +Random.places() + ".com";
            let name = "" + Random.first_names() + " " +Random.last_names();
            let friends = {};
            let index = i;
            friends["mattdpalumbo@gmail.com"] = true;
            friends["dderrickmatheww@gmail.com"] = true;
            friends["torriedunn3@gmail.com"] = true;
            let obj = {
                displayName : name,
                email : email,
                phoneNumber : "555-555-5555",
                photoSource : Random.avatar,
                providerId : 1234583,
                providerData : {
                    displayName : name,
                    email : email,
                    phoneNumber : "555-555-5555",
                    photoSource : Random.avatar,
                    providerId : 1234583,
                },
                loginLocation:{
                    accuracy:76.86499786376953,
                    altitude:-27.299999237060547,
                    heading:0,
                    latitude:32.9893621,
                    longitude:-80.0059047,
                    speed:0,
                    region:{
                        city: index%2 ? "Goose Creek" : "Charleston",
                        country: "United States",
                        isoCountryCode:"US",
                        name:"1",
                        postalCode:index%2 ? "29445" : "29407",
                        region:"South Carolina",
                        street:"Burnt Mills Road"
                    }
                },
                privacySettings:{
                    public:true,
                },
                sexualOrientation:index%2 ? index%3 ? "male":"female":"other",
                gender:index%2 ? index%3 ? index%7 ? "straight":"homosexual":"bi-sexual":"other",
                bio:Random.ipsum,
                status:{
                    text: Random.getRandom(Random.status),
                    timestamp: Random.randomWeekDate()
                },
                favoriteDrinks:[
                    ""+Random.places()+" Whiskey",
                    ""+Random.places()+" Rum",
                    ""+Random.places()+" Ale",
                ],
                friends: friends,
                dateOfBirth:Random.randomDOB(),
            }
            Util.user.UpdateUser(firebase.firestore(), email, obj, ()=>{
                console.log('adding user to db');
            });
            Util.friends.AddFriend(firebase.firestore(), email, "mattdpalumbo@gmail.com",()=>{
                console.log("friend requestsd");
            });
        }
    }

    // deleteUsers = () => {
    //     var i;
    //     for(i=0;i<100;i++){
    //         let email = '' + i + '@'+ i+'.com';
    //         firebase.firestore().collection('users').doc(email).delete().then(function() {
    //             console.log("Document successfully deleted!");
    //         }).catch(function(error) {
    //             console.error("Error removing document: ", error);
    //         });
    //     }
    // }
    // console.log("do nothing...")
    render() {
        return (
            this.state.user ? 
            <View style={localStyles.loggedInContainer}>
                <TouchableOpacity style={localStyles.btn} onPress={() => this.testFunc()}>
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