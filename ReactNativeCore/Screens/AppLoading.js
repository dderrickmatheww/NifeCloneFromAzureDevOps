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
    width:"100%",
    height:"100%",
    backgroundColor: theme.DARK
  },
});

export default AppLoading;
