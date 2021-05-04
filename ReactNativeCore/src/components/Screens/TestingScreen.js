import React from 'react';
import * as Notifications from 'expo-notifications'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';
import theme from '../../../Styles/theme';
import 'firebase/firestore'
import Util from "../../scripts/Util";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

class TestingScreen extends React.Component  {

    state = {
        user: null,
        isLoggedIn: firebase.auth().currentUser ? true : false,
        db: firebase.firestore(),
        friendData:[],
        expoPushToken:null,
        notification:{},
    }



    componentDidMount() {
    }

    render() {
        return (
            <View style={localStyles.loggedInContainer}>
                <TouchableOpacity style={localStyles.btn} onPress={() =>
                    Util.user.sendFriendReqNotification(firebase.auth().currentUser.displayName, 'mrpalumbophd@gmail.com', ()=>{
                        Util.basicUtil.consoleLog("sendFriendReqNotification", true);
                    })}
                >
                        <Text>Test</Text>
                </TouchableOpacity>
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