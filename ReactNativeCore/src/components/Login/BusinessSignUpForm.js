import React, { useState } from 'react';
import { Text, TouchableOpacity, TextInput, View, ScrollView } from 'react-native';
import { localStyles } from "./style";
import { Caption, Subheading, Button } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import theme from "../../styles/theme";
import { BackButton } from "../BackButton/BackButton";
import { uploadImage } from '../../utils/api/users';
import { alert } from "../../utils/util";


export const BusinessSignUpForm = ({ processBusinessSignUp, handleBackToLogin }) => {
    const [displayName, setDisplayName] = useState('')
    const [ownerName, setOwnerName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhone] = useState('')
    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zip, setZip] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [saving, isSaving] = useState(false)
    const [proofOfAddress, setProofOfAddress] = useState('')

    const uploadProofOfAddress = async () => {
        if (!email) {
            alert('Fill in an email before uploading a document!');
            return;
        }
        isSaving(true); 
        const image = await uploadImage(email);
        setProofOfAddress(image);
        isSaving(false); 
    }

    return (
        <ScrollView style={{ backgroundColor: theme.generalLayout.backgroundColor }}>
            <KeyboardAwareScrollView
                resetScrollToCoords={{ x: 0, y: 0 }}
                style={{ padding: '5%' }}
                contentContainerStyle={localStyles.loginContainer}
                scrollEnabled={true}
            >
                <BackButton onPress={handleBackToLogin}/>
                <Subheading style={localStyles.Subheading}>Please fill out the information to verify your business!</Subheading>
                <View style={{flex: 1}}>
                    <TextInput 
                        theme={{colors: {text: theme.generalLayout.textColor}}}
                        placeholderTextColor={theme.generalLayout.fadedText}
                        style={localStyles.textInput} 
                        placeholder={'Business Name'} 
                        returnKey={'next'} 
                        secureText={false}
                        onChangeText={(text) => setDisplayName(text)}
                    />

                    <TextInput 
                        selectionColor={theme.generalLayout.textColor}
                        theme={{colors: {text: theme.generalLayout.textColor}}}
                        placeholderTextColor={theme.generalLayout.fadedText}
                        style={localStyles.textInput} 
                        placeholder={'Your Legal Name'} 
                        returnKey={'next'}
                        secureTextEntry={false} 
                        onChangeText={(text) => setOwnerName(text)}
                    />

                    <TextInput 
                        selectionColor={theme.generalLayout.textColor} 
                        textContentType={"emailAddress"}
                        secureTextEntry={false} 
                        theme={{colors: {text: theme.generalLayout.textColor}}}
                        placeholderTextColor={theme.generalLayout.fadedText} 
                        style={localStyles.textInput}
                        placeholder={'Personal Email'} 
                        returnKey={'next'}
                        onChangeText={(text) => setEmail(text)}
                    />

                    <TextInput 
                        selectionColor={theme.generalLayout.textColor} 
                        keyboardType={"phone-pad"}
                        theme={{colors: {text: theme.generalLayout.textColor}}}
                        placeholderTextColor={theme.generalLayout.fadedText}
                        style={localStyles.textInput} 
                        placeholder={'Business Phone Number (Ex: 8432134567)'} 
                        returnKey={'next'}
                        secureTextEntry={false} 
                        onChangeText={(text) => setPhone(text)}
                    />

                    <TextInput
                        selectionColor={theme.generalLayout.textColor}
                        theme={{colors: {text: theme.generalLayout.textColor}}}
                        placeholderTextColor={theme.generalLayout.fadedText}
                        style={localStyles.textInput} 
                        placeholder={'Business Address'} 
                        returnKey={'next'} 
                        secureTextEntry={false}
                        onChangeText={(text) => setStreet(text)}
                    />

                    <TextInput 
                        selectionColor={theme.generalLayout.textColor}
                        theme={{colors: {text: theme.generalLayout.textColor}}}
                        placeholderTextColor={theme.generalLayout.fadedText}
                        style={localStyles.textInput} 
                        placeholder={'City'} 
                        returnKey={'next'} 
                        secureTextEntry={false}
                        onChangeText={(text) => setCity(text)}
                    />

                    <TextInput 
                        selectionColor={theme.generalLayout.textColor}
                        theme={{colors: {text: theme.generalLayout.textColor}}}
                        placeholderTextColor={theme.generalLayout.fadedText}
                        style={localStyles.textInput} 
                        placeholder={'State'} 
                        returnKey={'next'} 
                        secureTextEntry={false}
                        onChangeText={(text) => setState(text)}
                    />

                    <TextInput 
                        selectionColor={theme.generalLayout.textColor}
                        theme={{colors: {text: theme.generalLayout.textColor}}}
                        placeholderTextColor={theme.generalLayout.fadedText}
                        style={localStyles.textInput} 
                        placeholder={'Zip'} 
                        returnKey={'next'} 
                        secureTextEntry={false}
                        onChangeText={(text) => setZip(text)}
                    />

                    <TextInput 
                        selectionColor={theme.generalLayout.textColor} 
                        secureTextEntry={true}
                        textContentType={"password"} 
                        theme={{colors: {text: theme.generalLayout.textColor}}}
                        placeholderTextColor={theme.generalLayout.fadedText} 
                        style={localStyles.textInput}
                        placeholder={'Password'} 
                        returnKey={'next'} 
                        secureText={false}
                        onChangeText={(text) => setPassword1(text)}
                    />

                    <TextInput 
                        selectionColor={theme.generalLayout.textColor} 
                        secureTextEntry={true}
                        textContentType={"password"} 
                        theme={{colors: {text: theme.generalLayout.textColor}}}
                        placeholderTextColor={theme.generalLayout.fadedText} 
                        style={localStyles.textInput}
                        placeholder={'Confirm Password'} returnKey={'next'} 
                        secureText={false}
                        onChangeText={(text) => setPassword2(text)}
                    />

                </View>

                <Text style={localStyles.loginSwitchText}>Please upload proof of address!</Text>
                <Text style={localStyles.loginSwitchText}>Nife accepts the following documents</Text>
                <Text style={localStyles.loginSwitchText}>Utility bill, lease, mortgage statement, landlord verification, business license or articles of incorporation!</Text>
                <Button
                    labelStyle={{ color: theme.generalLayout.textColor }}
                    style={localStyles.signUpBtn}
                    contentStyle={{ width: '100%', borderColor: theme.generalLayout.secondaryColor }}
                    icon="camera"
                    loading={saving}
                    mode="contained"
                    onPress={uploadProofOfAddress}
                    disabled={!proofOfAddress ? false : true}
                >
                    {!proofOfAddress ? "Upload Document" : "Document Uploaded!"}
                </Button> 


                <TouchableOpacity
                    onPress={() => processBusinessSignUp({ email, password1, password2, displayName, state, city, street, ownerName, phoneNumber, proofOfAddress, zip })}
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
        </ScrollView>
    )
}