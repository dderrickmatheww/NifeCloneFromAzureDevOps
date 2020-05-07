import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../Styles/style';
import getFeedData from './FeedComponents/GetFeedData';
import * as firebase from 'firebase';



class HomeScreen extends React.Component  {

    state = {
        isLoggedIn: firebase.auth().currentUser ? true : false,
        user: firebase.auth().currentUser,
        theFeed: null
    }

    render() {
        return (
            this.state.isLoggedIn ? 
            <View style={styles.viewDark}>
                <Text style={styles.titleVice}>My Feed</Text>
            </View> 
            : 
            <View style={styles.viewDark}>
                <Text style={styles.titleVice}>Please login or sign up to see your feed!</Text>
                <TouchableOpacity style={styles.navigateLoginBtn} onPress={() => this.props.navigation.navigate('Settings')}><Text>Login/Sign Up</Text></TouchableOpacity>
            </View>
        )
    }
}
export default HomeScreen;
