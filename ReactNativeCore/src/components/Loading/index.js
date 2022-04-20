import React from 'react';
import theme from '../../../src/styles/theme';
import {View, ActivityIndicator} from 'react-native';

export const Loading = () => {
    return(
        <View style={{flex:1, justifyContent:"center", backgroundColor: theme.generalLayout.backgroundColor, width: "100%", height: "100%"}}>
            <ActivityIndicator size="large" color={theme.loadingIcon.color}/>
        </View>
    )
}

