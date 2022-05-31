import React, {Component} from "react";
import {View} from "react-native";
import {Headline, Title} from "react-native-paper";
import {localStyles} from "./UserProfile/style";

export class UserInformation extends Component {
    render() {
        return <View style={{flexDirection: "column", justifyContent: "center"}}>
            <Headline style={localStyles.headerName}>{this.props.userData.displayName} </Headline>
            <Title style={localStyles.headerAgeGender}>
                {this.props.genderUpperCase}
                {this.props.sexualOrientation}
                {this.props.userData.dateOfBirth ? this.props.dateOfBirth : ""}
            </Title>
        </View>;
    }
}