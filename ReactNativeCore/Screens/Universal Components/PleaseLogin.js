import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../Styles/style';

export default class PleaseLogin extends React.Component  {
    render() {
        return (
            <View style={styles.viewDark}>
                <Text style={styles.titleVice}>Please login or sign up to see the {this.props.appName}!</Text>
                <TouchableOpacity style={styles.navigateLoginBtn} onPress={() => this.props.navigation.navigate('Settings')}><Text>Login/Sign Up</Text></TouchableOpacity>
            </View>
        )
    }
}