import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { styles } from '../Styles/style';
import * as firebase from 'firebase';
import Util from '../scripts/Util';
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
        for(i=1; i <100; i++){
            Util.user.UpdateUser(firebase.firestore(), i+'@'+i+'.com', {privacySettings: {public:true}},() =>{
                console.log(i+'@'+i+'.com updated')
            });
        }
        
    }

    render() {
        return (
            this.state.user ? 
            <View style={localStyles.loggedInContainer}>
                <TouchableOpacity style={localStyles.btn} onPress={() => this.testFunc()}>
                        <Text>Get Friends</Text>
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