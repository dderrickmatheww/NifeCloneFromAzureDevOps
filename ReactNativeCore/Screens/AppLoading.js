import React from 'react';
import theme from '../Styles/theme';
import {Image, StyleSheet, View, ActivityIndicator} from 'react-native';

const defPhoto = { uri: 'https://firebasestorage.googleapis.com/v0/b/nife-75d60.appspot.com/o/Nife%20Images%2Flogoicon.PNG?alt=media&token=86fc1470-baf3-472c-bbd3-fad78787eeed' };

class AppLoading extends React.Component  {
    render(){
        return(
          <View style={{flex:1, justifyContent:"center", backgroundColor: theme.DARK, width: "100%", height: "100%"}}>
            <ActivityIndicator size="large" color={theme.LIGHT_PINK}></ActivityIndicator>
          </View>
        )
    }
}

export default AppLoading;
