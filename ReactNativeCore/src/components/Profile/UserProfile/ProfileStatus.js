import React, {Component} from "react";
import {TouchableOpacity, View} from "react-native";
import {localStyles} from "./style";
import {Caption, Title} from "react-native-paper";
import {Ionicons} from "@expo/vector-icons";
import theme from "../../../styles/theme";

export class ProfileStatus extends Component {
    render() {
        return <View style={localStyles.profRow}>
            <View style={{flexDirection: "row"}}>
                <Title style={localStyles.descTitle}>
                    Status:
                </Title>
                {

                    this.props.currentUser ?
                        <TouchableOpacity style={localStyles.editStatus}
                                          onPress={this.props.onPress}
                        >
                            <Ionicons size={25} color={theme.icons.color}
                                      name="ios-add-circle"/>
                        </TouchableOpacity>
                        :
                        null
                }
            </View>
            <Caption
                style={localStyles.caption}>{this.props.userData.status ? this.props.userData.status.text : "None"}</Caption>
        </View>;
    }
}