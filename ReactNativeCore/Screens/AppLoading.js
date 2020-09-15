import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import theme from '../Styles/theme';

var image = require('../Media/Images/Splash.png')

class AppLoading extends React.Component  {


    render(){
        return(
          <View style={{flex:1, justifyContent:"center"}}>
            <Image source={image} style={localStyles.ImageBackground}></Image>
          </View>
            
        )
    }
}

const localStyles = StyleSheet.create({
  ImageBackground:{
    width:"100%",
    height:150,
    paddingHorizontal:10
  },
});

export default AppLoading;
