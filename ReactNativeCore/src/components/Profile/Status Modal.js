import React from "react";
import {
    StyleSheet, Platform,
    View,
    ActivityIndicator,
    Keyboard
} from "react-native";
import Util from '../../scripts/Util';
import {Modal, Button, TextInput, Text} from 'react-native-paper';
import theme from '../../../Styles/theme';
import {connect} from "react-redux";

class StatusModal extends React.Component {
    state = {
        statusText: null,
        userData: null,
        saving: false,
        refresh: null,
        placeHolderColor: null,
        pic: null,
    };

    componentDidMount() {
        this.setState({
            userData: this.props.user
        });
        this.getPlaceholderColor()
    }

    getPlaceholderColor = () => {
        this.setState({
            placeHolderColor: {}
        })
    }

    onStatusChange = (text) => {
        this.setState({statusText: text});
    }

    onSaveStatus = () => {
        this.setState({saving: true});
        let status = this.state.statusText;
        let obj = {
            status: {
                text: status,
                timestamp: new Date(),
                image: this.state.pic,
            }
        }
        let user = this.props.user;
        user['status'] = obj.status;
        let updatedUserData = user;
        this.props.globalRefresh(updatedUserData);
        Util.user.UpdateUser(user.email, obj, () => {
            this.setState({saving: false});
            this.props.onSave();
        });
    }
    handleKeyDown = (e) => {
        if (e.nativeEvent.key == "Enter") {
            Keyboard.dismiss();
        }
    }

