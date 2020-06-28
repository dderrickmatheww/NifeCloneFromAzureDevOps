import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet, Image} from 'react-native';
import Util from '../../../scripts/Util';
import { styles } from '../../../Styles/style';
import DrawerButton from '../../Universal Components/DrawerButton';
import theme from '../../../Styles/theme';
import * as firebase from 'firebase';
import {
  Snackbar
} from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default class ScanQRCodeScreen extends Component {

  state = {
    userData:  null,
    hasPermission: false,
    scanned:false,
    scannedEmail: null,
    visible: false,
  } 

  handleBarCodeScanned = ({type, data}) => {
    this.setState({scanned:true});
    this.setState({scannedEmail: data});
    // alert('Bar code with type '+type+' and data ' +data +' has been scanned!');
    Util.friends.AddFriend(firebase.firestore(), this.state.userData.email, data, () =>{
      this.setState({visible:true});
    });
  }

  onToggleSnackBar = () => {
    this.setState({snackBar: !this.state.visible});
  }

  onDismissSnackBar = () => {
    this.setState({snackBar: false});
  }

  componentDidMount(){
    const { status } = BarCodeScanner.requestPermissionsAsync();
    if(status == "granted"){
      this.setState({hasPermission:true});
    }
    this.setState({userData:firebase.auth().currentUser});
    this.rerender = this.props.navigation.addListener('focus', () => {
      this.componentDidMount();
    });
  }
  
  componentWillUnmount() {
    this.rerender();
  }


   render () {
      return ( 
       this.state.userData ?
            <View style={styles.viewDark}>
              <BarCodeScanner
                onBarCodeScanned={({type, data}) => this.state.scanned? null: this.handleBarCodeScanned({type, data})}
                style={StyleSheet.absoluteFillObject}
              />
              <Snackbar
                visible={this.state.visible}
                onDismiss={() => this.onDismissSnackBar()}
                action={{
                  label: 'Back',
                  onPress: () => {
                    this.setState({scanned:false});
                    this.setState({visible:false});
                    this.props.navigation.goBack();
                    
                  },
                }}
              >
                You have requested to be friends with {this.state.scannedEmail}!
              </Snackbar>
            </View>
                :
            <View style={styles.viewDark}>
                <ActivityIndicator size="large" color={theme.LIGHT_PINK}></ActivityIndicator>
                <DrawerButton drawerButtonColor="#eca6c4" onPress={this.props.onDrawerPress} /> 
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
    backgroundColor: theme.DARK,
    borderRadius: 10,
    paddingVertical:0,
  },
  CancelOverlay: {
    position: 'absolute',
    top:"6%",
    left: "80%",
    backgroundColor: theme.DARK,
    borderRadius: 10,
    paddingVertical:0,
  },

  AddFriendOverlay: {
    position: 'absolute',
    top:"6%",
    left: "70%",
    opacity: 0.75,
    backgroundColor: theme.DARK,
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
    backgroundColor: theme.DARK,
    alignItems:"center",
    justifyContent:"space-evenly"
  },
  loggedInSubView:{
    flex: 1, 
    backgroundColor: theme.DARK,
    width: "100%",
    justifyContent:"center",
    marginBottom:"10%",
    alignItems:"center",
  },
  HeaderCont:{
    flex: 1, 
    backgroundColor: theme.DARK,
    width: "100%",
    maxHeight:"15%",
    justifyContent:"flex-end",
    alignItems:"center",
    borderBottomColor: theme.LIGHT_PINK,
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
    borderBottomColor:theme.LIGHT_PINK,
    borderBottomWidth: 1,
  },
  name: {
    fontSize: 18,
    color: theme.LIGHT_PINK,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:'.5%',
    marginLeft:'2.5%',
    width: "100%"
  },
  FriendCount: {
    fontSize: 15,
    marginTop: "2%",
    marginBottom: "1%",
    color: theme.LIGHT_PINK,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Header: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.LIGHT_PINK,
    justifyContent: 'center',
    alignItems: 'center'
    
  },
  ScrollView: {
    flex: 1,
    width:"100%",
    borderLeftWidth:2,
    borderLeftColor: theme.LIGHT_PINK,
    borderRightWidth:2,
    borderRightColor: theme.LIGHT_PINK,
    paddingHorizontal: "5%",
    paddingBottom: "1%"
  }
});