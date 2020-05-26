import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { styles } from '../Styles/style';
import * as firebase from 'firebase';
import Util from '../scripts/Util';
import theme from '../Styles/theme'
import 'firebase/firestore'

class TestingScreen extends React.Component  {

    state = {
        isLoggedIn: firebase.auth().currentUser ? true : false,
        user: firebase.auth().currentUser,
        query: null,
        db: firebase.firestore()
    }

    componentDidMount () {
        console.log("Current User: " + firebase.auth().currentUser)
        this.setState({user: firebase.auth().currentUser});
        this.setState({isLoggedIn: firebase.auth().currentUser ? true : false});
        this.setState({db: firebase.firestore()});
    }

    render() {
        return (
            this.state.user == null ? 
            <View style={styles.viewDark}>
                <ActivityIndicator size="large" color={theme.LIGHT_PINK}></ActivityIndicator>
            </View> 
            : 
            <View style={localStyles.loggedInContainer}>
                <TouchableOpacity style={localStyles.btn} onPress={() => Util.asyncStorage.GetAsyncStorageVar('Friends',
                (data) => {console.log(data)})}>
                        <Text>Get Friends</Text>
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