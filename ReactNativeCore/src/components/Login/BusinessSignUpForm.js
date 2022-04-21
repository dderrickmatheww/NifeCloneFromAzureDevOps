import React from 'react';
import {Text, TouchableOpacity, TextInput, View} from 'react-native';
import {localStyles} from "./style";
import {Caption, Subheading} from "react-native-paper";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import theme from "../../styles/theme";
import {BackButton} from "../BackButton/BackButton";


export const BusinessSignUpForm = ({handleSignUp, handleBackToLogin}) => {
    return (
        <KeyboardAwareScrollView
            contentContainerStyle={localStyles.loginContainer}
        >
                <BackButton onPress={handleBackToLogin}/>
                <Subheading style={localStyles.Subheading}>Please fill out the information to verify your
                    business!</Subheading>
                <Text style={localStyles.loginSwitchText}>Already have an account?</Text>
                <TouchableOpacity
                    onPress={handleBackToLogin}
                    style={localStyles.signUpBtn}
                >
                    <Caption style={localStyles.Caption}>Login</Caption>
                </TouchableOpacity>
            <View style={{flex: 1}}>
                <TextInput theme={{colors: {text: theme.generalLayout.textColor}}}
                           placeholderTextColor={theme.generalLayout.fadedText}
                           style={localStyles.textInput} placeholder={'Business Name'} returnKey={'next'} secureText={false}
                           onChangeText={(text) => this.onChangeText(text, "businessName")}/>

                <TextInput selectionColor={theme.generalLayout.textColor}
                           theme={{colors: {text: theme.generalLayout.textColor}}}
                           placeholderTextColor={theme.generalLayout.fadedText}
                           style={localStyles.textInput} placeholder={'Your Name'} returnKey={'next'}
                           secureTextEntry={false} onChangeText={(text) => this.onChangeText(text, "ownerName")}/>

                <TextInput selectionColor={theme.generalLayout.textColor} t textContentType={"emailAddress"}
                           secureTextEntry={false} theme={{colors: {text: theme.generalLayout.textColor}}}
                           placeholderTextColor={theme.generalLayout.fadedText} style={localStyles.textInput}
                           placeholder={'Email'} returnKey={'next'}
                           onChangeText={(text) => this.onChangeText(text, "businessEmail")}/>

                <TextInput selectionColor={theme.generalLayout.textColor} keyboardType={"phone-pad"}
                           theme={{colors: {text: theme.generalLayout.textColor}}}
                           placeholderTextColor={theme.generalLayout.fadedText}
                           style={localStyles.textInput} placeholder={'Phone Number'} returnKey={'next'}
                           secureTextEntry={false} onChangeText={(text) => this.onChangeText(text, "businessPhone")}/>

                <TextInput selectionColor={theme.generalLayout.textColor}
                           theme={{colors: {text: theme.generalLayout.textColor}}}
                           placeholderTextColor={theme.generalLayout.fadedText}
                           style={localStyles.textInput} placeholder={'Address'} returnKey={'next'} secureTextEntry={false}
                           onChangeText={(text) => this.onChangeText(text, "Address")}/>

                <TextInput selectionColor={theme.generalLayout.textColor}
                           theme={{colors: {text: theme.generalLayout.textColor}}}
                           placeholderTextColor={theme.generalLayout.fadedText}
                           style={localStyles.textInput} placeholder={'City'} returnKey={'next'} secureTextEntry={false}
                           onChangeText={(text) => this.onChangeText(text, "City")}/>

                <TextInput selectionColor={theme.generalLayout.textColor}
                           theme={{colors: {text: theme.generalLayout.textColor}}}
                           placeholderTextColor={theme.generalLayout.fadedText}
                           style={localStyles.textInput} placeholder={'State'} returnKey={'next'} secureTextEntry={false}
                           onChangeText={(text) => this.onChangeText(text, "State")}/>

                <TextInput selectionColor={theme.generalLayout.textColor} secureTextEntry={true}
                           textContentType={"password"} theme={{colors: {text: theme.generalLayout.textColor}}}
                           placeholderTextColor={theme.generalLayout.fadedText} style={localStyles.textInput}
                           placeholder={'Password'} returnKey={'next'} secureText={false}
                           onChangeText={(text) => this.onChangeText(text, "password1")}/>

                <TextInput selectionColor={theme.generalLayout.textColor} secureTextEntry={true}
                           textContentType={"password"} theme={{colors: {text: theme.generalLayout.textColor}}}
                           placeholderTextColor={theme.generalLayout.fadedText} style={localStyles.textInput}
                           placeholder={'Confirm Password'} returnKey={'next'} secureText={false}
                           onChangeText={(text) => this.onChangeText(text, "password2")}/>

            </View>

                <TouchableOpacity
                    onPress={handleSignUp}
                    style={localStyles.signUpBtn}
                >
                    <Caption style={localStyles.Caption}>Sign up</Caption>
                </TouchableOpacity>

        </KeyboardAwareScrollView>

    )
}