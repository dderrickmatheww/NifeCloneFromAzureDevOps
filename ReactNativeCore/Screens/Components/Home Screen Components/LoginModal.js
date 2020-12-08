import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import Util from '../../../scripts/Util';
import { Modal, Subheading, Caption, TextInput, ActivityIndicator } from 'react-native-paper';
import { styles } from '../../../Styles/style';
import theme from '../../../Styles/theme';
import * as ImagePicker from 'expo-image-picker';

export default class NifeLoginModal extends Component {
    state = {
        modalVisible: false,
        email: "",
        password1: "",
        password2: "",
        displayName: "",
        signUp: true,
        bussinessApplication: false,
        bussinessApplicationPt2: false,
        businessName: "",
        ownerName: "",
        businessEmail: "",
        businessPhone: "",
        Address: "",
        City: "",
        State: "",
        zip: "",
        businessId: "",
        coordinates: null,
        proofURI: null,
        imageLoading: false,
        verifying: false,
        isReset: false
    }

    onChangeText = (text, type) => {
        this.setState({[type]: text});
    }

    authenticateUser = (event) => {
        if (event == 'sign-up') {
            if(this.state.password1 === this.state.password2) {
                if (!this.state.businessEmail) {
                    if(!this.state.email || !this.state.password1 || !this.state.displayName) {
                        alert('Please make sure all fields are filled out!');
                    }
                    else if (this.state.password1.length < 8) {
                        alert('Your password must be great than eight characters!');
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
                    if(!this.state.businessEmail || !this.state.password1 || !this.state.businessName) {
                        alert('Please enter correct sign-up information for buisnesses');
                    }
                    else if (this.state.password1.length < 8) {
                        alert('Your password must be great than eight characters!');
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
            }
            else {
                alert("Your passwords do not match. Please try again. :)");
            }
        } 
        else {
            if(!this.state.email || !this.state.password1) {
                alert('Please enter correct sign-up information');
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
        this.setState({ password1: "" });
        this.setState({ password2: "" });
    }

    verifyBusiness = () => {
        this.setState({ verifying: true });
        let address = this.state.Address;
        let city = this.state.City;
        let state = this.state.State;
        let zip = this.state.zip;
        let name = this.state.businessName;
        if(address != null & city  != null  & state != null  & zip != null  & name != null ){
            Util.dataCalls.Yelp.businessVerification(name, address, city, state, zip, "US", (data) => {
                if (data.businesses && data.businesses.length > 0) {
                    this.setState({
                        businessId: data.businesses[0].id,
                        coordinates: data.businesses[0].coordinates,
                        bussinessApplicationPt2: true
                    });
                    this.props.setBusiness(true, this.state);
                } else {
                    alert('We could not find your business... make sure your contact information matches other online sources...');
                }
            });
        }
        else {
            alert('Please fill out all forms, make sure your contact information matches other online sources...');
        }
    }

    uploadProofImage = () => {
        let businessEmail = this.state.businessEmail;
        let busName = this.state.businessName;
        ImagePicker.getCameraRollPermissionsAsync()
        .then((result) => {
            if(result.status == "granted") {
                this.setState({ imageLoading: true });
                ImagePicker.launchImageLibraryAsync()
                .then((image) => {
                    this.setState({uploading:true});
                    let uri = image.uri;
                    Util.business.UploadAddressProof(uri, busName, businessEmail, (image)=>{
                        this.setState({ proofURI: image });
                    });
                });
            }
            else {
                ImagePicker.requestCameraRollPermissionsAsync()
                .then((result) => {
                    if (result.status == "granted") {
                        ImagePicker.launchImageLibraryAsync()
                        .then((image) => {
                            let uri = image.uri;
                            this.setState({ uploading: true });
                            Util.business.UploadAddressProof(uri, busName, businessEmail, (image) => {
                                this.setState({ proofURI: image });
                            });
                        });
                    }
                });
            }
        });
    }

    render () {
        return (
            !this.props.isReset ?
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
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({signUp: false});
                                    this.setState({bussinessApplication: true});
                                }}
                                
                            > 
                                <Caption style={localStyles.business}>Click here if you want to apply for a business account</Caption>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    
                    : 
                    // Businesss side
                    this.state.bussinessApplication ?
                        this.state.bussinessApplicationPt2  == false?
                        //businiess app pt 1
                            <Modal
                                visible={this.props.modalVisible}
                                dismissable={true}
                                onDismiss={this.props.onDismiss}
                                contentContainerStyle={localStyles.Modal}
                            >
                                {
                                    !this.state.verifying ?
                                    <View>
                                        <View style={localStyles.Container}>
                                            <Subheading style={localStyles.Subheading}>Choose an option to verify your account... </Subheading>
                                        </View>
                                
                                        <ScrollView contentContainerStyle={localStyles.Container}>
                                            <TextInput   theme={{colors:{text:theme.LIGHT_PINK}}}  placeholderTextColor={theme.LIGHT_PINK_OPAC} 
                                            style={localStyles.textInput} placeholder={'Business Name'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "businessName")} />

                                            <TextInput  theme={{colors:{text:theme.LIGHT_PINK}}}  placeholderTextColor={theme.LIGHT_PINK_OPAC} 
                                            style={localStyles.textInput} placeholder={'Your Name'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "ownerName")} />

                                            <TextInput textContentType={"emailAddress"}  theme={{colors:{text:theme.LIGHT_PINK}}}  placeholderTextColor={theme.LIGHT_PINK_OPAC} style={localStyles.textInput} 
                                            placeholder={'Email'} returnKey={'next'}  onChangeText={(text) => this.onChangeText(text, "businessEmail")} />

                                            <TextInput  keyboardType={"phone-pad"} theme={{colors:{text:theme.LIGHT_PINK}}}  placeholderTextColor={theme.LIGHT_PINK_OPAC} 
                                            style={localStyles.textInput} placeholder={'Phone Number'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "businessPhone")} />

                                            <TextInput   theme={{colors:{text:theme.LIGHT_PINK}}}  placeholderTextColor={theme.LIGHT_PINK_OPAC} 
                                            style={localStyles.textInput} placeholder={'Address'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "Address")} />

                                            <TextInput theme={{colors:{text:theme.LIGHT_PINK}}}  placeholderTextColor={theme.LIGHT_PINK_OPAC} 
                                            style={localStyles.textInput} placeholder={'City'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "City")} />

                                            <TextInput  theme={{colors:{text:theme.LIGHT_PINK}}}  placeholderTextColor={theme.LIGHT_PINK_OPAC} 
                                            style={localStyles.textInput} placeholder={'State'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "State")} />

