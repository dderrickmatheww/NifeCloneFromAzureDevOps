import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet, Image} from 'react-native';
import Util from '../../../scripts/Util';
import { styles } from '../../../Styles/style';
import DrawerButton from '../../Universal Components/DrawerButton';
import theme from '../../../Styles/theme';
import * as firebase from 'firebase';
import {
  Headline,
  Caption
} from 'react-native-paper';

export default class QRCodeScreen extends Component {

  state = {
    userData:  null,

  }

  //Set user data
  componentDidMount(){
    this.setState({ userData: firebase.auth().currentUser })
  }

   render () {
      return ( 
       this.state.userData ?
            <View style={styles.viewDark}>
              <View style={{justifyContent:"center", alignContent:"center"}}>
                <Headline style={{justifyContent:"center", alignContent:"center", color:theme.generalLayout.textColor, fontFamily: theme.generalLayout.font}}>Your QR Code</Headline>
                <Caption style={{justifyContent:"center", alignContent:"center", color:theme.generalLayout.textColor, fontFamily: theme.generalLayout.font}}>Let friends scan this to add you to their friends list!</Caption>
              </View>
              
              <Image
                source={{uri:Util.user.GenerateQRCode(firebase.auth().currentUser.email)}}
                style={{width:300,height:300, marginTop:30}}
              />
              <DrawerButton drawerButtonColor={theme.generalLayout.secondaryColor} onPress={this.props.onDrawerPress} /> 
            </View>
                :
            <View style={styles.viewDark}>
                <ActivityIndicator size="large" color={theme.loadingIcon.color}></ActivityIndicator>
                <DrawerButton drawerButtonColor={theme.generalLayout.secondaryColor} onPress={this.props.onDrawerPress} /> 
            </View> 
        
      );
    }
}

const localStyles = StyleSheet.create({
  fieldCont:{
    marginVertical:5
  },
  mainCont:{
    width:"95%",
    flex:1,
    flexDirection:"column",
  },

  SaveOverlay: {
    position: 'absolute',
    top:"6%",
    left: "90.5%",
    backgroundColor: theme.generalLayout.backgroundColor,
    borderRadius: 10,
    paddingVertical:0,
  },
  CancelOverlay: {
    position: 'absolute',
    top:"6%",
    left: "80%",
    backgroundColor: theme.generalLayout.backgroundColor,
    borderRadius: 10,
    paddingVertical:0,
  },

  AddFriendOverlay: {
    position: 'absolute',
    top:"6%",
    left: "70%",
    opacity: 0.75,
    backgroundColor: theme.generalLayout.backgroundColor,
    borderRadius: 10,
    paddingVertical:0,
  },

  LocAndFriends:{
    flexDirection: "row",
    justifyContent:"space-between",
    alignItems:"stretch",
    width:"90%"
  },
  loggedInContainer:{
    alignItems:"flex-start", 
    flex: 1, 
    flexDirection: "column",
    backgroundColor: theme.generalLayout.backgroundColor,
    alignItems:"center",
    justifyContent:"space-evenly"
  },
  loggedInSubView:{
    flex: 1, 
    backgroundColor: theme.generalLayout.backgroundColor,
    width: "100%",
    justifyContent:"center",
    marginBottom:"10%",
    alignItems:"center",
  },
  HeaderCont:{
    flex: 1, 
    backgroundColor: theme.generalLayout.backgroundColor,
    width: "100%",
    maxHeight:"15%",
    justifyContent:"flex-end",
    alignItems:"center",
    borderBottomColor: theme.generalLayout.secondaryColor,
    borderBottomWidth: 2,

  },
  profilePic: {
    width: 75, 
    height: 75, 
    borderRadius: 50,
    marginBottom: "5%"
  },
  friendPic: {
    width: 50, 
    height: 50, 
    borderRadius: 50,
  },
  friendCont:{
    flexDirection: "row",
    borderBottomColor:theme.generalLayout.secondaryColor,
    borderBottomWidth: 1,
  },
  name: {
    fontSize: 18,
    color: theme.generalLayout.textColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:'.5%',
    marginLeft:'2.5%',
    width: "100%",
    fontFamily: theme.generalLayout.font
  },
  FriendCount: {
    fontSize: 15,
    marginTop: "2%",
    marginBottom: "1%",
    color: theme.generalLayout.textColor,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: theme.generalLayout.font
  },
  Header: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.generalLayout.textColor,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: theme.generalLayout.font
    
  },
  ScrollView: {
    flex: 1,
    width:"100%",
    borderLeftWidth:2,
    borderLeftColor: theme.generalLayout.secondaryColor,
    borderRightWidth:2,
    borderRightColor: theme.generalLayout.secondaryColor,
    paddingHorizontal: "5%",
    paddingBottom: "1%"
  }
});