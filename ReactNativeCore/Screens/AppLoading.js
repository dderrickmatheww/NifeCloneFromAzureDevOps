import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import theme from '../Styles/theme';

var image = require('../Media/Images/Splash.png')

class AppLoading extends React.Component  {


    render(){
        return(
          <View style={{flex:1, justifyContent:"center"}}>
            <ImageBackground source={image} style={localStyles.ImageBackground}></ImageBackground>
          </View>
            
        )
    }
}

const localStyles = StyleSheet.create({
  ImageBackground:{
    flex:1,
    resizeMode:"contain",
    backgroundColor: theme.DARK
  },
});

export default AppLoading;
