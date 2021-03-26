import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../Styles/theme';

export default class PleaseLogin extends React.Component  {
    render() {
        return (
            <View style={styles.viewDark}>
                <Text style={localStyles.titleVice}>Please login or sign up to see the {this.props.appName}!</Text>
                <TouchableOpacity style={localStyles.navigateLoginBtn} onPress={() => this.props.navigation.navigate('Settings')}>
                    <Text style={localStyles.titleVice}>Login/Sign Up</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const localStyles = StyleSheet.create({ 
    titleVice: {
        fontSize: 36,
        marginBottom: 16,
        color: theme.generalLayout.textColor,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: theme.generalLayout.font
    },
    navigateLoginBtn: {
        backgroundColor: theme.generalLayout.backgroundColor,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 90,
        width: 210,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderColor: 'white',
        borderWidth: 1
      },
})