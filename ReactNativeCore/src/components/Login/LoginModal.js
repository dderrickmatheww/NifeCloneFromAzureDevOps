import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Util from '../../scripts/Util';
import { Modal, Subheading, Caption, TextInput, ActivityIndicator, Checkbox } from 'react-native-paper';
import { styles } from '../../../src/styles/style';
import theme from '../../../src/styles/theme';
import * as ImagePicker from 'expo-image-picker';
import { Linking } from 'react-native'; 
const TouchableOpacity = Util.basicUtil.TouchableOpacity();

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
        isReset: false,
        isBusiness: this.props.isBusiness,
        isChecked: false,
        
    }



    onChangeText = (text, type) => {
        this.setState({[type]: text});
    }

    authenticateUser = (event) => {
        if (event == 'sign-up') {
            if(this.state.password1 === this.state.password2) {
                if (!this.state.businessEmail) {
                    if(!this.state.email || !this.state.password1 || !this.state.displayName) {
                        Util.basicUtil.Alert('Nife Message', "Please make sure all fields are filled out!", null);
                    }
                    else if (this.state.password1.length < 8) {
                        Util.basicUtil.Alert('Nife Message', "Your password must be great than eight characters!", null);
                    }
                    else {
                        this.props.onSignUp(this.state);
                        Util.dataCalls.Nife.login(this.state, null, (dataObj, error) => {
                            if(error) {
                                Util.basicUtil.Alert('Nife Message', error.message, null);
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
                        Util.basicUtil.Alert('Nife Message', "Please enter correct sign-up information!", null);
                    }
                    else if (this.state.password1.length < 8) {
                        Util.basicUtil.Alert('Nife Message', "Your password must be great than eight characters!", null);
                    }
                    else {
                        this.props.onSignUp(this.state);
                        Util.dataCalls.Nife.login(this.state, null, (dataObj, error) => {
                            if(error) {
                                Util.basicUtil.Alert('Nife Error Message', error.message, null);
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
                Util.basicUtil.Alert('Nife Message', "Your passwords do not match. Please try again. :)", null);
            }
        } 
        else {
            if(!this.state.email || !this.state.password1) {
                Util.basicUtil.Alert('Nife Message', "Please enter correct sign-up information!", null);
            }
            else {
                Util.dataCalls.Nife.login(null, this.state, (dataObj, error) => {
                    if(error) {
                        Util.basicUtil.Alert('Nife Error Message', error.message, null);
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

    verifyBusiness =  () => {
        this.setState({ verifying: true });
        let address = this.state.Address ? this.state.Address : null;
        let city = this.state.City ? this.state.City : null;
        let state = this.state.State ? this.state.State : null;
        let name = this.state.businessName ? this.state.businessName : null;
        if(address !== null & city  !== null  & state !== null & name !== null ){
            //console.log(address, city, state, name);
            Util.dataCalls.Yelp.businessVerification(name, address, city, state, "US",  async (data) => {
                if (data.businesses && data.businesses.length > 0) {
                    const businessId = data.businesses[0].id;
                    const isOnNife = await Util.dataCalls.Yelp.isBusinessRegistered(businessId);
                    if (isOnNife) {
                        this.setState({ verifying: false  });
                        Util.basicUtil.Alert('Nife Message', "Looks like this business is already registered with Nife! Email admin@nife.app if this is not correct.", null);
                    }
                    else {
                        this.setState({
                            businessId: data.businesses[0].id,
                            coordinates: data.businesses[0].coordinates,
                            bussinessApplicationPt2: true,
                            businessPhone: data.businesses[0].phone,
                        });
                    }
                } else {
                    this.setState({ verifying: false });
                    Util.basicUtil.Alert('Nife Message', "We could not find your business! Make sure your contact information matches other online sources! For more information contact admin@nife.app.", null);
                }
            });
        }
        else {
            this.setState({ verifying: false });
            Util.basicUtil.Alert('Nife Message', "Please fill out all required feilds (Address, City, State, and Name) in this form!", null);
        }
    }

    uploadProofImage = () => {
        let businessEmail = this.state.businessEmail;
        let busName = this.state.businessName;
        ImagePicker.getMediaLibraryPermissionsAsync()
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
                ImagePicker.requestMediaLibraryPermissionsAsync()
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
            this.props.isReset ?
                // Password reset
                <Modal
                    visible={this.props.modalVisible}
                    dismissable={true}
                    onDismiss={this.props.onDismiss}
                    contentContainerStyle={localStyles.ModalReset}
                >
                    <Subheading style={localStyles.Subheading}>Please enter your email to reset your password! </Subheading>
                    <View style={localStyles.Container}>
                        <TextInput secureTextEntry={false} selectionColor={theme.generalLayout.textColor} textContentType={"emailAddress"}  theme={{colors:{text:theme.generalLayout.textColor}}}  placeholderTextColor={theme.generalLayout.textColor} style={localStyles.textInput} placeholder={'Email'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "email")} />
                        <TouchableOpacity
                            onPress={() => Util.dataCalls.Firebase.passwordReset(this.state.email)}
                            style={localStyles.nextBtn}
                        >
                            <Caption style={localStyles.Caption}>Reset</Caption>
                        </TouchableOpacity>
                    </View>
                </Modal>
                :
                    this.state.signUp ?
                        this.props.isBusiness ?
                            this.state.bussinessApplicationPt2 == false ?
                            // nife business sign up
                                //businiess app pt 1
                                <Modal
                                    visible={this.props.modalVisible}
                                    dismissable={true}
                                    onDismiss={this.props.onDismiss}
                                    contentContainerStyle={localStyles.Modal}
                                >
                                    {
                                        !this.state.verifying ?
                                            <View style={localStyles.Container}>
                                                <View style={localStyles.Container}>
                                                    <Subheading style={localStyles.Subheading}>Please fill out the information to verify your business!</Subheading>
                                                </View>

                                                <ScrollView style={{maxHeight:450}} contentContainerStyle={localStyles.Container}>
                                                    <View>
                                                        <Text style={localStyles.loginSwitchText}>Already have an account?</Text>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                this.setState({
                                                                    signUp: false,
                                                                })
                                                            }}
                                                            style={{
                                                                borderColor: theme.generalLayout.secondaryColor,
                                                                borderRadius: 10,
                                                                alignSelf:"center",
                                                                borderWidth: 1,
                                                                paddingHorizontal:5,
                                                                paddingVertical:2,
                                                                marginTop: '5%',
                                                                marginBottom:10,
                                                                width: '40%',
                                                            }}
                                                        >
                                                            <Caption style={localStyles.Caption}>Login</Caption>
                                                        </TouchableOpacity>
                                                    </View>


                                                    <TextInput   theme={{colors:{text: theme.generalLayout.textColor}}}  placeholderTextColor={theme.generalLayout.textColor}
                                                                 style={localStyles.textInput} placeholder={'Business Name'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "businessName")} />

                                                    <TextInput selectionColor={theme.generalLayout.textColor}  theme={{colors:{text:theme.generalLayout.textColor}}}  placeholderTextColor={theme.generalLayout.textColor}
                                                               style={localStyles.textInput} placeholder={'Your Name'} returnKey={'next'} secureTextEntry={false}  onChangeText={(text) => this.onChangeText(text, "ownerName")} />

                                                    <TextInput selectionColor={theme.generalLayout.textColor}t textContentType={"emailAddress"} secureTextEntry={false}  theme={{ colors: { text: theme.generalLayout.textColor }}}  placeholderTextColor={theme.generalLayout.textColor} style={localStyles.textInput}
                                                               placeholder={'Email'} returnKey={'next'}  onChangeText={(text) => this.onChangeText(text, "businessEmail")} />

                                                    <TextInput selectionColor={theme.generalLayout.textColor}  keyboardType={"phone-pad"} theme={{colors:{text:theme.generalLayout.textColor}}}  placeholderTextColor={theme.generalLayout.textColor}
                                                               style={localStyles.textInput} placeholder={'Phone Number'} returnKey={'next'} secureTextEntry={false}  onChangeText={(text) => this.onChangeText(text, "businessPhone")} />

                                                    <TextInput selectionColor={theme.generalLayout.textColor} theme={{colors:{text:theme.generalLayout.textColor}}}  placeholderTextColor={theme.generalLayout.textColor}
                                                               style={localStyles.textInput} placeholder={'Address'} returnKey={'next'} secureTextEntry={false}  onChangeText={(text) => this.onChangeText(text, "Address")} />

                                                    <TextInput selectionColor={theme.generalLayout.textColor} theme={{colors:{text:theme.generalLayout.textColor}}}  placeholderTextColor={theme.generalLayout.textColor}
                                                               style={localStyles.textInput} placeholder={'City'} returnKey={'next'} secureTextEntry={false}  onChangeText={(text) => this.onChangeText(text, "City")} />

                                                    <TextInput selectionColor={theme.generalLayout.textColor} theme={{colors:{text:theme.generalLayout.textColor}}}  placeholderTextColor={theme.generalLayout.textColor}
                                                               style={localStyles.textInput} placeholder={'State'} returnKey={'next'} secureTextEntry={false} onChangeText={(text) => this.onChangeText(text, "State")} />
                                                
                                                    <Text style={{color: 'white', paddingTop: 10, paddingBottom: 10, marginLeft:30, marginRight:15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                        You must read and agree to the following terms. Select ok to continue.
                                                    </Text>

                                                    <Text style={{ color: theme.icons.color, paddingTop: 10, marginLeft:30, marginRight:15}}
                                                        onPress={() => Linking.openURL('http://google.com')}>
                                                    Google Terms Link
                                                    </Text>

                                                    <View style={{ marginLeft:20, flexDirection: 'row'}}>
                                                        <Text style={{color:theme.generalLayout.textColor, marginTop: 10, marginLeft:10 }}>Click the checkbox to agree</Text>
                                                    <Checkbox 
                                                        uncheckedColor={theme.generalLayout.textColor}
                                                        color={theme.icons.color}
                                                        status={this.state.isChecked ? 'checked' : 'unchecked'}
                                                        onPress={() => {
                                                            this.setState({ isChecked: !this.state.isChecked });
                                                        }}
                                                    />
                                                    </View>

                                                    <View style={{flexDirection: 'row', padding: '5%', margin: '5%', alignItems: 'center', justifyContent: 'center' }}>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                this.setState({
                                                                    signUp: false,
                                                                    bussinessApplication: false
                                                                });
                                                                this.props.onDismiss();
                                                            }}
                                                            style={localStyles.nextBtn}
                                                        >
                                                            <Caption style={localStyles.Caption}>Back</Caption>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                if (this.state.isChecked == false) {
                                                                    Util.basicUtil.Alert('Nife Message', "Please fill out all required feilds (Address, City, State, Name, and you must agree to terms by 'clicking' the checkbox) in this form!", null);
                                                                } else {
                                                                    this.verifyBusiness(() => {
                                                                        this.setState({
                                                                            verifying: false,
                                                                            bussinessApplicationPt2: true
                                                                        });
                                                                    });
                                                                } 
                                                            }}
                                                            style={localStyles.nextBtn}
                                                        >
                                                            <Caption style={localStyles.Caption}>Next</Caption>
                                                        </TouchableOpacity>
                                                    </View>


                                                </ScrollView>
                                            </View>
                                            :
                                            <View style={styles.viewDark}>
                                                <ActivityIndicator color={theme.loadingIcon.color} size={"large"}></ActivityIndicator>
                                            </View>
                                    }
                                </Modal>
                                :
                                // bussiness app PT 2
                                <Modal
                                    visible={this.props.modalVisible}
                                    dismissable={true}
                                    onDismiss={this.props.onDismiss}
                                    contentContainerStyle={localStyles.ModalBusiness}
                                >
                                    <View style={localStyles.Container}>
                                        <Subheading style={localStyles.Subheading}>Fill out your password please!</Subheading>
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
                                        <TextInput selectionColor={theme.generalLayout.textColor} secureTextEntry={true} textContentType={"password"}  theme={{colors:{text: theme.generalLayout.textColor}}}  placeholderTextColor={theme.generalLayout.textColor} style={localStyles.textInput} placeholder={'Password'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "password1")} />
                                        <TextInput selectionColor={theme.generalLayout.textColor} secureTextEntry={true} textContentType={"password"}  theme={{colors:{text: theme.generalLayout.textColor}}} placeholderTextColor={theme.generalLayout.textColor} style={localStyles.textInput} placeholder={'Confirm Password'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "password2")} />

                                        <View style={{flexDirection: 'row', padding: '5%', margin: '5%', alignItems: 'center', justifyContent: 'center' }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({
                                                        signUp: false,
                                                        bussinessApplication: false
                                                    });
                                                }}
                                                style={localStyles.nextBtn}
                                            >
                                                <Caption style={localStyles.Caption}>Back</Caption>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.props.setIsBusiness(true, this.state);
                                                    this.authenticateUser('sign-up');
                                                }}
                                                style={localStyles.nextBtn}
                                            >
                                                <Caption style={localStyles.Caption}>Sign up</Caption>
                                            </TouchableOpacity>
                                        </View>
                                    </ScrollView>
                                </Modal>
                        :
                            //Sign-up with Nife
                        <Modal
                            visible={this.props.modalVisible}
                            dismissable={true}
                            onDismiss={this.props.onDismiss}
                            contentContainerStyle={localStyles.Modal}
                        >
                            <Subheading style={localStyles.Subheading}>Please fill out this form! </Subheading>
                            <View style={localStyles.Container}>
                                <TextInput secureTextEntry={false} selectionColor={theme.generalLayout.textColor} textContentType={"none"} theme={{ colors: { text: theme.generalLayout.textColor } }}  placeholderTextColor={theme.generalLayout.textColor} style={localStyles.textInput} placeholder={'Display Name'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "displayName")} />
                                <TextInput secureTextEntry={false} selectionColor={theme.generalLayout.textColor} textContentType={"emailAddress"}  theme={{ colors: { text: theme.generalLayout.textColor }}}  placeholderTextColor={theme.generalLayout.textColor} style={localStyles.textInput} placeholder={'Email'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "email")} />
                                <TextInput secureTextEntry={true} selectionColor={theme.generalLayout.textColor} textContentType={"password"}  theme={{ colors: { text: theme.generalLayout.textColor }}}  placeholderTextColor={theme.generalLayout.textColor} style={localStyles.textInput} placeholder={'Password'} returnKey={'next'}  onChangeText={(text) => this.onChangeText(text, "password1")} />
                                <TextInput secureTextEntry={true} selectionColor={theme.generalLayout.textColor} textContentType={"password"}  theme={{ colors: { text: theme.generalLayout.textColor }}} placeholderTextColor={theme.generalLayout.textColor} style={localStyles.textInput} placeholder={'Confirm Password'} returnKey={'next'}  onChangeText={(text) => this.onChangeText(text, "password2")} />
                                
    
        
                                
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

                        // LOGIN WITH NIFE
                        <Modal
                            visible={this.props.modalVisible}
                            dismissable={true}
                            onDismiss={this.props.onDismiss}
                            contentContainerStyle={localStyles.Modal}
                        >
                            <Subheading style={localStyles.Subheading}>Please enter your credentials to login!</Subheading>
                            <View style={localStyles.Container}>
                                <TextInput secureTextEntry={false} selectionColor={theme.generalLayout.textColor} textContentType={"emailAddress"}  theme={{colors:{text: theme.generalLayout.textColor}}}  placeholderTextColor={theme.generalLayout.textColor} style={localStyles.textInput} placeholder={'Email'} returnKey={'next'} secureText={false}  onChangeText={(text) => this.onChangeText(text, "email")} />
                                <TextInput secureTextEntry={true} selectionColor={theme.generalLayout.textColor} textContentType={"password"}  theme={{ colors: { text: theme.generalLayout.textColor} }}  placeholderTextColor={theme.generalLayout.textColor} style={localStyles.textInput} placeholder={'Password'} returnKey={'next'}  onChangeText={(text) => this.onChangeText(text, "password1")} />

                                <TouchableOpacity
                                    onPress={() => this.authenticateUser('login')}
                                    style={localStyles.signUpBtn}
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
                            </View>
                        </Modal>

        );
    }
}

