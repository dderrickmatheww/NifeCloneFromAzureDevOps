import React, {Component} from "react";
import {Text, View, TouchableOpacity} from "react-native";
import {localStyles} from "./style";

export class ForgotButton extends Component {
    render() {
        return <View style={localStyles.forgotButtonContainer}>
            <TouchableOpacity style={localStyles.nifeForgotBtn} onPress={this.props.onPress}>
                <Text style={localStyles.loggedOutText}>Forgot Password?</Text>
            </TouchableOpacity>
        </View>;
    }
}