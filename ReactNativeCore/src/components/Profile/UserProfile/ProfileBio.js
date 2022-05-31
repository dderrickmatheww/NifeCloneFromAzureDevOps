import React, {Component} from "react";
import {View} from "react-native";
import {localStyles} from "./style";
import {Caption, Title} from "react-native-paper";

export class ProfileBio extends Component {
    render() {
        return <View style={localStyles.profRow}>
            <Title style={localStyles.descTitle}>
                Bio:
            </Title>
            <Caption
                style={localStyles.caption}>{this.props.userData.bio ? this.props.userData.bio : "None"}</Caption>
        </View>;
    }
}
