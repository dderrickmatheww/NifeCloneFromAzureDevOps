import React from 'react';
import { View, Text, TouchableOpacity, Image, Modal, Linking, ScrollView } from 'react-native';
import { styles } from '../../../Styles/style';

export default class DataRow extends React.Component  {
    state = {
        modalVisable: false
    }

    render() {
        return (
            <View style={styles.dataRowContainer}>
                <ScrollView 
                    contentContainerStyle={{alignItems: 'center', justifyContent: 'center', width: 375}} 
                    style={styles.dataRowScroll}
                    showsHorizontalScrollIndicator={false}
                >
                    <ScrollView 
                        contentContainerStyle={{alignItems: 'center', justifyContent: 'center', width: 375, height: 375}} 
                        style={styles.facebookDataRowSection} 
                        showsHorizontalScrollIndicator={false}
                    >
                        <Image
                            style={styles.LogoData}
                            source={require("../../../Media/Images/fblogo.png")}
                        />
                        <Text style={styles.facebookDataText}>
                            {this.props.name} {"\n"} 
                            {this.props.city}, {this.props.state} {"\n"}
                            Address: {this.props.street} {"\n"}
                            {this.props.city}, {this.props.state} {this.props.zip} {"\n"}
                            Phone #: {this.props.phone}
                        </Text>
                            { this.props.about ?
                                <Text style={styles.dataRowDescription}>{this.props.about}</Text>
                                : null
                            }
                            {
                                this.props.specialties ? 
                                    <View style={styles.dataRowSpecialties}>
                                        {
                                            (
                                                this.props.specialties.breakfast == "0" &&
                                                this.props.specialties.coffee == "0" &&
                                                this.props.specialties.drinks == "0" &&
                                                this.props.specialties.lunch == "0" ?
                                                null :
                                                <Text style={styles.facebookScrollText}>{this.props.name}'s specialties: </Text>
                                            )
                                        }
                                        {
                                            this.props.specialties.breakfast == "1" ?
                                                <Text style={styles.facebookScrollText}> {'\u2B24'} A great breakfast option!</Text> 
                                            : null
                                        }
                                        {
                                            this.props.specialties.coffee == "1" ?
                                                <Text style={styles.facebookScrollText}> {'\u2B24'} A superb coffee option!</Text> 
                                            : null
                                        }
                                        {
                                            this.props.specialties.drinks == "1" ?
                                                <Text style={styles.facebookScrollText}> {'\u2B24'} They make great drinks!</Text> 
                                            : null
                                        } 
                                        {
                                            this.props.specialties.lunch == "1" ?
                                                <Text style={styles.facebookScrollText}>{'\u2B24'} A great place to grab a bite for lunch!</Text> 
                                            : null
                                        }
                                    </View> 
                                : null
                            }
                        <View style={styles.dataRowLinks}>
                            <Text style={styles.facebookDataText} > Links: {"\n"}
                                <Text style={{color: 'blue'}}
                                    onPress={() => Linking.openURL(this.props.link)}>
                                    Facebook Page
                                </Text>
                                {"\n"}
                                <Text style={{color: 'blue'}}
                                    onPress={() => Linking.openURL(this.props.website)}>
                                    {this.props.name}'s website
                                </Text>
                            </Text>
                        </View>
                    </ScrollView>
                    { this.props.tweetData ?
                        <ScrollView
                            contentContainerStyle={{alignItems: 'center', justifyContent: 'center', width: 375, height: 375}} 
                            style={styles.twitterDataRowSection} 
                            showsHorizontalScrollIndicator={false}
                        >
                            <Image
                                style={styles.LogoData}
                                source={require("../../../Media/Images/twitterlogo.png")}
                            />
                            { this.props.tweetData.map(tweet => (
                                    <View style={styles.twitterDataContainerSection}>
                                        <Image
                                            source={tweet.user.profile_image_url}
                                        />
                                        <Text style={styles.facebookDataText}>
                                            Tweeted {tweet.created_at} by {tweet.user.screen_name}: {"\n"}
                                            {tweet.text} {"\n"}
                                            Near {this.props.city}, {this.props.state} {"\n"}
                                        </Text>
                                    </View>
                                ))
                            }
                        </ScrollView>
                        : 
                        null
                    }
                </ScrollView>
            </View>
        )
    }
}