    handleUploadImageStatus = () => {
        this.setState({saving: true});
        Util.user.HandleUploadImage(this.props.user.isBusiness, this.props.user, (image) => {
            this.setState({saving: false});
            this.setState({pic: image});
        }, true)
    }

<<<<<<< HEAD
    render() {     
        return(         
          <Modal 
            contentContainerStyle={{width:"90%", height:"70%", borderRadius:50, alignSelf:"center"}}
            visible={this.props.isVisible}
            dismissable={true}
            onDismiss={() => this.props.onDismiss()}
          >
            <View style={localStyles.viewDark}>
              <TextInput
                mode={"outlined"}
                label=""
                selectionColor={theme.generalLayout.textColor}
                outlineColor={theme.generalLayout.backgroundColor}
                placeholder={Platform.select({
                  ios: 'Type here...',
                  android:''
                })}
                placeholderTextColor={Platform.select({
                  ios: theme.generalLayout.textColor,
                  android:'black'
                })}
                onChangeText={text => this.onStatusChange(text)}
                style={localStyles.textInput}
                value={this.state.statusText}
                multiline={true}
                returnKeyType={'done'}
                onKeyPress={this.handleKeyDown}
                theme={{ colors: { primary: theme.generalLayout.secondaryColor, placeholder: theme.generalLayout.textColor, text: theme.generalLayout.textColor, underlineColor: 'transparent' } }}
                > 
              </TextInput>
              {
                this.state.saving ?
                <ActivityIndicator style={{marginVertical:5}} color={theme.loadingIcon.color} size="large" />
                :
                <Button 
                  labelStyle={{color: theme.generalLayout.textColor}} 
                  style={localStyles.button} 
                  icon={"check"}
                  mode="contained" 
                  onPress={() => this.onSaveStatus()}
                >
                  <Text style={{color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.font}}>Update</Text>
                </Button>
              }
            </View> 
          </Modal>
=======
    render() {
        return (
            <Modal
                contentContainerStyle={{width: "90%", height: "60%", borderRadius: 50, alignSelf: "center"}}
                visible={this.props.isVisible}
                dismissable={true}
                onDismiss={() => this.props.onDismiss()}
            >
                <View style={localStyles.viewDark}>
                    <TextInput
                        mode={"outlined"}
                        label=""
                        placeholder={Platform.select({
                            ios: 'Type here...',
                            android: ''
                        })}
                        placeholderTextColor={Platform.select({
                            ios: 'white',
                            android: 'black'
                        })}
                        onChangeText={text => this.onStatusChange(text)}
                        style={localStyles.textInput}
                        selectionColor={theme.generalLayout.textColor}
                        value={this.state.statusText}
                        multiline={true}
                        returnKeyType={'done'}
                        onKeyPress={this.handleKeyDown}
                        theme={{colors: {underlineColor: 'transparent'}}}
                    >
                    </TextInput>
                    {
                        this.state.saving ?
                            <ActivityIndicator style={{marginVertical: 5}} color={theme.loadingIcon.color}
                                               size="large"/>
                            :
                            <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                                {!this.state.saving ? <Button
                                    labelStyle={{color: theme.generalLayout.textColor}}
                                    style={localStyles.button}
                                    mode="contained"
                                    onPress={() => this.handleUploadImageStatus()}
                                    disabled={!this.state.pic ? false : true}
                                >
                                    <Text style={{
                                        color: theme.generalLayout.textColor,
                                        fontFamily: theme.generalLayout.font
                                    }}>
                                        {!this.state.pic ? "Upload Image" : "Image Added!"}
                                    </Text>
                                </Button> : <ActivityIndicator style={{marginVertical: 5}} color={theme.loadingIcon.color}
                                                               size="large"/>}
                                <Button
                                    labelStyle={{color: theme.generalLayout.textColor}}
                                    style={localStyles.button}
                                    icon={"check"}
                                    mode="contained"
                                    onPress={() => this.onSaveStatus()}
                                >
                                    <Text style={{
                                        color: theme.generalLayout.textColor,
                                        fontFamily: theme.generalLayout.font
                                    }}>Update</Text>
                                </Button>
                            </View>

                    }
                </View>
            </Modal>
>>>>>>> dev
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.userData,
        requests: state.friendRequests,
        friends: state.friendData,
        businessData: state.businessData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        globalRefresh: (userData) => dispatch({type: 'REFRESH', data: userData})
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(StatusModal);


const localStyles = StyleSheet.create({
<<<<<<< HEAD
  textInput:{
    flex:1,
    ...Platform.select({
      ios:{
        backgroundColor: theme.generalLayout.backgroundColor,
        color: theme.generalLayout.textColor,
      },
      android:{
        backgroundColor: 'white',
        color: 'black',
      }
    }),
    width:"90%", 
    height:"80%", 
    alignSelf:"center", 
    borderRadius: 5,
    marginTop:5,
    fontFamily: theme.generalLayout.font,
  },
  buttonText:{
    color: theme.generalLayout.textColor,
    alignSelf:"center",
    paddingHorizontal:5,
    fontFamily: theme.generalLayout.font
  },
  button:{
    borderColor: theme.generalLayout.secondaryColor,
    borderRadius:10,
    borderWidth:1,
    width:"50%",
    marginBottom: 20
  },
  viewDark:{
    flex: 1,
    backgroundColor: theme.generalLayout.backgroundColor,
    flexDirection:"column",
    justifyContent:"center",
    alignContent:"center",
    alignItems:"center",
    color: theme.generalLayout.textColor,
    borderRadius: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.generalLayout.secondaryColor
  }
=======
    textInput: {
        flex: 1,
        ...Platform.select({
            ios: {
                backgroundColor: 'white',
                color: theme.generalLayout.textColor,
            },
            android: {
                backgroundColor: 'white',
                color: 'black',
            }
        }),
        width: "90%",
        height: "80%",
        alignSelf: "center",
        borderRadius: 5,
        marginTop: 5,
        fontFamily: theme.generalLayout.font,
        borderColor: theme.generalLayout.backgroundColor
    },
    buttonText: {
        color: theme.generalLayout.textColor,
        alignSelf: "center",
        paddingHorizontal: 5,
        fontFamily: theme.generalLayout.font
    },
    button: {
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 10,
        borderWidth: 1,
        width: "50%",
        marginBottom: 20,
    },
    viewDark: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        color: theme.generalLayout.textColor
    }
>>>>>>> dev
});
  
