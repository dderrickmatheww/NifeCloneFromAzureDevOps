import React, {Component} from "react";
import {ActivityIndicator, TouchableOpacity, View} from "react-native";
import {localStyles} from "./UserProfile/style";
import theme from "../../styles/theme";
import {Ionicons} from "@expo/vector-icons";
import {Caption} from "react-native-paper";

export class NoProfilePicture extends Component {
    render() {
        return <TouchableOpacity style={localStyles.NoAvatarButton}
                                 onPress={this.props.onPress}
        >
            {
                this.props.uploading ?
                    <ActivityIndicator color={theme.loadingIcon.color}
                                       size={"large"}/>
                    :
                    <View style={{alignItems: "center"}}>
                        <Ionicons size={50} color={theme.icons.color}
                                  name="ios-person"/>
                        <Caption style={{
                            color: theme.icons.textColor,
                            textAlign: "center",
                            fontFamily: theme.generalLayout.font
                        }}>Click Me To Add Picture!</Caption>
                    </View>
            }
        </TouchableOpacity>;
    }
}