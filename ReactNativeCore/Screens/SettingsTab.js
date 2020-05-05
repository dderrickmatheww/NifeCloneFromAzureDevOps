import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import FireBaseFacebookLogin from './Firebase/FacebookOAuth';
import FirebaseGoogleLogin from './Firebase/GoogleOAuth';
import NifeLoginModal from './Components/Home Screen Components/LoginScreen'
import * as firebase from 'firebase';

const Stack = createStackNavigator();

export default class SettingsScreen extends Component {
  state = {
    isLoggedin: firebase.auth().currentUser ? true : false,
    userData: null,
    token: null,
    user: null,
    modalVisible: false
  }
  //Set login status
  setLoggedinStatus = async (dataObj) => {
    this.setState({ isLoggedin: dataObj.user ? true : false });
  }  
  //Set user data
  setUserData = async (dataObj) => {
    this.setState({ userData: dataObj.data });
    this.setState({ token: dataObj.token });
  }
  logout = () => {
    this.setState({ isLoggedin: false });
    this.setState({ userData: null });
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
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Please sign in to edit your settings!</Text>
          </View>
          <View style={styles.facebookButtonContainer}>
            <TouchableOpacity style={styles.facebookLoginBtn} onPress={() => FireBaseFacebookLogin((dataObj) => {
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
            <TouchableOpacity style={styles.googleLoginBtn} onPress={() => FirebaseGoogleLogin((dataObj) => {
              this.setUserData(dataObj);
              this.setLoggedinStatus(dataObj);
              console.log(dataObj);
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

const styles = StyleSheet.create({
  container: {
    top: 0,
    flex: 1,
    backgroundColor: '#e9ebee',
    alignItems: 'center',
    backgroundColor: '#20232A'
  },
  facebookButtonContainer: {
    top: 80
  },
  googleButtonContainer: {
    top: 90
  },
  nifeButtonContainer: {
    top: 100
  },
  loggedInContainer: {
    flex: 1,
    backgroundColor: '#e9ebee',
    alignItems: 'center',
    top: 0
  },
  facebookLoginBtn: {
    backgroundColor: '#4267b2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 50,
    width: 210,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: 'white',
    borderWidth: 1
  },
  googleLoginBtn: {
    backgroundColor: '#228B22',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 50,
    width: 210,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: 'red',
    borderWidth: 1
  },
  nifeLoginBtn: {
    backgroundColor: 'black',
    borderColor: '#FF69B4',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 50,
    width: 210,
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
  Logo: {
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
  },
  headerText: {
    fontSize: 18,
    color: 'white'
  },
  headerContainer: {
    top: 60
  }
});