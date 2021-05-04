import React from 'react';
import theme from '../../../Styles/theme';
import {View, ActivityIndicator} from 'react-native';

class AppLoading extends React.Component  {
    render(){
        return(
          <View style={{flex:1, justifyContent:"center", backgroundColor: theme.generalLayout.backgroundColor, width: "100%", height: "100%"}}>
            <ActivityIndicator size="large" color={theme.loadingIcon.color}></ActivityIndicator>
          </View>
        )
    }
}

export default AppLoading;
