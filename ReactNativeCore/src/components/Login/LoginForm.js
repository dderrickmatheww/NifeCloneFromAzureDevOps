import React, {useState} from 'react';
import {  Text, TouchableOpacity, TextInput} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {Subheading, Caption } from 'react-native-paper';
import theme from "../../styles/theme";
import {localStyles} from "./style";
import {BackButton} from "../BackButton/BackButton";
import {fireBaseLogin} from "../../utils/firebase";


export const LoginForm = ({backToMain, handleSignUp}) => {
    const [email, setEmail] = useState('mattdpalumbo@gmail.com');
    const [password, setPassword] = useState('Chicago1!');
    const handleLogin = async () => {
       await fireBaseLogin(email, password);
    }
    return (
        <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={localStyles.loginContainer}
            scrollEnabled={true}
        >
            <BackButton onPress={backToMain}/>
            <Subheading style={localStyles.Subheading}>Please enter your credentials to login!</Subheading>
                <TextInput
                    selectionColor={theme.generalLayout.textColor}
                    textContentType={"emailAddress"}
                    theme={{colors:{text: theme.generalLayout.textColor}}}
                    placeholderTextColor={theme.generalLayout.fadedText}
                    style={localStyles.textInput}
                    placeholder={'Email'}
                    returnKey={'next'} secureText={false}
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput secureTextEntry={true}
                           selectionColor={theme.generalLayout.textColor}
                           textContentType={"password"}
                           theme={{ colors: { text: theme.generalLayout.textColor} }}
                           placeholderTextColor={theme.generalLayout.fadedText}
                           style={localStyles.textInput}
                           placeholder={'Password'}
                           returnKey={'next'}
                           onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity onPress={handleLogin} style={localStyles.signUpBtn}
                >
                    <Caption style={localStyles.Caption}>Log In</Caption>
                </TouchableOpacity>

                <Text style={localStyles.loginLoginSwitchText}>Need to make an account?</Text>
                <TouchableOpacity
                    onPress={handleSignUp}
                    style={localStyles.signUpBtn}
                >
                    <Caption style={localStyles.Caption}>Sign Up</Caption>
                </TouchableOpacity>
        </KeyboardAwareScrollView>
    )
}