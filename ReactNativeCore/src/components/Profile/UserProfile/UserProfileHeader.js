import React, {Component} from "react";
import {ActivityIndicator, Platform, TouchableOpacity, View} from "react-native";
import {localStyles} from "./style";
import DrawerButton from "../../Drawer/DrawerButton";
import {Text} from "react-native-paper";
import {Ionicons} from "@expo/vector-icons";
import theme from "../../../styles/theme";
import {connect} from "react-redux";

class UserProfileHeader extends Component {
    render() {
        return (
            <View style={localStyles.navHeader}>
                <DrawerButton
                    userPhoto={this.props.userData.photoSource}
                    drawerButtonColor={theme.generalLayout.secondaryColor}
                    onPress={this.props.openDrawer}
                />
                {/* Add Friend */}
                {
                    !this.props.currentUser ?
                    !this.props.areFriends ?
                    <TouchableOpacity
                        onPress={this.props.addFriend}
                        style={localStyles.AddFriendOverlay}
                    >
                        {
                            this.props.addingFriend ?
                                <ActivityIndicator
                                    size="small"
                                    color={theme.loadingIcon.color}>
                                </ActivityIndicator>
                                :
                                <Text style={{
                                    paddingHorizontal: 3,
                                    fontSize: 12,
                                    color: theme.generalLayout.textColor,
                                    fontFamily: theme.generalLayout.font
                                }}>Add Friend</Text>
                        }
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        onPress={this.props.removeFriend}
                        style={localStyles.AddFriendOverlay}>
                        {
                            this.props.addingFriend ?
                                <ActivityIndicator size="small"
                                                   color={theme.loadingIcon.color}/> :
                                <Text style={{
                                    paddingHorizontal: 3,
                                    fontSize: 12,
                                    color: theme.generalLayout.textColor,
                                    fontFamily: theme.generalLayout.font
                                }}>Remove Friend</Text>
                        }
                    </TouchableOpacity> : null
                }

                {/* Edit Button */}
                {
                    this.props.currentUser ?
                    <TouchableOpacity style={localStyles.addFriend}
                                      onPress={this.props.editProfile}
                    >
                        <Ionicons name="md-create" size={24} color={theme.icons.color}/>
                    </TouchableOpacity>
                    :
                    null
                }
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        userData: state.userData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refresh: ({userData}) => dispatch({
            type: 'REFRESH',
            data: {
                userData
            }
        })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(UserProfileHeader);