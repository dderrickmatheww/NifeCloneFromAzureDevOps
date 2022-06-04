import React from 'react';
import theme from '../../../src/styles/theme';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { View } from 'react-native';

export const Loading = () => {
    return(
        <View style={{flex:1, justifyContent:"center", backgroundColor: theme.generalLayout.backgroundColor, width: "100%", height: "100%"}}>
            <ActivityIndicator animating={true} color={theme.loadingIcon.color}/>
        </View>
    )
}

