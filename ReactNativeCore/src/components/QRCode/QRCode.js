import React, {Component} from 'react';
import {ActivityIndicator, Image, View} from 'react-native';
import {styles} from '../../styles/style';
import theme from '../../../src/styles/theme';
import {Caption, Headline} from 'react-native-paper';
import DrawerButton from "../Drawer/DrawerButton";
import {connect} from "react-redux";

class QRCodeScreen extends Component {
  state = {
    userData:  null,
  }
  generateQRCode(id, displayName){
      const url = `http://api.qrserver.com/v1/create-qr-code/?data=${JSON.stringify({friendId: id, displayName})}&size=500x500&bgcolor=301E48&color=F1BF42`;
      console.log(url)
      return url;
  }
   render () {
      return ( 
       this.props.user ?
            <View style={styles.viewDark}>
              <View style={{justifyContent:"center", alignContent:"center"}}>
                <Headline style={{justifyContent:"center", alignContent:"center", color:theme.generalLayout.textColor, fontFamily: theme.generalLayout.font}}>Your QR Code</Headline>
                <Caption style={{justifyContent:"center", alignContent:"center", color:theme.generalLayout.textColor, fontFamily: theme.generalLayout.font}}>Let friends scan this to add you to their friends list!</Caption>
              </View>
              
              <Image
                source={{uri:this.generateQRCode(this.props.user.id, this.props.user.displayName)}}
                style={{width:300,height:300, marginTop:30}}
              />
              <DrawerButton
                  userPhoto={this.props.user.photoSource}
                  drawerButtonColor={theme.generalLayout.secondaryColor}
                  onPress={this.props.navigation.openDrawer}
              />
            </View>
                :
            <View style={styles.viewDark}>
                <ActivityIndicator size="large" color={theme.loadingIcon.color}/>
                <DrawerButton
                    userPhoto={this.props.user.photoSource}
                    drawerButtonColor={theme.generalLayout.secondaryColor}
                    onPress={this.props.navigation.openDrawer}
                />
            </View> 
        
      );
    }
}

function mapStateToProps(state) {
  return {
    user: state.userData,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    refresh: ({userData}) => dispatch({
      type: 'REFRESH',
      data: {
        userData
      }
    })
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(QRCodeScreen);