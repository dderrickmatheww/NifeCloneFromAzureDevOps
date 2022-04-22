import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import Util from '../../utils/util';
import theme from '../../../src/styles/theme';
import {callOutStyles} from "./style";

export default class VisitedByCallout extends React.Component  {
    render() {
        return (
            <View style={callOutStyles.callOutMarker}>
                <Text style={[callOutStyles.calloutText, ]}>{this.props.marker.name}</Text>
                { 
                    this.props.marker.lastVisitedBy && this.props.marker.lastVisitedBy.length > 0 ?
                        this.props.marker.lastVisitedBy.length < 2 ?
                            this.props.marker.lastVisitedBy.map((friend, i) => (
                                friend.lastVisited && friend.lastVisited[this.props.marker.id] ?
                                <View key={i} style={callOutStyles.friendVisitedBy}>
                                    <Avatar.Image
                                    source={{uri: friend.photoSource}}
                                    size={30}
                                    style={callOutStyles.singleAvatar}
                                    /> 
                                    <Text style={callOutStyles.friendText}>
                                        Your friend {friend.displayName} was here {Util.date.TimeSince(new Date(friend.lastVisited[this.props.marker.id].checkInTime))} ago!
                                    </Text>
                                </View>
                                :
                                null
                            )) 
                        : 
                        <View>
                            <View style={callOutStyles.friendVisitedByMulti}>
                            { 
                                this.props.marker.lastVisitedBy.length < 5 ?
                                    this.props.marker.lastVisitedBy.map((friend, i) => (
                                        friend.lastVisited && friend.lastVisited[this.props.marker.id] ?
                                            <View  key={i} style={callOutStyles.multiAvatar}>
                                                {
                                                    i = 0 ? 
                                                        <Avatar.Image
                                                            source={{uri: friend.photoSource}}
                                                            size={30}
                                                            style={{ borderWidth: 1.5, borderColor: theme.generalLayout.secondaryColor}}
                                                        />
                                                    : 
                                                        <Avatar.Image
                                                            source={{uri: friend.photoSource}}
                                                            size={30}
                                                            style={{right: i * 0.2, borderWidth: 1.5, borderColor: theme.generalLayout.secondaryColor, marginLeft: -10}}
                                                        />
                                                }
                                            </View>
                                        : null
                                    ))
                                : null
                            }
                            <Text style={callOutStyles.friendText}>
                                {this.props.marker.lastVisitedBy.length} friends were just here!
                            </Text>
                            </View>
                            {
                                this.props.marker.lastVisitedBy[this.props.marker.lastVisitedBy.length - 1].lastVisited[this.props.marker.id] ?
                                    <Text style={callOutStyles.friendText}>
                                        Including your friend {this.props.marker.lastVisitedBy[this.props.marker.lastVisitedBy.length - 1].displayName} about {Util.date.TimeSince(new Date(this.props.marker.lastVisitedBy[this.props.marker.lastVisitedBy.length - 1].lastVisited[this.props.marker.id].checkInTime))} ago!
                                    </Text>
                                : null
                            }
                        </View>
                    :
                    null
                }
                { 
                    this.props.marker.currentlyCheckIn && this.props.marker.currentlyCheckIn.length > 0 ?
                        this.props.marker.currentlyCheckIn.map((friend, i) => (
                            this.props.marker.currentlyCheckIn.length == 1 && 
                            friend.checkIn && 
                            friend.checkIn.buisnessUID == this.props.marker.id ?
                                <View style={callOutStyles.friendVisitedBy}>
                                    <Avatar.Image
                                        source={{uri: friend.providerData.photoURL}}
                                        size={30}
                                        style={callOutStyles.singleAvatar}
                                    /> 
                                    <Text style={callOutStyles.friendText}>
                                        {this.props.marker.currentlyCheckIn.length} friend is still currently here!
                                    </Text>
                                </View>
                            :
                            this.props.marker.currentlyCheckIn.length < 5 && 
                            friend.checkIn && 
                            friend.checkIn.buisnessUID == this.props.marker.id ?
                                <View style={callOutStyles.friendVisitedByMulti}>
                                    <View style={callOutStyles.multiAvatar}>
                                    {
                                        i = 0 ? 
                                        <Avatar.Image
                                            source={{uri: friend.providerData.photoURL}}
                                            size={30}
                                            style={{ borderWidth: 1.5, borderColor: theme.generalLayout.secondaryColor}}
                                        />
                                        : <Avatar.Image
                                            source={{uri: friend.providerData.photoURL}}
                                            size={30}
                                            style={{right: i * 0.2, borderWidth: 1.5, borderColor: theme.generalLayout.secondaryColor, marginLeft: -10}}
                                        />
                                    }
                                    </ View>
                                    <Text style={callOutStyles.friendText}>
                                        {this.props.marker.currentlyCheckIn.length} friends are still currently here!
                                    </Text>
                                </View>
                            : null
                        ))
                    : null
                }
            </View>
        )
    }
}
