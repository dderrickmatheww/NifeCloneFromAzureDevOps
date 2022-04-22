import React, {Component} from "react";
import {Image, Text, View, TouchableOpacity} from "react-native";
import {localStyles} from "./style";
import Util, {defaultPhotoUrl} from "../../utils/util";
const defPhoto = { uri: defaultPhotoUrl };

export class UserSection extends Component {
    render() {
        return (
        <>
            <View style={localStyles.subHeaderContainer}>
                {/*<Text style={localStyles.subHeaderText}>*/}
                {/*    Users*/}
                {/*</Text>*/}
            </View>
            <View style={localStyles.googleButtonContainer}>
                <TouchableOpacity style={localStyles.googleLoginBtn} onPress={() => {
                    this.props.googleLogin()
                }}>
                    <Text style={localStyles.loggedOutText}>Login with Google</Text>
                    <Image
                        style={localStyles.Logo}
                        source={{uri: "https://firebasestorage.googleapis.com/v0/b/nife-75d60.appspot.com/o/Nife%20Images%2Fgooglelogo.png?alt=media&token=df5a838d-8167-41bb-a102-d9ea4690b4c6"}}
                    />
                </TouchableOpacity>
            </View>
            <View style={localStyles.btnContainer}>
                <TouchableOpacity style={localStyles.nifeLoginBtn} onPress={this.props.onPress1}>
                    <Text style={localStyles.loggedOutText}>Login/Sign-up with Nife</Text>
                    <Image
                        style={localStyles.Logo}
                        source={defPhoto}
                    />
                </TouchableOpacity>
            </View>
        </>
        );
    }
}
