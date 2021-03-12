import React from 'react';
import theme from '../Styles/theme';
import {Image, StyleSheet, View, ActivityIndicator} from 'react-native';

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
