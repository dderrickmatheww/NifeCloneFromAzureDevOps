import React, { Component } from 'react';
import { View, Text, } from 'react-native';
import NifeLoginModal from './LoginModal';
import * as firebase from 'firebase';
import {googleLogin} from "../../scripts/google";
import {UserSection} from "./UserSection";
import {BusinessSection} from "./BusinessSection";
import * as PropTypes from "prop-types";
import {ForgotButton} from "./ForgotButton";
import {localStyles} from "./style";

ForgotButton.propTypes = {onPress: PropTypes.func};
export default class LoginScreen extends Component {
  state = {
    isLoggedin: firebase.auth().currentUser ? true : false,
    userData: firebase.auth().currentUser ? firebase.auth().currentUser : null,
    modalVisible: false,
    isReset: false,
    isBusiness: false
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

  handleGoogleClick = async () => {
    console.log('handleGoogleClick')
    const data = await googleLogin()
    await this.setUserData(data.user);
    await this.setLoggedinStatus(data);
    if (this.props.navigate) {
      this.props.navigate.navigate("My Feed", { screen:"Friend's Feed", params: { refresh: this.props.refresh } });
    }
  }

  handleNifeLogin =  () => {
    this.setState({
      isReset: false,
      isBusiness: false,
      modalVisible: true
    });
  }

  handleBusinessLogin() {
    this.setState({
      isReset: false,
      isBusiness: true,
      modalVisible: true
    });
  }

  handleForgotPassword() {
    this.setState({
      isReset: true,
      isBusiness: false,
      modalVisible: true
    });
  }

  render () {
    return ( 
      <View style={localStyles.loginContainer}>
        {/*HEADER*/}
        <View style={localStyles.headerContainer}>
          <Text style={localStyles.headerText}>{this.props.text}</Text>
        </View>
        {/*BODY*/}
        <UserSection googleLogin={this.handleGoogleClick} onPress1={this.handleNifeLogin}/>
        <BusinessSection onPress={this.handleBusinessLogin}/>
        <ForgotButton onPress={this.handleForgotPassword}/>
        {/*BODY*/}
        <NifeLoginModal
            setIsBusiness={this.props.setIsBusiness}
            isBusiness={this.state.isBusiness}
            onDismiss={() => this.setState({modalVisible: false})}
            onSignUp={this.props.onSignUp}
            isReset={this.state.isReset}
            modalVisible={this.state.modalVisible}
            callback={() => {
              if (this.props.navigate) {
                this.setState({modalVisible: false});
                this.props.navigate.navigate("My Feed", {
                  screen: "Friend's Feed",
                  params: {refresh: this.props.refresh}
                });
              }
            }}
        />
      </View>
    );
  }
}