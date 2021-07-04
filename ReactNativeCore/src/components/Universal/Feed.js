import React, { useState, useEffect } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    Image, 
    FlatList, 
    RefreshControl,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import { 
    Avatar,
    Caption,
    Paragraph,
} from 'react-native-paper';
import theme from '../../../Styles/theme';
import Util from '../../scripts/Util';
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };

function Feed(props) {
    const [ userData, setUserData ] = useState(props.userData);
    const [ feedData, setFeedData ] = useState(props.feedData);
    const [ refresh, setRefresh ] = useState(false);
    const [ skip, setSkip ] = useState(0);

    useEffect(() => {
        const checkIfUpdate = async () => {
            setRefresh(true);
            await setUp(props.userData, props.feedData);
            setRefresh(false);
        }
        if (feedData && feedData.length !== props.feedData.length) {
            console.log('useEffect if')
            checkIfUpdate();
        }
    }, [props.userData, props.feedData]);

    const setUp = async (user, feed) => {
        console.log('setUp')
        user = user.length > 0 ? user : props.userData;
        let business = props.business;
        let favorites = props.favorites;
        let friendFeedData = feed.length > 0 ? feed : props.feedData;
        let isFriendFeed = props.isFriendFeed;
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
                                    image: place.photoSource ? place.photoSource : null,
                                    status: false,
                                    visited: false,
                                    checkedIn: false,
                                    event: true,
                                }
                                friendFeedData.push(obj);
                            });
                        }
                        if (place.specials) {
                            let specials = place.specials;
                            specials.forEach((special) => {
                                let obj = {
                                    name: place.displayName,
                                    text: "Special: " + special.text,
                                    time: new Date(special.uploaded.seconds ? special.uploaded.seconds * 1000 : special.uploaded._seconds * 1000),
                                    image: place.photoSource ? place.photoSource : null,
                                    status: false,
                                    visited: false,
                                    checkedIn: false,
                                    event: false,
                                    specials: true,
                                }
                                friendFeedData.push(obj);
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
                            image: business.photoSource ? business.photoSource : null,
                            status: false,
                            visited: false,
                            checkedIn: false,
                            event: true,
                        }
                        friendFeedData.push(obj);
                    });
                }
                if (business.specials.length > 0) {
                    let specials = business.specials;
                    specials.forEach((special) => {
                        let obj = {
                            name: business.displayName,
                            text: "Special: " + special.text,
                            time: new Date(special.uploaded.seconds ? special.uploaded.seconds * 1000 : special.uploaded._seconds * 1000),
                            image: business.photoSource ? business.photoSource : null,
                            status: false,
                            visited: false,
                            checkedIn: false,
                            event: false,
                            specials: true,
                        }
                        friendFeedData.push(obj);
                    });
                }
            }
        }
        friendFeedData = [...friendFeedData];
        data = [...friendFeedData, ...feedData];
        data = Array.from(new Set(data.map(a => a.uid)))
        .map(uid => data.find(a => a.uid === uid))
        .sort(( a, b ) => a.time - b.time);
        setFeedData([]);
        setUserData(user);
        setRefresh(false);
        setFeedData(data);
    }

    const onRefresh = async () => {
        setRefresh(true);
        let { email } = props.userData;
        let localSkip = skip;
        if (feedData.length >= skip) {
            localSkip += 50;
        }
        setSkip(localSkip);
        Util.user.getFeed({ email, skip: skip }, (updatedData) => {
            props.refresh(userData, updatedData);
            setRefresh(false);
        });
    }

    return (
        <View style={ localStyles.container }>
            <View style={ localStyles.containerGallery }>
                <FlatList
                    numColumns={ 1 }
                    horizontal={ false }
                    data={ feedData }
                    keyExtractor={ item => item ? item.uid : Util.basicUtil.getUUID()}
                    refreshing={ refresh }
                    onEndReached={ onRefresh }
                    refreshControl={
                        <RefreshControl
                            refreshing={ refresh }
                            onRefresh={ onRefresh }
                            size={ 22 }
                            title="Loading.."
                            tintColor={ theme.loadingIcon.color }
                            titleColor={ theme.generalLayout.textColor }
                        />
                    }
                    renderItem={({ item }) => (
                        <View style={ localStyles.feedDataRow }>
                            <Avatar.Image source={ item.image ? { uri: item.image } : defPhoto } size={50}/>
                            <Text style={ localStyles.displayName }>
                                    { item.username ? item.username : null }
                                    { item.name }
                                {
                                    userData && userData.isBusiness ?
                                        <Caption
                                            style={ localStyles.feedType }>{ "   " + props.business.City + ", " + props.business.State }
                                        </Caption> 
                                    : 
                                        null
                                }
                            </Text>
                            <Caption style={ localStyles.feedType }>{ item.visited ? "Took a visit" : item.checkedIn ? "Checked in" : item.event ? "Booked an event" : item.specials ? "Has a new special" : "Status update" }</Caption>
                            <View>
                                <Paragraph style={ localStyles.Paragraph }>{ item.text }</Paragraph>
                                {
                                    item.statusImage ?
                                        <Image
                                            resizeMethod="auto"
                                            resizeMode="contain"
                                            style={{ flex: 1, resizeMode:'contain', aspectRatio:1}}
                                            source={{ uri: item.statusImage }}
                                        />
                                    : 
                                        null
                                }
                            </View>
                            <Caption style={localStyles.Caption}>{ Util.date.TimeSince(item.time._seconds ? item.time._seconds * 1000 : item.time.seconds * 1000) } ago</Caption>
                        </View>
                    )}

                />
            </View>
        </View>
    )
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
        borderWidth: .5,
        marginVertical: 15,
        paddingVertical: 10,
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
    container: {
        flex: 1,
        marginBottom: '25%'
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 3

    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    }
});

