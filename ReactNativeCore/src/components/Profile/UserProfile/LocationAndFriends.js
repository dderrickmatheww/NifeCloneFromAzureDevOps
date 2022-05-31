import React, {Component} from "react";
import {TouchableOpacity, View} from "react-native";
import {localStyles} from "./style";
import {Caption} from "react-native-paper";

export class LocationAndFriends extends Component {
    render() {
        return <View style={localStyles.LocAndFriends}>
            <View style={{alignSelf: "flex-start", width: "50%"}}>
                {
                    !this.props.userData.privacySettings?.locationPrivacy ?
                        <Caption style={localStyles.FriendCount}>
                            {this.props.region}
                        </Caption>
                        : null
                }
            </View>
            <View style={{
                alignSelf: "flex-end",
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "50%"
            }}>
                <TouchableOpacity
                    disabled={!this.props.currentUser}
                    onPress={this.props.onPress}>
                    <Caption
                        style={localStyles.FriendCount}>{this.props.friendsLength} Friends</Caption>
                </TouchableOpacity>
            </View>
        </View>;
    }
}