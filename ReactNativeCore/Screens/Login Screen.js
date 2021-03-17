import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import Util from '../scripts/Util';
import theme from '../Styles/theme';
import NifeLoginModal from './Components/Home Screen Components/LoginModal'
import * as firebase from 'firebase';

export default class LoginScreen extends Component {
  state = {
    isLoggedin: firebase.auth().currentUser ? true : false,
    userData: firebase.auth().currentUser ? firebase.auth().currentUser : null,
    modalVisible: false,
    isReset: false
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
      <View style={localStyles.loginContainer}>
        <View style={localStyles.headerContainer}>
          <Text style={localStyles.headerText}>{this.props.text}</Text>
        </View>
        {/* 
          Facebook Login Button
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
        */}
        <View style={localStyles.subHeaderContainer}>
          <Text style={localStyles.subHeaderText}>
            Users
          </Text>
        </View>
        <View style={localStyles.googleButtonContainer}>
          <TouchableOpacity style={localStyles.googleLoginBtn} onPress={() => Util.dataCalls.Google.login((dataObj) => {
            this.setUserData(dataObj.user);
            this.setLoggedinStatus(dataObj);
          })}>
            <Text style={localStyles.loggedOutText}>Login with Google</Text>
            <Image
                style={localStyles.Logo}
                source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/nife-75d60.appspot.com/o/Nife%20Images%2Fgooglelogo.png?alt=media&token=df5a838d-8167-41bb-a102-d9ea4690b4c6' }}
              />
          </TouchableOpacity>
        </View>
        <View style={localStyles.btnContainer}>
          <TouchableOpacity style={localStyles.nifeLoginBtn} onPress={() => { 
            this.setState({
              isReset: false,
              isBusiness: false,
              modalVisible: true
            });
          }}>
            <Text style={localStyles.loggedOutText}>Login/Sign-up with Nife</Text>
            <Image
              style={localStyles.Logo}
              source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/nife-75d60.appspot.com/o/Nife%20Images%2Flogoicon.PNG?alt=media&token=86fc1470-baf3-472c-bbd3-fad78787eeed' }}
            />
          </TouchableOpacity>
        </View>
        <View style={localStyles.subHeaderContainer}>
          <Text style={localStyles.subHeaderText}>
            Businesses
          </Text>
        </View>
        <View style={localStyles.nifeBuisButtonContainer}>
          <TouchableOpacity style={localStyles.nifeBusLoginBtn} onPress={() => { 
            this.setState({
              isReset: false,
              isBusiness: true,
              modalVisible: true
            }); 
          }}>
            <Text style={localStyles.loggedOutText}>Login/Sign-up with Nife as a business</Text>
            <Image
              style={localStyles.Logo}
              source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/nife-75d60.appspot.com/o/Nife%20Images%2Flogoicon.PNG?alt=media&token=86fc1470-baf3-472c-bbd3-fad78787eeed' }}
            />
          </TouchableOpacity>
        </View>
        <View style={localStyles.forgotButtonContainer}>
          <TouchableOpacity style={localStyles.nifeForgotBtn} onPress={() =>  { 
            this.setState({
              isReset: true,
              isBusiness: false,
              modalVisible: true
            }); 
          }}>
            <Text style={localStyles.loggedOutText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <NifeLoginModal  
        setIsBusiness={this.props.setIsBusiness} 
        isBusiness={this.state.isBusiness} 
        onDismiss={() => this.setState({modalVisible:false})} 
        onSignUp={this.props.onSignUp} 
        isReset={this.state.isReset} 
        modalVisible={this.state.modalVisible} 
        callback={() => {}
        }/>
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  loginContainer: {
    top: 0,
    flex: 1,
    backgroundColor: theme.generalLayout.backgroundColor,
    alignItems: 'center',
    flexDirection:'column'
  },
  subHeaderContainer: {
    width: '50%',
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: theme.generalLayout.secondaryColor,
    borderRadius: 20,
    marginVertical: '5%'
  },
  subHeaderText: {
    textAlign:"center",
    fontSize: 18,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    textShadowColor: '#000',
    color: theme.generalLayout.textColor,
  },
  headerContainer: {
    marginTop:'10%',
    width: '80%',
    paddingBottom: 10,
  },
  headerText: {
    textAlign:"center",
    fontSize: 30,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    textShadowColor: '#000',
    color: theme.generalLayout.textColor,
  },
  googleLoginBtn: {
    backgroundColor: '#228B22',
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 20,
    height: 60,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: 'red',
    borderWidth: 1
  },
  nifeLoginBtn: {
    backgroundColor: theme.generalLayout.backgroundColor,
    borderColor: theme.generalLayout.secondaryColor,
    borderWidth: 1,
    marginTop: '10%',
    borderRadius: 20,
    height: 60,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  nifeBusLoginBtn: {
    backgroundColor: theme.generalLayout.backgroundColor,
    borderColor: theme.generalLayout.secondaryColor,
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 20,
    height: 60,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  nifeForgotBtn: {
    backgroundColor: theme.generalLayout.backgroundColor,
    borderColor: theme.generalLayout.secondaryColor,
    borderWidth: .5,
    marginTop: '30%',
    borderRadius: 20,
    height: 35,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  loggedOutText: {
    color: theme.generalLayout.textColor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  Logo: {
    width: 25, 
    height: 25,
    left: 2,
    borderColor: theme.generalLayout.secondaryColor,
    borderWidth: .2,
    borderRadius: 5
  },
})