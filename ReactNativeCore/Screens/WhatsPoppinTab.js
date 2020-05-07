import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../Styles/style';
import getFeedData from './FeedComponents/GetFeedData';
import * as firebase from 'firebase';

class WhatsPoppin extends React.Component  {

    state = {
        isLoggedIn: firebase.auth().currentUser ? true : false,
        user: firebase.auth().currentUser,
        query: null
    }

    componentDidMount () {
        this.grabFeedData()
    }

    grabFeedData = () => {
        if(this.state.isLoggedIn) {
            let token = this.state.user.providerData[0].uid;
            let provider = this.state.user.providerData[0].providerId;
            let query = this.state.query
            getFeedData(token, provider, query, function(dataObj){
                console.log(dataObj)
            });
        }
    }

    render() {
        return (
            this.state.isLoggedIn ? 
            <View style={styles.viewDark}>
                <Text style={styles.titleVice}>What's poppin'?</Text>
            </View> 
            : 
            <View style={styles.viewDark}>
                <Text style={styles.titleVice}>Please login or sign up to see your feed!</Text>
                <TouchableOpacity style={styles.navigateLoginBtn} onPress={() => this.props.navigation.navigate('Settings')}><Text>Login/Sign Up</Text></TouchableOpacity>
            </View>
        )
    }
}

export default WhatsPoppin;