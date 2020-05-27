import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Modal } from 'react-native';
import FireBaseNifeLogin from '../../../scripts/FirebaseConfig/NifeOAuth';
import InputWithIcon from '../InputWithIcon';

export default class NifeLoginModal extends Component {
    state = {
        modalVisible: false,
        email: "",
        password1: "",
        password2: "",
        displayName: "",
        signUp: true
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.modalVisible !== prevState.modalVisible) {
            return {
                modalVisible: nextProps.modalVisible,
            };
        }
        else {
            return {
                modalVisible: prevState.modalVisible
            }
        }
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
                    FireBaseNifeLogin(this.state, null, (dataObj, error) => {
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
            FireBaseNifeLogin(null, this.state, (dataObj, error) => {
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
            <View style={styles.centeredView}>
                <Modal
                    visible={this.state.modalVisible}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity style={styles.closeBtn}
                                onPress={() => {this.closeModal()}}
                            >
                                <Image style={styles.close} source={require("../../../Media/Images/close.png")}/>
                            </TouchableOpacity>
                            <Text style={styles.modalText}>Hello, please fill out the following information and press "Sign-up" once finished! Thank you!</Text>
                            <View style={ styles.email }>
                                <InputWithIcon name={'ios-mail'} color={'black'} size={12} placeHolderText={'Email'} returnKey={'next'} secureText={false} styles={styles.textInput} onChangeText={(text, type) => this.onChangeText(text, type)} type={'email'} keyboardType={'email-address'} value={this.state.email} onSubmit={(text, eventCount, target) => null}/>
                            </View>
                            <View style={ styles.password1 }>
                                <InputWithIcon name={'ios-lock'} color={'black'} size={12} placeHolderText={'Password'} returnKey={'next'} secureText={true} styles={styles.textInput}  onChangeText={(text, type) => this.onChangeText(text, type)} type={'password1'} keyboardType={'default'} value={this.state.password1} onSubmit={(text, eventCount, target) => null}/>
                            </View>
                            <View style={ styles.password2 }>
                                <InputWithIcon name={'ios-lock'} color={'black'} size={12} placeHolderText={'Password again'} returnKey={'next'}  secureText={true} styles={styles.textInput} onChangeText={(text, type) => this.onChangeText(text, type)} type={'password2'} keyboardType={'default'} value={this.state.password2} onSubmit={(text, eventCount, target) => null}/>
                            </View>
                            <View style={ styles.displayName }>
                                <InputWithIcon name={'ios-person'} color={'black'} size={12} placeHolderText={'Display Name'} returnKey={'done'} secureText={false} styles={styles.textInput}  onChangeText={(text, type) => this.onChangeText(text, type)} type={'displayName'} keyboardType={'default'} value={this.state.displayName} onSubmit={(text, eventCount, target) => null}/>
                            </View>
                            <TouchableOpacity
                                onPress={() => this.authenticateUser('sign-up')}
                                style={styles.signUpBtn}
                            > 
                            <Text>Sign up</Text>
                            </TouchableOpacity>
                            <Text style={styles.loginSwitchText}>Already have an account?</Text>
                            <TouchableOpacity
                                onPress={() => this.setState({signUp: false})}
                                style={styles.loginSwitch}
                            > 
                            <Text>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
            :
            <View style={styles.centeredView}>
                <Modal
                    visible={this.state.modalVisible}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity style={styles.closeBtn}
                                onPress={() => {this.closeModal()}}
                            >
                                <Image style={styles.close} source={require("../../../Media/Images/close.png")}/>
                            </TouchableOpacity>
                            <Text style={styles.modalText}>Hello, please fill out the following information and press "Sign-up" once finished! Thank you!</Text>
                            <View style={ styles.email }>
                                <InputWithIcon name={'ios-mail'} color={'black'} size={12} placeHolderText={'Email'} returnKey={'next'} onSubmitEditing={this.secondTextInput}  secureText={false} onChangeText={(text, type) => this.onChangeText(text, type)} type={'email'} keyboardType={'email-address'}/>
                            </View>
                            <View style={ styles.password1 }>
                                <InputWithIcon name={'ios-lock'} color={'black'} size={12} placeHolderText={'Password'} returnKey={'next'} onSubmitEditing={this.thirdTextInput} ref={this.secondTextInput} secureText={true}  onChangeText={(text, type) => this.onChangeText(text, type)} type={'password1'} keyboardType={'default'}/>
                            </View>
                            <TouchableOpacity
                                onPress={ () => this.authenticateUser('login')}
                                style={styles.loginBtn}
                            > 
                            <Text>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
      top: 0,
      flex: 1,
      backgroundColor: '#e9ebee',
      alignItems: 'center',
    },
    email: {
        top: 10
    },
    password1: {
        top: 20
    },
    password2: {
        top: 30
    },
    displayName: {
        top: 40
    },
    signUpBtn: {
        top: 70,
        backgroundColor: 'lightgrey',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 50,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginBtn: {
        top: 70,
        backgroundColor: 'lightgrey',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 50,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginSwitch: {
        top: 90,
        backgroundColor: 'lightgrey',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 50,
        width: 75,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginSwitchText: {
        top: 80
    },
    centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
    },
    modalView: {
        margin: 30,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        height: 475
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    closeBtn: {
        left: 135,
        bottom: 10
    }
})