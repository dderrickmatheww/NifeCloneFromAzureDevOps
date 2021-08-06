import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import Util from '../../scripts/Util';
import theme from '../../../src/styles/theme';

export default class VisitedByCallout extends React.Component  {
    render() {
        return (
            <View style={localStyles.callOutMarker}>
                <Text style={[localStyles.calloutText, {fontSize:16, fontWeight:"bold", textAlign:"center", textDecorationLine:"underline"}]}>{this.props.marker.name}</Text>
                { 
                    this.props.marker.lastVisitedBy && this.props.marker.lastVisitedBy.length > 0 ?
                        this.props.marker.lastVisitedBy.length < 2 ?
                            this.props.marker.lastVisitedBy.map((friend, i) => (
                                friend.lastVisited && friend.lastVisited[this.props.marker.id] ?
                                <View key={i} style={localStyles.friendVisitedBy}>
                                    <Avatar.Image
                                    source={{uri: friend.photoSource}}
                                    size={30}
                                    style={localStyles.singleAvatar}
                                    /> 
                                    <Text style={localStyles.friendText}>
                                        Your friend {friend.displayName} was here {Util.date.TimeSince(new Date(friend.lastVisited[this.props.marker.id].checkInTime))} ago!
                                    </Text>
                                </View>
                                :
                                null
                            )) 
                        : 
                        <View>
                            <View style={localStyles.friendVisitedByMulti}>
                            { 
                                this.props.marker.lastVisitedBy.length < 5 ?
                                    this.props.marker.lastVisitedBy.map((friend, i) => (
                                        friend.lastVisited && friend.lastVisited[this.props.marker.id] ?
                                            <View  key={i} style={localStyles.multiAvatar}>
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
                            <Text style={localStyles.friendText}>
                                {this.props.marker.lastVisitedBy.length} friends were just here!
                            </Text>
                            </View>
                            {
                                this.props.marker.lastVisitedBy[this.props.marker.lastVisitedBy.length - 1].lastVisited[this.props.marker.id] ?
                                    <Text style={localStyles.friendText}>
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
                                <View style={localStyles.friendVisitedBy}>
                                    <Avatar.Image
                                        source={{uri: friend.providerData.photoURL}}
                                        size={30}
                                        style={localStyles.singleAvatar}
                                    /> 
                                    <Text style={localStyles.friendText}>
                                        {this.props.marker.currentlyCheckIn.length} friend is still currently here!
                                    </Text>
                                </View>
                            :
                            this.props.marker.currentlyCheckIn.length < 5 && 
                            friend.checkIn && 
                            friend.checkIn.buisnessUID == this.props.marker.id ?
                                <View style={localStyles.friendVisitedByMulti}>
                                    <View style={localStyles.multiAvatar}>
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
                                    <Text style={localStyles.friendText}>
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

const localStyles = StyleSheet.create({
    multiAvatar: {
        top: '5%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    
    friendVisitedBy: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    },
    singleAvatar: {
        top: '11%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    friendText: {
        color: theme.generalLayout.textColor,
        margin: 10,
        marginTop: 30,
        fontFamily: theme.generalLayout.font
    },
    calloutText:{
        color: theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font
    },
    friendVisitedByMulti: {
        top: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    },
    callOutMarker: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        color: theme.generalLayout.textColor,
        borderRadius: 3,
        padding: 30,
        margin: 25,
        justifyContent: 'center',
        alignContent: 'center',
        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: 2,
        flexDirection:"column",
        fontFamily: theme.generalLayout.font
    },
})