import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../Styles/theme';

class DrawerButton extends React.Component  {
    render(){

        return(
            <TouchableOpacity onPress={this.props.onPress} style={styles.overlay}>
                <Ionicons style={{paddingHorizontal:2, paddingVertical:0}} name="ios-menu" size={40} color={this.props.drawerButtonColor}/>
            </TouchableOpacity> 
        );
    }
    
}


const styles = StyleSheet.create({
    header:{
        top: "-35%",
        marginLeft:"2.5%",
        width: '100%',
        height: '10%',
        justifyContent: "flex-start",
        backgroundColor:"#20232a"
    },
    overlay: {
        position: 'absolute',
        top:"5%",
        left: "5%",
        opacity: 0.75,
        backgroundColor: theme.DARK,
        borderRadius: 10,
        paddingVertical:0,
      },
});

export default DrawerButton;