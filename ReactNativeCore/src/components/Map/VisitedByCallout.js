import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {callOutStyles} from "./style";
import theme from "../../styles/theme";
import {Avatar} from "react-native-paper";

export default class VisitedByCallout extends React.Component {

    determineCheckInText(friendCheckIns){
        if(friendCheckIns.length === 1){
            return '1 friend is currently here!'
        } else {
            return `${friendCheckIns.length} friends are currently here!`
        }
    }

    determineLastVisitedText(lastVisited){
        if(lastVisited.length === 1){
            return '1 friend visited here recently!'
        } else {
            return `${lastVisited.length} visited recently!!`
        }
    }

    render() {
        const friendCheckIns = this.props.friendCheckIns && this.props.friendCheckIns.length > 0
        const friendLastVisited = this.props.friendLastVisited && this.props.friendLastVisited.length > 0
        return (
            <View style={callOutStyles.callOutMarker}>
                <Text style={[callOutStyles.calloutText,]}>{this.props.marker.name}</Text>
                {
                    friendCheckIns  ?
                        <View style={callOutStyles.friendVisitedByMulti}>
                            {
                                this.props.friendCheckIns.map((friend, i) => (
                                    i <= 5 ?
                                    <View key={i} style={callOutStyles.multiAvatar}>
                                        {
                                            <Avatar.Image
                                                    source={{uri: friend.users.photoSource}}
                                                    size={30}
                                                    style={{
                                                        right: i * 0.3,
                                                        borderWidth: 1.5,
                                                        borderColor: theme.generalLayout.secondaryColor,
                                                        marginLeft: -15
                                                    }}
                                                />
                                        }
                                    </ View> : null
                                ))
                            }
                            <Text style={callOutStyles.friendText}>
                                {this.determineCheckInText(this.props.friendCheckIns)}
                            </Text>
                        </View>
                        :
                        null
                }
                {
                    friendLastVisited ?
                        <View style={callOutStyles.friendVisitedByMulti}>
                            {
                                this.props.friendCheckIns.map((friend, i) => (
                                    i <= 5 ?
                                        <View key={i} style={callOutStyles.multiAvatar}>
                                            {
                                                <Avatar.Image
                                                    source={{uri: friend.users.photoSource}}
                                                    size={30}
                                                    style={{
                                                        right: i * 0.3,
                                                        borderWidth: 1.5,
                                                        borderColor: theme.generalLayout.secondaryColor,
                                                        marginLeft: -15
                                                    }}
                                                />
                                            }
                                        </ View> : null
                                ))
                            }
                            <Text style={callOutStyles.friendText}>
                                {this.determineLastVisitedText(this.props.friendLastVisited)}
                            </Text>
                        </View>
                        :
                        null
                }
            </View>
        )
    }
}