const localStyles = StyleSheet.create({
    VerificationText:{
        color: theme.generalLayout.textColor, 
        fontSize:20,
        fontFamily: theme.generalLayout.font
    },
    VerificationOption:{
        borderColor:theme.generalLayout.secondaryColor,
        borderRadius:10,
        alignSelf:"center",
        borderWidth: 1,
        paddingHorizontal:10,
        paddingVertical:4,
        marginBottom:10,
        width:"90%"
    },
    loginSwitchText:{
        color: theme.generalLayout.textColor, 
        fontSize: 15,
        textAlign:"center",
        fontFamily: theme.generalLayout.font
    },
    loginLoginSwitchText:{
        color: theme.generalLayout.textColor, 
        fontSize: 15,
        ...Platform.select({
            ios: {
                marginTop: "'7'%",
            },
            android: {
                marginTop: "20%",
            },
        }),
        textAlign:"center",
        fontFamily: theme.generalLayout.font
    },
    loginSwitch:{
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 10,
        alignSelf:"center",
        borderWidth: 1,
        paddingHorizontal:5,
        paddingVertical:2,
        marginTop: '5%',
        width: '40%',
        ...Platform.select({
            ios: {
                height: "7%",
            },
            android: {
                height: "20%",
            },
        })
    },
    notBusiness:{
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius:10,
        alignSelf:"center",
        borderWidth: 1,
        paddingHorizontal:5,
        paddingVertical:2,
        marginBottom:10,
    },
    nextBtn: {
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 10,
        alignSelf:"center",
        borderWidth: 1,
        paddingHorizontal:5,
        paddingVertical: 2,
        width: 100,
        margin: '2%',
    },
    signUpBtn:{
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 10,
        alignSelf:"center",
        borderWidth: 1,
        width: '40%',
        ...Platform.select({
            ios: {
                height: "8%",
                padding: 5,
                marginBottom: '15%'
            },
            android: {
                height: "20%",
            },
        }),
        marginTop: '10%',
        textAlign:"center",
    },
    Caption: {
        color: theme.generalLayout.textColor, 
        fontSize: 15,
        textAlign:"center",
        fontFamily: theme.generalLayout.font
    },
    business:{
        color: theme.generalLayout.textColor, 
        fontSize: 12,
        textAlign: "center",
        marginTop: 15,
        fontFamily: theme.generalLayout.font
    },
    textInput:{
        width:"90%",
        alignSelf:"center",
        marginVertical:2,
        color: theme.generalLayout.textColor,
        fontSize:15,
        shadowOffset:{width:-5, height:-5},
        fontFamily: theme.generalLayout.font
    },
    Modal:{
        backgroundColor: theme.generalLayout.backgroundColor,
        width:"90%",
        ...Platform.select({
            ios: {
                height: "75%"
            },
            android: {
                height: "85%"
            },
        }),
        alignSelf:"center",
        justifyContent:"flex-start",
        borderRadius: 10,
        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: 1,
        color: theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font
    },
    ModalBusiness: {
        backgroundColor: theme.generalLayout.backgroundColor,
        width:"90%",
        height:"50%",
        alignSelf:"center",
        justifyContent:"flex-start",
        borderRadius: 10,
        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: 1,
        color: theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font
    },
    ModalReset:{
        backgroundColor: theme.generalLayout.backgroundColor,
        width:"90%",
        height:"30%",
        alignSelf:"center",
        justifyContent:"flex-start",
        borderRadius:10,
        color:theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font
    },
    Subheading:{
        color:theme.generalLayout.textColor,
        textAlign:'center',
        alignSelf:"center",
        marginBottom:40,
        marginTop:30,
        width:"90%",
        fontFamily: theme.generalLayout.font
    },
    Container:{
        flexDirection:'column',
        justifyContent:"flex-start",
        alignContent:"center",
        textAlign:"center",
        borderRadius:10,
    },

})
