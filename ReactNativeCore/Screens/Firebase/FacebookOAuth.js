import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator  } from 'react-native';
import * as Facebook from 'expo-facebook';
import { FACEBOOK_APP_ID, FB_APP_NAME } from 'react-native-dotenv';
import * as firebase from 'firebase';

//Intialize Facebook Login
const BUNDLE_ID = 'com.reactnativecore';

class FireBaseFacebookWindow extends Component {
  state = {
    isLoggedin: firebase.auth().currentUser ? true : false,
    userData: null,
    token: null,
    user: null
  }
  //Set login status
  setLoggedinStatus = async (boolean) => {
    this.setState({isLoggedin: boolean});
  }  
  //Set user data
  setUserData = async (data, token) => {
    this.setState({userData: data});
    this.setState({token: token});
  }
  // Listen for authentication state to change.
  facebookLogIn = async () => {
    await Facebook.initializeAsync(FACEBOOK_APP_ID, BUNDLE_ID);
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`)
          .then(response => response.json())
          .then(async data => {
            console.log(data);
            this.setLoggedinStatus(true);
            this.setUserData(data, token);
            const credential = firebase.auth.FacebookAuthProvider.credential(token);
            firebase.auth().signInWithCredential(credential).catch((error) => {console.log(error)});
          })
          .catch(e => console.log(e))
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  logout = () => {
   this.setState({isLoggedin: false});
   this.setState({userData: null});
   firebase.auth().signOut();
  }

  render() {
    return (
      this.state.isLoggedin ?
        this.state.userData ?
          <View style={styles.loggedInContainer}>
            <View style={styles.header}>
              <Image
                style={styles.profilePic}
                source={{ uri: this.state.userData.picture.data.url ? this.state.userData.picture.data.url : this.state.userData.photoURL }} />
              <Text style={{ fontSize: 18, height: 40, color: 'black', bottom: 90, marginHorizontal: 50 }}>Welcome, {this.state.userData.name ? this.state.userData.name : this.state.userData.displayName}!</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={() => this.logout()}>
              <Text style={{ color: "#fff" }}>Logout</Text>
            </TouchableOpacity>
          </View> :
        null
      :
      <View style={styles.container}>
        <TouchableOpacity style={styles.loginBtn} onPress={() => this.facebookLogIn()}>
          <Text style={styles.loggedOutText}>Login with Facebook</Text>
          <Image
              style={styles.fbLogo}
              source={require("../../Media/Images/fblogo.png")}
            />
        </TouchableOpacity>
      </View>
    );  
  }
}

export default FireBaseFacebookWindow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9ebee',
    alignItems: 'center',
    justifyContent: 'center',
    top: 100
  },
  loggedInContainer: {
    flex: 1,
    backgroundColor: '#e9ebee',
    alignItems: 'center',
    justifyContent: 'center',
    top: 200
  },
  loginBtn: {
    backgroundColor: '#4267b2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 50,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  logoutBtn: {
    backgroundColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    position: "absolute",
    bottom: 0,
    top: 470,
    height: 35,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fbLogo: {
    width: 25, 
    height: 25,
    left: 2,
    borderColor: "#fff",
    borderWidth: .2,
    borderRadius: 5
  },
  loggedOutText: {
    color: "#fff",
    alignItems: 'center',
    justifyContent: 'center'
  },
  profilePic: {
    width: 100, 
    height: 100, 
    borderRadius: 50,
    bottom: 130,
    left: 45
  },
  header: {
    flexDirection: 'row',
  }
});