import React, { Component } from 'react';
import { View, Text, } from 'react-native';
import * as firebase from 'firebase';
import {googleLogin} from "../../scripts/google";
import {UserSection} from "./UserSection";
import {BusinessSection} from "./BusinessSection";
import {ForgotButton} from "./ForgotButton";
import {localStyles} from "./style";
import {LoginForm} from "./LoginForm";

const formScreens = Object.freeze({
    main: 'main',
    login: 'login',
    userSignUp: 'userSignUp',
    businessSignUp: 'businessSignUp',
    forgotPassword: 'forgotPassword'
})

export default class LoginScreen extends Component {

    state = {
        isLoggedin: firebase.auth().currentUser ? true : false,
        userData: firebase.auth().currentUser ? firebase.auth().currentUser : null,
        modalVisible: false,
        isReset: false,
        isBusiness: false,
        formScreen: formScreens.main
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
            isBusiness: false,
            formScreen: formScreens.login
        });
    }

    handleBackToMain = () => {
        this.setState({
            isBusiness: false,
            formScreen: formScreens.main
        })
    }

    handleBusinessLogin() {
        this.setState({
            isBusiness: true,
            formScreen: formScreens.businessSignUp
        });
    }

    handleForgotPassword() {
        this.setState({
            isBusiness: false,
            formScreen: formScreens.forgotPassword
        });
    }

    render () {
        switch (this.state.formScreen) {
            case formScreens.main:
                return (
                    <View style={localStyles.loginContainer}>
                        {/*HEADER*/}
                        <View style={localStyles.headerContainer}>
                            <Text style={localStyles.headerText}>Please login to continue!</Text>
                        </View>
                        {/*BODY*/}
                        <UserSection googleLogin={this.handleGoogleClick} onPress1={this.handleNifeLogin}/>
                        <BusinessSection onPress={this.handleBusinessLogin}/>
                        <ForgotButton onPress={this.handleForgotPassword}/>
                    </View>
                );
            case formScreens.login:
            return (
                <LoginForm backToMain={this.handleBackToMain}/>
            );
        }

    }
}