function mapStateToProps(state) {
    return {
        userData: state.userData,
        business: state.businessData,
        feedData: state.feedData
    }
}
function mapDispatchToProps (dispatch) {
    return {
        refresh: (userData, feedData) => dispatch({ type:'REFRESH', data: userData, feed: feedData }),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Feed);


// import React from 'react';
// import {
//     View,
//     RefreshControl,
//     StyleSheet,
//     ScrollView,
//     ActivityIndicator,
//     Text,
//     Dimensions, 
//     Platform, 
//     Image,
//     FlatList
// } from 'react-native';
// import { 
//     Avatar,
//     Caption,
//     Paragraph,
// } from 'react-native-paper';
// import  theme  from '../../../Styles/theme';
// import Util from '../../scripts/Util';
// import { connect } from "react-redux";
// const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };
// const screen = Dimensions.get("window");

//  class Feed extends React.Component  {
//     state = {
//         userData: this.props.userData,
//         feedData: [],
//         refresh: false,
//         skip: 0
//     }
    
//     componentDidMount() {
//         let user = this.props.userData;
//         let feed = this.props.feedData;
//         this.setUp(user, feed);
//     }
//     
//     onRefresh = () => {
//         let { email } = this.props.userData;
//         let skip = 0;
//         if (this.state.feedData.length >= this.state.skip) {
//             skip += 50;
//         }
//         this.setState({ 
//             refresh: true,
//             skip: skip
//         }, 
//         () => {
//             Util.user.getFeed({ email, skip: this.state.skip }, async (feedData) => {
//                 this.setUp(null, feedData);
//             });
//         });
        
//     }
//     render() {
//         return (
//                 <FlatList
//                 data={this.state.feedData}
//                 renderItem={({
//                     item
//                 }) => {
//                     return (
//                         <View style={localStyles.feedDataRow}>
//                             <Avatar.Image source={item.image ? { uri: item.image } : defPhoto} size={50}/>
//                             <Text style={localStyles.displayName}>
//                                 { item.name }
//                                 {
//                                     this.state.userData && this.state.userData.isBusiness ?
//                                         <Caption
//                                             style={localStyles.feedType}>{"   " + this.props.business.City + ", " + this.props.business.State}
//                                         </Caption> 
//                                     : 
//                                         null
//                                 }
//                             </Text>
//                             <Caption style={localStyles.feedType}>{item.visited ? "Took a visit" : item.checkedIn ? "Checked in" : item.event ? "Booked an event" : item.specials ? "Has a new special" : "Status update"}</Caption>
//                             <View>
//                                 <Paragraph style={localStyles.Paragraph}>{item.text}</Paragraph>
//                                 {
//                                     item.statusImage ?
//                                         <Image
//                                             resizeMethod="auto"
//                                             resizeMode="contain"
//                                             style={{flex:1,resizeMode:'contain',aspectRatio:1}}
//                                             source={{uri: item.statusImage}}
//                                         />
//                                     : 
//                                         null
//                                 }
//                             </View>
//                             <Caption style={localStyles.Caption}>{Util.date.TimeSince(item.time._seconds ? item.time._seconds * 1000 : item.time.seconds * 1000)} ago</Caption>
//                         </View>
//                     )
//                 }}
//                 extraData={this.state.feedData.sort((a, b) => b.time - a.time)}
//                 keyExtractor={item => item._id}
//                 refreshing={this.state.refresh}
//                 onEndReached={this.onRefresh}
//                 refreshControl={
//                     <RefreshControl
//                         refreshing={this.state.refresh}
//                         onRefresh={this.onRefresh}
//                         size={22}
//                         title="Loading.."
//                         tintColor={theme.loadingIcon.color}
//                         titleColor={theme.generalLayout.textColor}
//                      />
//                 }
//             />
//         )
//     }
// }
// const localStyles = StyleSheet.create({
//     scrollContent: {
//         justifyContent: "center",
//         alignItems: "center",
//         width: "98%",
//         ...Platform.select({
//             ios: {
//                 paddingBottom: 120,
//             },
//             android: {
//                 paddingBottom: 120,
//             },
//         })
//     },
//     viewDark: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: theme.generalLayout.backgroundColor,
//         paddingBottom: 10
//     },
//     modalButton: {
//         backgroundColor: theme.generalLayout.backgroundColor,
//         borderWidth: 1,
//         borderColor: theme.generalLayout.secondaryColor,
//         borderRadius: 5,
//         paddingVertical: 2,
//         paddingHorizontal: 5,
//         textAlign: "center",
//         marginVertical: 5,
//         fontFamily: theme.generalLayout.font
//     },
//     modalButtonText: {
//         color: theme.generalLayout.secondaryColor,
//         fontSize: 20,
//         textAlign: "center",
//         fontFamily: theme.generalLayout.font
//     },
//     StatusOverlay: {
//         position: "relative",
//         right: 150,
//         backgroundColor: theme.generalLayout.backgroundColor,
//         borderWidth: .5,
//         borderColor: theme.generalLayout.secondaryColor,
//         borderRadius: 5,
//         paddingVertical: 8,
//         paddingHorizontal: 8
//     },
//     Caption: {
//         color: theme.generalLayout.textColor,
//         opacity: 0.60,
//         fontFamily: theme.generalLayout.font
//     },
//     statusButton: {
//         color: theme.generalLayout.textColor,
//         fontSize: 11,
//         fontFamily: theme.generalLayout.font
//     },
//     Paragraph: {
//         color: 'white',
//         fontSize: 12,
//         marginTop: -10,
//         marginBottom: 10,
//         fontFamily: theme.generalLayout.font
//     },
//     displayName: {
//         color: 'white',
//         left: 60,
//         top: -45,
//         position: "relative",
//         fontSize: 15,
//         fontWeight: "bold",
//         fontFamily: theme.generalLayout.fontBold
//     },
//     feedType: {
//         color: 'white',
//         left: 60,
//         top: -50,
//         position: "relative",
//         fontSize: 12,
//         opacity: 0.60
//     },
//     feedDataRow: {
//         flex: 1,
//         backgroundColor: theme.generalLayout.backgroundColor,
//         borderColor: theme.generalLayout.secondaryColor,
//         color: theme.generalLayout.textColor,
//         borderRadius: 10,
//         borderWidth: .5,
//         marginVertical: 15,
//         paddingVertical: 10,
//         paddingHorizontal: 10,
//         marginVertical: 2,
//         width: "100%",
//     },
//     loaderRow: {
//         flex: 1,
//         backgroundColor: theme.generalLayout.backgroundColor,
//         borderColor: theme.generalLayout.secondaryColor,
//         color: theme.generalLayout.textColor,
//         borderRadius: 10,
//         paddingVertical: 5,
//         paddingHorizontal: 10,
//         marginVertical: 2,
//         width: "100%",
//     },
//     emptyPoppinFeed: {
//         color: theme.generalLayout.textColor,
//         fontSize: 16,
//         padding: 20,
//         textAlign: "center",
//         justifyContent: "center",
//         fontFamily: theme.generalLayout.font
//     },
//     navHeader: {
//         marginTop: 12.5,
//         flexDirection: "row",
//         borderBottomColor: theme.generalLayout.secondaryColor,
//         borderBottomWidth: 1,
//         width: "98%",
//         textAlign: "center",
//         alignItems: "center",
//     },
//     DrawerOverlay: {
//         alignSelf: "flex-start",
//         opacity: 0.75,
//         backgroundColor: theme.generalLayout.backgroundColor,
//         borderRadius: 10,
//         paddingVertical: 0,
//     },
//     ScrollView: {
//         flex: 1,
//         width: "100%",
//         paddingHorizontal: "5%",
//         paddingBottom: 20,
//         paddingTop: 20,
//     },
//     drawerBtn: {
//         marginTop: '1%',
//         marginLeft: '3%',
//         marginBottom: '3%',
//         borderRadius: 70
//     },
//     safeAreaContainer: {
//         flex: 1,
//         paddingTop: "7%",
//         backgroundColor: theme.generalLayout.backgroundColor,
//     },
// });

// function mapStateToProps(state){
//     return{
//         userData: state.userData,
//         business: state.businessData,
//         feedData: state.feedData
//     }
// }

// function mapDispatchToProps(dispatch){
//     return {
//         refresh: (userData, feedData) => dispatch({ type:'REFRESH', data: userData, feed: feedData }),
//     }
// }


// export default connect(mapStateToProps, mapDispatchToProps)(Feed);

  