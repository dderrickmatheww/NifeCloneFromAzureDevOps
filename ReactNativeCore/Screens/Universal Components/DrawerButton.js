import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {
    Avatar
} from 'react-native-paper';
import theme from '../../Styles/theme';
const defPhoto = { uri: 'https://firebasestorage.googleapis.com/v0/b/nife-75d60.appspot.com/o/Nife%20Images%2Flogoicon.PNG?alt=media&token=86fc1470-baf3-472c-bbd3-fad78787eeed' };

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
        backgroundColor:"#20232a"
    },
    overlay: {
        position: 'absolute',
        top:"5%",
        left: "5%",
        opacity: .95,
        backgroundColor: theme.DARK,
        borderRadius: 10,
        paddingVertical:0,
        borderWidth: .5,
        borderColor: theme.LIGHT_PINK
      },
});

export default DrawerButton;