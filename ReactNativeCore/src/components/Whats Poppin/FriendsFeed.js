import React from 'react';
import {
    View,
    RefreshControl,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Text,
    Dimensions, Platform, Image
} from 'react-native';
import { 
    Headline,
    Avatar,
    Caption,
    Paragraph,
    Snackbar
} from 'react-native-paper';
import  theme  from '../../../Styles/theme';
import Util from '../../scripts/Util';
import StatusModal from '../Profile/Status Modal';
import { connect } from "react-redux";
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };
const TouchableOpacity = Util.basicUtil.TouchableOpacity();

const screen = Dimensions.get("window");

 class FriendsFeed extends React.Component  {
    state = {
        modalVisable: false,
        userData: null,
        friendData: null,
        feedData: null,
        snackBarVisable: false,
        refresh: false,
    }
    
    componentDidMount() {
        this.setState({
            userData: this.props.user,
            friendData: this.props.friends
        });
        this.setFriendDataArrays();
    }
    onRefresh = async ({ top, bottom }) => {
        this.setState({ 
            refresh: top,
            vertRefresh: bottom 
        });
        Util.user.GetUserData(this.props.user.email, (userData) => {
            Util.user.getFeed(this.props.user.email, (feedData) => {
                this.refresh({ userData, feedData });
            });
        });
    }
    setFriendDataArrays = async (feedData = null) => {
        let friendFeedData = feedData ? new Set(feedData) : new Set(this.props.feed);
        this.setState({
            feedData: friendFeedData
        });
        this.props.feedRefresh(friendFeedData);
    }
    onSave = () => {
        this.setState({
            modalVisable: false,
            snackBarVisable: true
        });
        this.setFriendDataArrays();
    }
    onDismiss = () => {
        this.setState({
            modalVisable: false
        });
    }
    onDismissSnackBar = () => {
        this.setState({
            snackBarVisable: false
        });
    }

    refresh = async ({userData, feedData}) => {
        if (userData) {
            await this.props.refresh(userData);
        }
        await this.setFriendDataArrays(feedData);
        this.setState({
            refresh: false,
            vertRefresh: false 
        });
        this.render();
    }

    render() {
        return (
           <View style={localStyles.safeAreaContainer}>
               <View style={localStyles.navHeader}>
                    <TouchableOpacity onPress={this.props.onDrawerPress} style={localStyles.drawerBtn}>
                        <Avatar.Image 
                            source={this.state.userData && this.state.userData.photoSource !== 'Unknown' ? {
                                uri:  this.state.userData.photoSource  
                            } : defPhoto}
                            size={35}
                        />
                    </TouchableOpacity> 
                    <View style={{width:"100%"}}>
                        <Headline style={{ color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.fontBold, marginLeft: '5%', marginBottom: '2%'}}>Friend's Feed</Headline>
                    </View>
                    <TouchableOpacity onPress={() => this.setState({ modalVisable: true })} style={localStyles.StatusOverlay}>
                        <Text style={localStyles.statusButton}>Update Status</Text>
                    </TouchableOpacity> 
                </View>
                
               {
                this.state.feedData ?
                    <ScrollView style={[localStyles.ScrollView]} contentContainerStyle={localStyles.scrollContent}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refresh}
                                        onRefresh={this.onRefresh}
                                        size={22}
                                        color={[theme.loadingIcon.color]}
                                        tintColor={theme.loadingIcon.color}
                                        title={'Loading...'}
                                        titleColor={theme.loadingIcon.textColor}
                                    />
                                }
                    >
                        {
                            this.state.feedData && this.state.feedData.length > 0 ?
                                this.state.feedData.map((data, i) => (
                                    <View key={i} style={localStyles.feedDataRow}>
                                        <Avatar.Image source={data.image.uri !== "Unknown" ? data.image : defPhoto}
                                                      size={50}/>
                                        <Text style={localStyles.displayName}>
                                            {data.name}
                                            {
                                                this.state.userData.isBusiness ?
                                                    <Caption
                                                        style={localStyles.feedType}>{"   " + this.props.business.City + ", " + this.props.business.State}</Caption> : null
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
                                                        source={{uri: data.statusImage}}/>
                                                    : null
                                            }
                                        </View>

                                        <Caption style={localStyles.Caption}>{Util.date.TimeSince(data.time)} ago</Caption>
                                    </View>
                                ))
                                :

                                <Text style={localStyles.emptyPoppinFeed}>Nothing to show here, add some friends and
                                    favorite spots if you haven't already!</Text>

                        }

                    </ScrollView>
                :
                    <View style={localStyles.viewDark}>
                        <ActivityIndicator size="large" color={theme.loadingIcon.color}></ActivityIndicator>
                    </View>
               }
               {
                   this.state.modalVisable ?
                    <StatusModal
                        isVisible={this.state.modalVisable}
                        user={this.state.userData}
                        refresh={this.onRefresh}
                        onDismiss={this.onDismiss}
                        onSave={this.onSave}
                    />
                  :
                    null
               }
               <Snackbar
                    visible={this.state.snackBarVisable}
                    onDismiss={() => this.onDismissSnackBar()}
                    action={{
                        label: 'Close',
                        onPress: () => {
                          this.onDismissSnackBar()
                        },
                      }}
                      style={{position: 'absolute', bottom: 725}}
                >
                    Updated your status!
                </Snackbar>
           </View> 
           
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
        paddingBottom: 10,
        paddingTop: 10,
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
        user: state.userData,
        friendRequests: state.friendRequests,
        friends: state.friendData,
        business: state.businessData,
    }
}

function mapDispatchToProps(dispatch){
    return {
        refresh: (userData) => dispatch({type:'REFRESH', data:userData})
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(FriendsFeed);

  