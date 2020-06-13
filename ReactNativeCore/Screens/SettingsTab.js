import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import Util from '../scripts/Util';
import NifeLoginModal from './Components/Home Screen Components/LoginScreen'
import { styles } from '../Styles/style';
import * as firebase from 'firebase';

export default class SettingsTab extends Component {
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
        this.state.isLoggedin ?
          this.state.userData ?
            <View style={styles.loggedInContainer}>
              <View style={styles.header}>
                <Image
                  style={styles.profilePic}
                  source={{ uri: this.state.userData ? this.state.userData.providerData[0].photoURL : null }} />
                <Text style={{ fontSize: 18, height: 40, color: 'white', bottom: 90, marginHorizontal: 50 }}>Welcome, {this.state.userData.name ? this.state.userData.name : this.state.userData.displayName}!</Text>
              </View>
              <TouchableOpacity style={styles.logoutBtn} onPress={() => this.logout()}>
                <Text style={{ color: "#fff" }}>Logout</Text>
              </TouchableOpacity>
            </View> :
          null
        :
        <View style={styles.loginContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Please sign in to edit your settings!</Text>
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
          <NifeLoginModal modalVisible={this.state.modalVisible} callback={(dataObj) => {
              if(dataObj) {
                this.setUserData(dataObj);
                this.setLoggedinStatus(dataObj);
              }
              else {
                this.setState({modalVisible: false});
              }
            }}
          />
        </View>
      );
    }
}
