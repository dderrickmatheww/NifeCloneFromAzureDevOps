import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {callOutStyles} from "./style";
import theme from "../../styles/theme";
import {Avatar} from "react-native-paper";

export default class VisitedByCallout extends React.Component {

    determineText(friendCheckIns){
        if(friendCheckIns.length === 1){
            return '1 friend is currently here!'
        } else {
            return `${friendCheckIns.length} friends are currently here!`
        }
    }

    render() {
        return (
            <View style={callOutStyles.callOutMarker}>
                <Text style={[callOutStyles.calloutText,]}>{this.props.marker.name}</Text>
                {
                    this.props.friendCheckIns ?
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
                                {this.determineText(this.props.friendCheckIns)}
                            </Text>
                        </View>
                        :
                        <ActivityIndicator size="large" color={theme.loadingIcon.color}/>
                }
            </View>
        )
    }
}
