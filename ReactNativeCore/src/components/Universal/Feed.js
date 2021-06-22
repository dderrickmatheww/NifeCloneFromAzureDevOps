import React from 'react';
import {
    View,
    RefreshControl,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Text,
    Dimensions, 
    Platform, 
    Image
} from 'react-native';
import { 
    Avatar,
    Caption,
    Paragraph,
} from 'react-native-paper';
import  theme  from '../../../Styles/theme';
import Util from '../../scripts/Util';
import { connect } from "react-redux";
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };
const screen = Dimensions.get("window");

 class Feed extends React.Component  {
    state = {
        userData: null,
        feedData: null,
        refresh: false,
        skip: 0
    }
    
    componentDidMount() {
        let {  
            userData,  
            feedData,
        } = this.props;
        this.setState({
            userData: userData,
            feedData: feedData
        });
        this.setFriendDataArrays({
            userData: userData,
            feedData: feedData
        });
    }
    onRefresh = async ({ top, bottom }) => {
        let { email } = this.props.userData;
        this.setState({ 
            refresh: top,
            vertRefresh: bottom,
            skip: top ? 0 : this.state.skip += 50
        });
        Util.user.GetUserData(email, (userData) => {
            Util.user.getFeed({ email, skip: this.state.skip }, (feedData) => {
                this.refresh({ userData, feedData });
            });
        });
    }
    refresh = async ({ userData, feedData }) => {
        if (userData) {
            await this.props.refresh(userData);
        }
        await this.setFriendDataArrays(userData, feedData);
        this.setState({
            refresh: false,
            vertRefresh: false 
        });
    }
    setFriendDataArrays = async ({ userData, feedData }) => {
        let user =  userData ? userData : this.props.userData;
        let business = this.props.business;
        let favorites = this.props.favorites;
        let friendFeedData = feedData ? new Set(feedData) : new Set(this.props.feedData);
        let isFriendFeed = this.props.isFriendFeed;
        if (!isFriendFeed) {
            //get user data
            if (!user.isBusiness) {
                if (favorites && favorites.length > 0) {
                    favorites.forEach((place) => {
                        if (place.events) {
                            let events = place.events;
                            events.forEach((event) => {
                                let obj = {
                                    name: place.displayName,
                                    text: "Event: " + event.text,
                                    time: new Date(event.uploaded.seconds ? event.uploaded.seconds * 1000 : event.uploaded._seconds * 1000),
                                    image: place.photoSource ? { uri: place.photoSource } : null,
                                    status: false,
                                    visited: false,
                                    checkedIn: false,
                                    event: true,
                                }
                                friendFeedData.add(obj);
                            });
                        }
                        if (place.specials) {
                            let specials = place.specials;
                            specials.forEach((special) => {
                                let obj = {
                                    name: place.displayName,
                                    text: "Special: " + special.text,
                                    time: new Date(special.uploaded.seconds ? special.uploaded.seconds * 1000 : special.uploaded._seconds * 1000),
                                    image: place.photoSource ? {uri: place.photoSource} : null,
                                    status: false,
                                    visited: false,
                                    checkedIn: false,
                                    event: false,
                                    specials: true,
                                }
                                friendFeedData.add(obj);
                            });
                        }
                    });
                } 
            }
            //if its a business
            if (business) {
                if (business.events.length > 0) {
                    let events = business.events;
                    events.forEach((event) => {
                        let obj = {
                            name: business.displayName,
                            text: "Event: " + event.text,
                            time: new Date(event.uploaded.seconds ? event.uploaded.seconds * 1000 : event.uploaded._seconds * 1000),
                            image: business.photoSource ? {uri: business.photoSource} : null,
                            status: false,
                            visited: false,
                            checkedIn: false,
                            event: true,
                        }
                        friendFeedData.add(obj);
                    });
                }
                if (business.specials.length > 0) {
                    let specials = business.specials;
                    specials.forEach((special) => {
                        let obj = {
                            name: business.displayName,
                            text: "Special: " + special.text,
                            time: new Date(special.uploaded.seconds ? special.uploaded.seconds * 1000 : special.uploaded._seconds * 1000),
                            image: business.photoSource ? { uri: business.photoSource } : null,
                            status: false,
                            visited: false,
                            checkedIn: false,
                            event: false,
                            specials: true,
                        }
                        friendFeedData.add(obj);
                    });
                }
            }
        }
        friendFeedData = [...friendFeedData];
        let data = new Set([...this.state.feedData, ...friendFeedData]
        .map(obj =>  { 
            obj['image'] = obj.image ? obj.image : defPhoto 
            return obj;
        })
        .sort((a, b) => b.time - a.time));
        this.setState({
            feedData: [...data]
        });
        this.props.refresh(null, this.state.feedData);
    }
    render() {
        return (
            <ScrollView 
                style={[localStyles.ScrollView]} 
                contentContainerStyle={localStyles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refresh}
                        onRefresh={() => { this.onRefresh({ top: true, bottom: false }) }}
                        size={22}
                        color={[theme.loadingIcon.color]}
                        tintColor={theme.loadingIcon.color}
                        title={'Loading...'}
                        titleColor={theme.loadingIcon.textColor}
                    />
                }
                onScroll={({ nativeEvent }) => {
                    let count = 0;
                    if (count == 0) {
                        if (Util.basicUtil.VerticalLoader(nativeEvent)) {
                            this.onRefresh({ top: false, bottom: true });
                            count++;
                        }
                    }
                }}
                scrollEventThrottle={400}
            >
               {
                this.state.feedData ?
                    this.state.feedData && this.state.feedData.length > 0 ?
                        this.state.feedData.map((data, i) => (
                            <View key={i} style={localStyles.feedDataRow}>
                                <Avatar.Image source={data.image ? data.image.uri : defPhoto}
                                                size={50}/>
                                <Text style={localStyles.displayName}>
                                    { data.name }
                                    {
                                        this.state.userData.isBusiness ?
                                            <Caption
                                                style={localStyles.feedType}>{"   " + this.props.business.City + ", " + this.props.business.State}
                                            </Caption> 
                                        : 
                                            null
                                    }
                                </Text>
                                <Caption style={localStyles.feedType}>{data.visited ? "took a visit" : data.checkedIn ? "checked in" : data.event ? "booked an event" : data.specials ? "has a new special" : "status update"}</Caption>
                                <View>
                                    <Paragraph style={localStyles.Paragraph}>{data.text}</Paragraph>
                                    {
                                        data.statusImage ?
                                            <Image
                                                resizeMethod="auto"
                                                resizeMode="contain"
                                                style={{flex:1,resizeMode:'contain',aspectRatio:1}}
                                                source={{uri: data.statusImage}}
                                            />
                                        : 
                                            null
                                    }
                                </View>
                                <Caption style={localStyles.Caption}>{Util.date.TimeSince(data.time._seconds ? data.time._seconds * 1000 : data.time.seconds * 1000)} ago</Caption>
                            </View>
                        ))
                    :
                        <Text style={localStyles.emptyPoppinFeed}>Nothing to show here, add some friends and favorite spots if you haven't already!</Text>
                :
                    <View style={localStyles.viewDark}>
                        <ActivityIndicator size="large" color={theme.loadingIcon.color}></ActivityIndicator>
                    </View>
               }
               { 
                    this.state.vertRefresh ? 
                        <View style={localStyles.loaderRow}>
                            <ActivityIndicator size="large" color={theme.loadingIcon.color}></ActivityIndicator>
                        </View>
                    :
                        null
                }
            </ScrollView>
        )
    }
}
const localStyles = StyleSheet.create({
    scrollContent: {
        justifyContent: "center",
        alignItems: "center",
        width: "98%",
        ...Platform.select({
            ios: {
                paddingBottom: 120,
            },
            android: {
                paddingBottom: 120,
            },
        })
    },
    viewDark: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.generalLayout.backgroundColor,
        paddingBottom: 10
    },
    modalButton: {
        backgroundColor: theme.generalLayout.backgroundColor,
        borderWidth: 1,
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 5,
        textAlign: "center",
        marginVertical: 5,
        fontFamily: theme.generalLayout.font
    },
    modalButtonText: {
        color: theme.generalLayout.secondaryColor,
        fontSize: 20,
        textAlign: "center",
        fontFamily: theme.generalLayout.font
    },
    StatusOverlay: {
        position: "relative",
        right: 150,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderWidth: .5,
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 8
    },
    Caption: {
        color: theme.generalLayout.textColor,
        opacity: 0.60,
        fontFamily: theme.generalLayout.font
    },
    statusButton: {
        color: theme.generalLayout.textColor,
        fontSize: 11,
        fontFamily: theme.generalLayout.font
    },
    Paragraph: {
        color: 'white',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10,
        fontFamily: theme.generalLayout.font
    },
    displayName: {
        color: 'white',
        left: 60,
        top: -45,
        position: "relative",
        fontSize: 15,
        fontWeight: "bold",
        fontFamily: theme.generalLayout.fontBold
    },
    feedType: {
        color: 'white',
        left: 60,
        top: -50,
        position: "relative",
        fontSize: 12,
        opacity: 0.60
    },
    feedDataRow: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderColor: theme.generalLayout.secondaryColor,
        color: theme.generalLayout.textColor,
        borderRadius: 10,
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 2,
        width: "100%",
    },
    loaderRow: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderColor: theme.generalLayout.secondaryColor,
        color: theme.generalLayout.textColor,
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 2,
        width: "100%",
    },
    emptyPoppinFeed: {
        color: theme.generalLayout.textColor,
        fontSize: 16,
        padding: 20,
        textAlign: "center",
        justifyContent: "center",
        fontFamily: theme.generalLayout.font
    },
    navHeader: {
        marginTop: 12.5,
        flexDirection: "row",
        borderBottomColor: theme.generalLayout.secondaryColor,
        borderBottomWidth: 1,
        width: "98%",
        textAlign: "center",
        alignItems: "center",
    },
    DrawerOverlay: {
        alignSelf: "flex-start",
        opacity: 0.75,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 10,
        paddingVertical: 0,
    },
    ScrollView: {
        flex: 1,
        width: "100%",
        paddingHorizontal: "5%",
        paddingBottom: 20,
        paddingTop: 20,
    },
    drawerBtn: {
        marginTop: '1%',
        marginLeft: '3%',
        marginBottom: '3%',
        borderRadius: 70
    },
    safeAreaContainer: {
        flex: 1,
        paddingTop: "7%",
        backgroundColor: theme.generalLayout.backgroundColor,
    },
});

function mapStateToProps(state){
    return{
        userData: state.userData,
        business: state.businessData,
        feedData: state.feedData
    }
}

function mapDispatchToProps(dispatch){
    return {
        refresh: (userData) => dispatch({type: 'REFRESH', data: userData}),
        feedRefresh: (feedData) => dispatch({ type: 'REFRESHFEED', data: feedData }),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Feed);

  