                                            <TextInput  theme={{colors:{text:theme.LIGHT_PINK}}}  placeholderTextColor={theme.LIGHT_PINK_OPAC} 
                                            style={localStyles.textInput} placeholder={'ZIP'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "ZIP")} />

                                            

                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.verifyBusiness(()=>{
                                                        this.setState({verifying:false});
                                                        
                                                        this.setState({bussinessApplicationPt2: true});
                                                    });
                                                }}
                                                style={localStyles.signUpBtn}
                                            > 
                                                <Caption style={localStyles.Caption}>Next</Caption>
                                            </TouchableOpacity>
                                            <Text style={localStyles.loginSwitchText}>Not a business?</Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({signUp: true});
                                                    this.setState({bussinessApplication: false});
                                                }}
                                                style={localStyles.notBusiness}
                                            > 
                                                <Caption style={localStyles.Caption}>Back to Sign Up</Caption>
                                            </TouchableOpacity> 
                                        </ScrollView> 
                                </View>
                                :
                                <View style={styles.viewDark}>
                                    <ActivityIndicator color={theme.LIGHT_PINK} size={"large"}></ActivityIndicator>
                                </View>
                                
                                }
                                
                        </Modal> 
                        : 
                    // bussiness app PT 2
                    <Modal
                        visible={this.props.modalVisible}
                        dismissable={true}
                        onDismiss={this.props.onDismiss}
                        contentContainerStyle={localStyles.Modal}
                    >
                        <View style={localStyles.Container}>
                            <Subheading style={localStyles.Subheading}>Fill out your password and upload a proof of address (bill, bank statement, etc.) to create your account. </Subheading>
                        </View>
                        <ScrollView contentContainerStyle={localStyles.Container}>
                            {/* <TouchableOpacity style={localStyles.VerificationOption}
                                onPress={()=>{
                                    this.uploadProofImage();
                                }}
                            > 
                                {this.state.proofURI ? 
                                    <Caption style={localStyles.VerificationText}>ImageUploaded</Caption>
                                    :
                                    this.state.imageLoading ? 
                                    <ActivityIndicator color={theme.LIGHT_PINK} size={"small"}></ActivityIndicator>
                                    :
                                    <Caption style={localStyles.VerificationText}>Click here to upload proof of address.</Caption>
                                }
                            </TouchableOpacity> */}
                            <TextInput secureTextEntry={true} textContentType={"password"}  theme={{colors:{text:theme.LIGHT_PINK}}}  placeholderTextColor={theme.LIGHT_PINK_OPAC} style={localStyles.textInput} placeholder={'Password'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "password1")} />
                            <TextInput secureTextEntry={true} textContentType={"password"}  theme={{colors:{text:theme.LIGHT_PINK}}} placeholderTextColor={theme.LIGHT_PINK_OPAC} style={localStyles.textInput} placeholder={'Confirm Password'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "password2")} />

                            
                            <View style={{alignSelf:"center"}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.setBusiness(true, this.state);
                                        this.authenticateUser('sign-up'); 
                                    }}
                                    style={localStyles.signUpBtn}
                                > 
                                    <Caption style={localStyles.Caption}>Sign up</Caption>
                                </TouchableOpacity>

                                <Text style={localStyles.loginSwitchText}>Not a business?</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.setBusiness(false);
                                        this.setState({signUp: true});
                                        this.setState({bussinessApplication: false});
                                        this.setState({bussinessApplicationPt2: false});
                                    }}
                                    style={localStyles.notBusiness}
                                > 
                                    <Caption style={localStyles.Caption}>Back to Sign Up</Caption>
                                </TouchableOpacity> 
                            </View>
                        </ScrollView> 
                    </Modal> 
                    :
                    // LOGIN WITH NIFE
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
            :
            <Modal
                visible={this.props.modalVisible}
                dismissable={true}
                onDismiss={this.props.onDismiss}
                contentContainerStyle={localStyles.ModalReset}
            >
                <Subheading style={localStyles.Subheading}>Please enter your email to reset your password! </Subheading>
                <View style={localStyles.Container}>
                    <TextInput textContentType={"emailAddress"}  theme={{colors:{text:theme.LIGHT_PINK}}}  placeholderTextColor={theme.LIGHT_PINK_OPAC} style={localStyles.textInput} placeholder={'Email'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "email")} />
                    <TouchableOpacity
                        onPress={() => Util.dataCalls.Firebase.passwordReset(this.state.email)}
                        style={localStyles.loginSwitch}
                    > 
                        <Caption style={localStyles.Caption}>Reset</Caption>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}
