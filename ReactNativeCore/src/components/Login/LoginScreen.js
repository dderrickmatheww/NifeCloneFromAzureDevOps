import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { googleLogin } from "../../utils/google";
import { UserSection } from "./UserSection";
import { BusinessSection } from "./BusinessSection";
import { ForgotButton } from "./ForgotButton";
import { localStyles } from "./style";
import { LoginForm } from "./LoginForm";
import { auth, firebaseSignUp, fireBaseLogin } from "../../utils/firebase";
import { UserSignUpForm } from "./UserSignUpForm";
import { BusinessSignUpForm } from "./BusinessSignUpForm";
import { passwordValidation } from "../../utils/util";
import { connect } from 'react-redux';

const formScreens = Object.freeze({
    main: 'main',
    login: 'login',
    userSignUp: 'userSignUp',
    businessSignUp: 'businessSignUp',
    forgotPassword: 'forgotPassword'
})

export class LoginScreen extends Component {

    state = {
        isLoggedin: !!auth.currentUser,
        userData: auth.currentUser ? auth.currentUser : null,
        isReset: false,
        isBusiness: false,
        formScreen: formScreens.main
    }

    logout = async () => {
        this.setState({isLoggedin: false});
        await auth.signOut();
    }

    handleGoogleClick = async () => {
        await googleLogin()
    }

    handleNifeLogin = () => {
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

    handleBusinessLogin = () => {
        this.setState({
            isBusiness: true,
            formScreen: formScreens.login
        });
    }

    handleForgotPassword = () => {
        this.setState({
            isBusiness: false,
            formScreen: formScreens.forgotPassword
        });
    }

    handleSignUp = () => {
        if(this.state.isBusiness){
            this.setState({
                formScreen: formScreens.businessSignUp
            });
        } else {
            this.setState({
                formScreen: formScreens.userSignUp
            });
        }
    }

    handleBackToLogin = () => {
        this.setState({
            formScreen: formScreens.login
        });
    }

    processUserSignUp = async ({email, password1, password2, displayName}) => {

        const validPassword = passwordValidation(password1, password2);
        if(validPassword)
        {
            await firebaseSignUp({email, password: password1, displayName});
        }
    }

    processUserLogin = async (email, password) => {
        await fireBaseLogin(email, password);
     }

    processBusinessSignUp = () => {

    }

    render() {
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
                        {/*<BusinessSection onPress={this.handleBusinessLogin}/>*/}
                        <ForgotButton onPress={this.handleForgotPassword}/>
                    </View>
                );
            case formScreens.login:
                return (
                    <LoginForm
                        backToMain={this.handleBackToMain}
                        handleSignUp={this.handleSignUp}
                        processUserLogin={this.processUserLogin}
                        isBusiness={this.state.isBusiness}
                    />
                );
            case formScreens.userSignUp:
                return (
                    <UserSignUpForm
                        processUserSignUp={this.processUserSignUp}
                        handleBackToLogin={this.handleBackToLogin}
                    />
                );
            // case formScreens.businessSignUp:
            //     return (
            //         <BusinessSignUpForm
            //             handleSignUp={this.processUserSignUp}
            //             handleBackToLogin={this.handleBackToLogin}
            //         />
            //     );
        }

    }
}

function mapStateToProps(state){
    return {
        ...state
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refresh: ({ userData, feedData, displayName }) => dispatch({
            type:'REFRESH', 
            data: {
                userData,
                feedData,
                displayName
            }
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)( LoginScreen );