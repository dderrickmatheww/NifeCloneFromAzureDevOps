import React from 'react';
import {  Text, TouchableOpacity, TextInput} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {Subheading, Caption } from 'react-native-paper';
import theme from "../../styles/theme";
import {localStyles} from "./style";
import {Ionicons} from "@expo/vector-icons";


export const LoginForm = (props) => {
    const {backToMain} = props;
    return (
        <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={localStyles.loginContainer}
            scrollEnabled={true}
        >
            <TouchableOpacity onPress={() => { backToMain() }} style={localStyles.backButton}
            >
                <Ionicons
                name="chevron-back"
                color={theme.generalLayout.secondaryColor}
                size={20}
                />
            </TouchableOpacity>
            <Subheading style={localStyles.Subheading}>Please enter your credentials to login!</Subheading>
                <TextInput
                    selectionColor={theme.generalLayout.textColor}
                    textContentType={"emailAddress"}
                    theme={{colors:{text: theme.generalLayout.textColor}}}
                    placeholderTextColor={theme.generalLayout.fadedText}
                    style={localStyles.textInput}
                    placeholder={'Email'}
                    returnKey={'next'} secureText={false}
                    // onChangeText={(text) => this.onChangeText(text, "email")}
                />
                <TextInput secureTextEntry={true}
                           selectionColor={theme.generalLayout.textColor}
                           textContentType={"password"}
                           theme={{ colors: { text: theme.generalLayout.textColor} }}
                           placeholderTextColor={theme.generalLayout.fadedText}
                           style={localStyles.textInput}
                           placeholder={'Password'}
                           returnKey={'next'}
                           // onChangeText={(text) => this.onChangeText(text, "password1")}
                />
                <TouchableOpacity onPress={() => {  }} style={localStyles.signUpBtn}
                >
                    <Caption style={localStyles.Caption}>Log In</Caption>
                </TouchableOpacity>

                <Text style={localStyles.loginLoginSwitchText}>Need to make an account?</Text>
                <TouchableOpacity
                    onPress={() => this.setState({signUp: true})}
                    style={localStyles.signUpBtn}
                >
                    <Caption style={localStyles.Caption}>Sign Up</Caption>
                </TouchableOpacity>
        </KeyboardAwareScrollView>
    )
}