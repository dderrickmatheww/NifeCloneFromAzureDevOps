import React from 'react';
import * as Notifications from 'expo-notifications'
import { View, Text, StyleSheet } from 'react-native';
import * as firebase from 'firebase';
import theme from '../../../src/styles/theme';
import 'firebase/firestore'
import Util from "../../scripts/Util";
import {connect} from "react-redux";
const TouchableOpacity = Util.basicUtil.TouchableOpacity();

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
                    Util.business.getNifeBusinessesNearby(this.props.userData, (data) => console.log(data))
                }
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

function mapStateToProps(state){
    return{
        userData: state.userData,
        requests: state.friendRequests,
        friends: state.friendData,
        businessData: state.businessData,
    }
}

function mapDispatchToProps(dispatch){
    return {
        refresh: (userData) => dispatch({type:'REFRESH', data:userData})
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(TestingScreen);
