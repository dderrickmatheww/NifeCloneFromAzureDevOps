import React, {Component} from "react";
import {ImageBackground, TouchableOpacity, View} from "react-native";
import {localStyles} from "./UserProfile/style";
import {defaultPhotoUrl} from "../../utils/util";
import {Ionicons} from "@expo/vector-icons";
import theme from "../../styles/theme";

export class ProfilePicture extends Component {
    render() {
        return <View>
            <ImageBackground style={localStyles.profilePic}
                             source={{uri: this.props.userData.photoSource || defaultPhotoUrl}}>
                {
                    this.props.isCurrentUser ?
                        <TouchableOpacity
                            style={{position: "relative", bottom: -125, right: -125}}
                            onPress={this.props.onPress}
                        >
                            <Ionicons size={25} color={theme.icons.color}
                                      name="ios-add-circle"/>
                        </TouchableOpacity>
                        :
                        null
                }
            </ImageBackground>
        </View>;
    }
}