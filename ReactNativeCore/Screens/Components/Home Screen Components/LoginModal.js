import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image  } from 'react-native';
import Util from '../../../scripts/Util';
import {Modal, Subheading, Caption, TextInput,} from 'react-native-paper';
import {styles} from '../../../Styles/style';
import theme from '../../../Styles/theme';

export default class NifeLoginModal extends Component {
    state = {
        modalVisible: false,
        email: "",
        password1: "",
        password2: "",
        displayName: "",
        signUp: true
    }

    

    onChangeText = (text, type) => {
       if(type == "email") {
        this.setState({email: text});
       }
       else if (type == "password1") {
        this.setState({password1: text});
       }
       else if (type == "password2") {
        this.setState({password2: text});
       }
       else if (type == "displayName"){
        this.setState({displayName: text});
       }
    }

    authenticateUser = (event) => {
        if (event == 'sign-up') {
            if(this.state.password1 === this.state.password2) {
                if(!this.state.email || !this.state.password1 || !this.state.displayName) {
                    alert('Please enter correct sign-up information')
                }
                else if (this.state.password1.length < 8) {
                    alert('Your password must be great than eight characters!')
                }
                else {
                    this.props.onSignUp(this.state);
                    Util.dataCalls.Nife.login(this.state, null, (dataObj, error) => {
                        if(error) {
                            alert(error);
                            this.resetPasswordField();
                        } 
                        else {
                            this.props.callback(dataObj);
                        }
                    });
                }
            }
            else {
                alert("Your passwords do not match. Please try again. :)")
            }
        } 
        else {
            if(!this.state.email || !this.state.password1) {
                alert('Please enter correct sign-up information')
            }
            else {
                Util.dataCalls.Nife.login(null, this.state, (dataObj, error) => {
                    if(error) {
                        alert(error);
                        this.resetPasswordField();
                    } 
                    else {
                        this.props.callback(dataObj);
                    }
                });
            }
            
        }
    }

    closeModal = () => {
        this.props.callback(false);
    }

    resetPasswordField = () => {
        this.setState({password1: ""});
        this.setState({password2: ""});
    }

    render () {
        return (
            
            this.state.signUp ?
                <Modal
                    visible={this.props.modalVisible}
                    dismissable={true}
                    onDismiss={this.props.onDismiss}
                    contentContainerStyle={localStyles.Modal}
                >
                    <Subheading style={localStyles.Subheading}>Please fill out this form so we can get a pulse on the night for you. </Subheading>
                    <View style={localStyles.Container}>
                        <TextInput textContentType={"none"} theme={{colors:{text:theme.LIGHT_PINK}}}  placeholderTextColor={theme.LIGHT_PINK_OPAC} style={localStyles.textInput} placeholder={'Display Name'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "displayName")} />
                        <TextInput textContentType={"emailAddress"}  theme={{colors:{text:theme.LIGHT_PINK}}}  placeholderTextColor={theme.LIGHT_PINK_OPAC} style={localStyles.textInput} placeholder={'Email'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "email")} />
                        <TextInput secureTextEntry={true} textContentType={"password"}  theme={{colors:{text:theme.LIGHT_PINK}}}  placeholderTextColor={theme.LIGHT_PINK_OPAC} style={localStyles.textInput} placeholder={'Password'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "password1")} />
                        <TextInput secureTextEntry={true} textContentType={"password"}  theme={{colors:{text:theme.LIGHT_PINK}}} placeholderTextColor={theme.LIGHT_PINK_OPAC} style={localStyles.textInput} placeholder={'Confirm Password'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "password2")} />
                        
                        <TouchableOpacity
                            onPress={() => this.authenticateUser('sign-up')}
                            style={localStyles.signUpBtn}
                        > 
                        
                            <Caption style={localStyles.Caption}>Sign up</Caption>
                        </TouchableOpacity>

                        <Text style={localStyles.loginSwitchText}>Already have an account?</Text>
                        <TouchableOpacity
                            onPress={() => this.setState({signUp: false})}
                            style={localStyles.loginSwitch}
                        > 
                            <Caption style={localStyles.Caption}>Login</Caption>
                        </TouchableOpacity>
                    </View>
                </Modal>
                :
                <Modal
                    visible={this.props.modalVisible}
                    dismissable={true}
                    onDismiss={this.props.onDismiss}
                    contentContainerStyle={localStyles.Modal}
                >
                    <Subheading style={localStyles.Subheading}>Please enter your credentials to sign in... </Subheading>
                    <View style={localStyles.Container}>
                        <TextInput textContentType={"emailAddress"}  theme={{colors:{text:theme.LIGHT_PINK}}}  placeholderTextColor={theme.LIGHT_PINK_OPAC} style={localStyles.textInput} placeholder={'Email'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "email")} />
                        <TextInput secureTextEntry={true} textContentType={"password"}  theme={{colors:{text:theme.LIGHT_PINK}}}  placeholderTextColor={theme.LIGHT_PINK_OPAC} style={localStyles.textInput} placeholder={'Password'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "password1")} />
                        
                        <TouchableOpacity
                            onPress={() => this.authenticateUser('login')}
                            style={localStyles.signUpBtn}
                        > 
                        
                            <Caption style={localStyles.Caption}>Log In</Caption>
                        </TouchableOpacity>

                        <Text style={localStyles.loginSwitchText}>Need to make an account?</Text>
                        <TouchableOpacity
                            onPress={() => this.setState({signUp: true})}
                            style={localStyles.loginSwitch}
                        > 
                            <Caption style={localStyles.Caption}>Sign Up</Caption>
                        </TouchableOpacity>
                    </View>
                </Modal>

        );
    }
}
const localStyles = StyleSheet.create({
    loginSwitchText:{
        color:theme.LIGHT_PINK, 
        fontSize:15,
        marginTop:50,
        textAlign:"center",
        marginBottom: 10
    },
    loginSwitch:{
        borderColor:theme.LIGHT_PINK,
        borderRadius:10,
        alignSelf:"center",
        borderWidth: 1,
        paddingHorizontal:5,
        paddingVertical:2
    },
    signUpBtn:{
        borderColor:theme.LIGHT_PINK,
        borderRadius:10,
        alignSelf:"center",
        borderWidth: 1,
        paddingHorizontal:5,
        paddingVertical:2,
        marginTop:7,

    },
    Caption:{
        color:theme.LIGHT_PINK, 
        fontSize:15
    },
    textInput:{
        width:"90%",
        alignSelf:"center",
        marginVertical:2,
        color:theme.LIGHT_PINK,
        fontSize:15,
        shadowOffset:{width:-5, height:-5}
    },
    Modal:{
        backgroundColor:theme.DARK,
        width:"90%",
        height:"85%",
        alignSelf:"center",
        justifyContent:"flex-start",
        borderRadius:10,
        color:theme.LIGHT_PINK
    },
    Subheading:{
        color:theme.LIGHT_PINK,
        textAlign:'center',
        alignSelf:"flex-start",
        marginBottom:50,
        marginTop:30,
        width:"90%"
    },
    Container:{
        flexDirection:'column',
        justifyContent:"center",
        alignContent:"center",
        textAlign:"center"
    },
})