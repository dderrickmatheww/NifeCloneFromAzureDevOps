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
import { passwordValidation, alert, logger } from "../../utils/util";
import { getBusinessesByPhoneNumber } from "../../utils/api/yelp";
import { connect } from 'react-redux';
import { Loading } from '../Loading/index'; 
import uuid from 'react-native-uuid';

const formScreens = Object.freeze({
    main: 'main',
    login: 'login',
    userSignUp: 'userSignUp',
    businessSignUp: 'businessSignUp',
    forgotPassword: 'forgotPassword',
    loading: 'loading'
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

    handleNifeSignUp = () => {
        this.setState({
            isBusiness: false,
            formScreen: formScreens.userSignUp
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

    handleBackToBusinessSignUp = () => {
        this.setState({
            isBusiness: true,
            formScreen: formScreens.businessSignUp
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

    loading = () => {
        this.setState({
            formScreen: formScreens.loading
        });
    }

    handleBackToLogin = () => {
        this.setState({
            formScreen: formScreens.login
        });
    }

    processUserSignUp = async ({email, password1, password2, displayName}) => {
        try {
            this.loading();
            const validPassword = passwordValidation(password1, password2);
            if(validPassword)
            {
                await firebaseSignUp({email, password: password1, displayName});
            }
        }
        catch ({ message }) {
            logger(message);
            this.handleNifeSignUp();
        }
    }

    processUserLogin = async (email, password) => {
        try {
            this.loading();
            const { userData, businessData } = await fireBaseLogin(email, password);
            console.log(businessData)
            this.props.refresh({ userData, businessData });
        }
        catch ({ message }) {
            logger(message);
            this.handleNifeLogin();
        }
     }

    processBusinessSignUp = async (signUpObj) => {
        try {
            this.loading();
            const { 
                email, 
                password1, 
                password2, 
                displayName, 
                ownerName, 
                street, 
                city, 
                state, 
                zip, 
                proofOfAddress 
            } = signUpObj;
            let { phoneNumber } = signUpObj;
            const signUpValidation = this.validation(signUpObj, password1, password2, phoneNumber);
            if (!signUpValidation) return;
            phoneNumber = `+1${signUpObj.phoneNumber}`;
            const [yelpVerification] = await getBusinessesByPhoneNumber({ phoneNumber });
            let verified, yelpId;
            if (!yelpVerification.id) {
                yelpId = uuid.v4();
                verified = false;
                alert("We were not able to verify your business automatically. Your sign up will be manually reviewed, this may take 3-5 business days.");
            }
            else {
                yelpId = yelpVerification.id;
                verified = true;
            }
            const { userData, businessData } = await firebaseSignUp({ 
                email, 
                password: password1, 
                displayName: ownerName, 
                businessName: displayName, 
                uuid: yelpId, 
                street, 
                city, 
                state, 
                phoneNumber,
                zip, 
                proofOfAddress, 
                verified
            });
            this.props.refresh({ userData, businessData });
        }
        catch ({ message }) {
            logger(message);
            this.handleBackToBusinessSignUp();
        }
    }

    validation = (signUpObj, password1, password2, phoneNumber) => {
        const phoneno = /^\d{10}$/;
        let returnValue = true;
        let string = `Please fill out all feild in the form. (`;
        for (let prop in signUpObj) {
            if (!signUpObj[prop]) {
                string += `${prop}, `;
                returnValue = false;
            }
        }
        if (!returnValue)  { 
            const length = string.length;
            string = string.slice(0, length - 2);
            string += `)`;
            alert(string); 
            return false; 
        }
        const validPassword = passwordValidation(password1, password2);
        if (!validPassword)  {
            return false;
        };
        if (!phoneNumber.toString().match(phoneno)) {
            alert("Please make sure your phone number is in the proper format (Ex: 8432345678)."); 
            return false;
        }
        return returnValue;
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
                        <UserSection googleLogin={this.handleGoogleClick} onPress1={this.handleNifeLogin} />
                        <BusinessSection onPress={this.handleBusinessLogin} />
                        <ForgotButton onPress={this.handleForgotPassword} />
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
            case formScreens.businessSignUp:
                return (
                    <BusinessSignUpForm
                        processBusinessSignUp={this.processBusinessSignUp}
                        handleBackToLogin={this.handleBackToLogin}
                    />
                );
            case formScreens.loading:
                return (
                    <Loading />
                );
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
        refresh: ({ userData, feedData, businessData, displayName }) => dispatch({
            type:'REFRESH', 
            data: {
                userData,
                feedData,
                displayName,
                businessData
            }
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)( LoginScreen );