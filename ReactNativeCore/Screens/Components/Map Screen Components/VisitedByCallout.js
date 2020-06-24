import React from 'react';
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-paper';
import { styles } from '../../../Styles/style';
import Util from '../../../scripts/Util';
import theme from '../../../Styles/theme';

export default class VisitedByCallout extends React.Component  {
    render() {
        return (
            <View style={styles.callOutMarker}>
                <Text>{this.props.marker.name}</Text>
                <Text>Rated {this.props.marker.rating}/5 stars in {this.props.marker.review_count} reviews.</Text>
                    { 
                    this.props.marker.lastVisitedBy && this.props.marker.lastVisitedBy.length > 0 ?
                        this.props.marker.lastVisitedBy.length < 2 ?
                            this.props.marker.lastVisitedBy.map((friend, i) => (
                                friend.lastVisited && friend.lastVisited[this.props.marker.id] ?
                                <View style={styles.friendVisitedBy}>
                                    <Avatar.Image
                                    source={{uri: friend.providerData.photoURL}}
                                    size={30}
                                    style={styles.singleAvatar}
                                    /> 
                                    <Text style={styles.friendText}>
                                        Your friend {friend.displayName} was here {Util.date.TimeSince(new Date(friend.lastVisited[this.props.marker.id].checkInTime))} ago!
                                    </Text>
                                </View>
                                :
                                null
                            )) 
                        : 
                        <View>
                            <View style={styles.friendVisitedByMulti}>
                            { 
                                this.props.marker.lastVisitedBy.length < 5 ?
                                    this.props.marker.lastVisitedBy.map((friend, i) => (
                                        friend.lastVisited && friend.lastVisited[this.props.marker.id] ?
                                            <View style={styles.multiAvatar}>
                                            {
                                                i = 0 ? 
                                                <Avatar.Image
                                                    source={{uri: friend.providerData.photoURL}}
                                                    size={30}
                                                    style={{ borderWidth: 1.5, borderColor: theme.LIGHT_PINK}}
                                                />
                                                : <Avatar.Image
                                                    source={{uri: friend.providerData.photoURL}}
                                                    size={30}
                                                    style={{right: i * 0.2, borderWidth: 1.5, borderColor: theme.LIGHT_PINK, marginLeft: -10}}
                                                />
                                            }
                                            </ View>
                                        : null
                                    ))
                                : null
                            }
                            <Text style={styles.friendText}>
                                {this.props.marker.lastVisitedBy.length} friends were just here!
                            </Text>
                            </View>
                            {
                                this.props.marker.lastVisitedBy[this.props.marker.lastVisitedBy.length - 1].lastVisited[this.props.marker.id] ?
                                    <Text style={styles.friendText}>
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
                                <View style={styles.friendVisitedBy}>
                                    <Avatar.Image
                                        source={{uri: friend.providerData.photoURL}}
                                        size={30}
                                        style={styles.singleAvatar}
                                    /> 
                                    <Text style={styles.friendText}>
                                        {this.props.marker.currentlyCheckIn.length} friend is still currently here!
                                    </Text>
                                </View>
                            :
                            this.props.marker.currentlyCheckIn.length < 5 && 
                            friend.checkIn && 
                            friend.checkIn.buisnessUID == this.props.marker.id ?
                                <View style={styles.friendVisitedByMulti}>
                                    <View style={styles.multiAvatar}>
                                    {
                                        i = 0 ? 
                                        <Avatar.Image
                                            source={{uri: friend.providerData.photoURL}}
                                            size={30}
                                            style={{ borderWidth: 1.5, borderColor: theme.LIGHT_PINK}}
                                        />
                                        : <Avatar.Image
                                            source={{uri: friend.providerData.photoURL}}
                                            size={30}
                                            style={{right: i * 0.2, borderWidth: 1.5, borderColor: theme.LIGHT_PINK, marginLeft: -10}}
                                        />
                                    }
                                    </ View>
                                    <Text style={styles.friendText}>
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