const localStyles = StyleSheet.create({
    VerificationText:{
        color:theme.LIGHT_PINK, 
        fontSize:20
    },
    VerificationOption:{
        borderColor:theme.LIGHT_PINK,
        borderRadius:10,
        alignSelf:"center",
        borderWidth: 1,
        paddingHorizontal:10,
        paddingVertical:4,
        marginBottom:10,
        width:"90%"
    },
    loginSwitchText:{
        color:theme.LIGHT_PINK, 
        fontSize:15,
        marginTop:50,
        textAlign:"center",
        marginBottom: 10
    },
    loginSwitch:{
        borderColor:theme.LIGHT_PINK,
        borderRadius: 10,
        alignSelf:"center",
        borderWidth: 1,
        paddingHorizontal:5,
        paddingVertical:2,
        marginTop: 10
    },
    notBusiness:{
        borderColor:theme.LIGHT_PINK,
        borderRadius:10,
        alignSelf:"center",
        borderWidth: 1,
        paddingHorizontal:5,
        paddingVertical:2,
        marginBottom:10,
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
    business:{
        color:theme.LIGHT_PINK, 
        fontSize:12,
        textAlign:"center",
        marginTop:15
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
    ModalReset:{
        backgroundColor:theme.DARK,
        width:"90%",
        height:"30%",
        alignSelf:"center",
        justifyContent:"flex-start",
        borderRadius:10,
        color:theme.LIGHT_PINK
    },
    Subheading:{
        color:theme.LIGHT_PINK,
        textAlign:'center',
        alignSelf:"center",
        marginBottom:40,
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