import React, {useState} from 'react';
import {Text, TouchableOpacity, TextInput, View} from 'react-native';
import {localStyles} from "./style";
import {Caption, Subheading} from "react-native-paper";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import theme from "../../styles/theme";
import {BackButton} from "../BackButton/BackButton";


export const UserSignUpForm = ({processUserSignUp, handleBackToLogin}) => {
    const [displayName, setDisplayName] = useState('Matt')
    const [email, setEmail] = useState('mattdpalumbo@gmail.com')
    const [password1, setPassword1] = useState('Chicago1!')
    const [password2, setPassword2] = useState('Chicago1!')
    const [eula, setEula] = useState(false)

    return (
        <KeyboardAwareScrollView
            resetScrollToCoords={{x: 0, y: 0}}
            contentContainerStyle={localStyles.loginContainer}
            scrollEnabled={true}
        >
            <BackButton onPress={handleBackToLogin}/>
            <Subheading style={localStyles.Subheading}>Please fill out this form! </Subheading>

                <TextInput secureTextEntry={false} selectionColor={theme.generalLayout.textColor}
                           textContentType={"none"} theme={{colors: {text: theme.generalLayout.textColor}}}
                           placeholderTextColor={theme.generalLayout.fadedText} style={localStyles.textInput}
                           placeholder={'Display Name'} returnKey={'next'} secureText={false}
                           onChangeText={(text) => setDisplayName(text)}/>

                <TextInput secureTextEntry={false} selectionColor={theme.generalLayout.textColor}
                           textContentType={"emailAddress"} theme={{colors: {text: theme.generalLayout.textColor}}}
                           placeholderTextColor={theme.generalLayout.fadedText} style={localStyles.textInput}
                           placeholder={'Email'} returnKey={'next'} secureText={false}
                           onChangeText={(text) => setEmail(text)}/>

                <TextInput secureTextEntry={true} selectionColor={theme.generalLayout.textColor}
                           textContentType={"password"} theme={{colors: {text: theme.generalLayout.textColor}}}
                           placeholderTextColor={theme.generalLayout.fadedText} style={localStyles.textInput}
                           placeholder={'Password'} returnKey={'next'}
                           onChangeText={(text) => setPassword1(text)}/>

                <TextInput secureTextEntry={true} selectionColor={theme.generalLayout.textColor}
                           textContentType={"password"} theme={{colors: {text: theme.generalLayout.textColor}}}
                           placeholderTextColor={theme.generalLayout.fadedText} style={localStyles.textInput}
                           placeholder={'Confirm Password'} returnKey={'next'}
                           onChangeText={(text) => setPassword2(text)}/>
                
                <Text style={{color: 'white', paddingTop: 10, paddingBottom: 10, marginLeft:30, marginRight:15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                           You must read and agree to the following terms. Select ok to continue.
                </Text>
                <Text style={{ color: theme.icons.color, paddingTop: 10, marginLeft:30, marginRight:15}}
                           onPress={() => Linking.openURL('http://google.com')}>
                           Google Terms Link
                </Text>

                <View style={{ marginLeft:20, flexDirection: 'row'}}>
                <Text style={{color:theme.generalLayout.textColor, marginTop: 10, marginLeft:10 }}>Click the checkbox to agree
                </Text>
                <Checkbox 
                    uncheckedColor={theme.generalLayout.textColor}
                    color={theme.icons.color}
                    status={eula ? 'checked' : 'unchecked'}
                    onPress={() => setEula(!eula)}
                />
                </View> 

                {/*  --- if they click the checkbox, we need to store a bool as true in EULA in Users Table
                     --- redux state management for ischecked equivalent ??
                     --- 
                */}

                <TouchableOpacity
                    onPress={() => processUserSignUp({email, password1, password2, displayName, eula})}
                    style={localStyles.signUpBtn}
                >
                    <Caption style={localStyles.Caption}>Sign up</Caption>
                </TouchableOpacity>

                <Text style={localStyles.loginSwitchText}>Already have an account?</Text>
                <TouchableOpacity
                    onPress={handleBackToLogin}
                    style={localStyles.signUpBtn}
                >
                    <Caption style={localStyles.Caption}>Login</Caption>
                </TouchableOpacity>
        </KeyboardAwareScrollView>

    )
}