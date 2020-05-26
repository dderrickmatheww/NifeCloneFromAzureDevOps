import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';

var image = require('../Media/Images/Splash.png')

class AppLoading extends React.Component  {


    render(){
        return(
            <View style={{flex:1}}><ImageBackground source={image} style={localStyles.ImageBackground}></ImageBackground></View>
        )
    }
}

const localStyles = StyleSheet.create({
  ImageBackground:{
    flex:1,

    width:"75%",
    height:"75%",
    resizeMode:"cover"
    
  },
  
  });

export default AppLoading;
