import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import Util from '../scripts/Util';
import NifeLoginModal from './Components/Home Screen Components/LoginModal'
import { styles } from '../Styles/style';
import * as firebase from 'firebase';

export default class LoginScreen extends Component {
  state = {
    isLoggedin: firebase.auth().currentUser ? true : false,
    userData: firebase.auth().currentUser ? firebase.auth().currentUser : null,
    modalVisible: false
  }
  //Set login status
  setLoggedinStatus = async (dataObj) => {
    this.setState({ isLoggedin: dataObj.data ? true : false });
  }  
  //Set user data
  setUserData = async (dataObj) => {
    this.setState({ userData: dataObj.user });
  }
  logout = () => {
    this.setState({ isLoggedin: false });
    firebase.auth().signOut();
   }

   render () {
      return ( 
       
        <View style={styles.loginContainer}>
          
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{this.props.text}</Text>
          </View>
          <View style={styles.facebookButtonContainer}>
            <TouchableOpacity style={styles.facebookLoginBtn} onPress={() => Util.dataCalls.Facebook.login((dataObj) => {
              this.setUserData(dataObj);
              this.setLoggedinStatus(dataObj);
            })}>
              <Text style={styles.loggedOutText}>Login with Facebook</Text>
              <Image
                  style={styles.Logo}
                  source={require("../Media/Images/fblogo.png")}
                />
            </TouchableOpacity>
          </View>
          <View style={styles.googleButtonContainer}>
            <TouchableOpacity style={styles.googleLoginBtn} onPress={() => Util.dataCalls.Google.login((dataObj) => {
              this.setUserData(dataObj.user);
              this.setLoggedinStatus(dataObj);
            })}>
              <Text style={styles.loggedOutText}>Login with Google</Text>
              <Image
                  style={styles.Logo}
                  source={require("../Media/Images/googlelogo.png")}
                />
            </TouchableOpacity>
          </View>
          <View style={styles.nifeButtonContainer}>
            <TouchableOpacity style={styles.nifeLoginBtn} onPress={() => this.setState({modalVisible: true}) }>
              <Text style={styles.loggedOutText}>Create account with Nife</Text>
              <Image
                style={styles.Logo}
                source={require("../Media/Images/logoicon.png")}
              />
            </TouchableOpacity>
          </View>
          <Text style={{color:"#FFCC00", fontWeight:"bold", top: 25, fontFamily: 'Palatino-Bold',}}>
            If you are a business, please sign in with Nife!
          </Text>
          <NifeLoginModal  setBusiness={this.props.setBusiness} onDismiss={()=>this.setState({modalVisible:false})} onSignUp={this.props.onSignUp} modalVisible={this.state.modalVisible} callback={() => {
              console.log('callback nifeloginmodal')
            }}
          />
        </View>
      );
    }
}
