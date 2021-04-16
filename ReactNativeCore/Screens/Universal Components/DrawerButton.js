import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {
    Avatar
} from 'react-native-paper';
import theme from '../../Styles/theme';
import Util from '../../scripts/Util';
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };

class DrawerButton extends React.Component  {
    render() {
        return(
            <TouchableOpacity onPress={this.props.onPress} style={styles.overlay}>
                <Avatar.Image 
                    source={this.props.userPhoto && this.props.userPhoto !== "Unknown" ? {
                        uri:  this.props.userPhoto  
                    } : defPhoto}
                    size={35}
                />
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
        backgroundColor: theme.generalLayout.backgroundColor
    },
    overlay: {
        position: 'absolute',
        top:"5%",
        left: "5%",
        opacity: .95,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 50,
        paddingVertical:0,
        borderWidth: .5,
        borderColor: theme.generalLayout.secondaryColor
      },
});

export default DrawerButton;