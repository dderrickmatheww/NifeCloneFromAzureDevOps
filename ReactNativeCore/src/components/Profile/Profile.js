import React, {Component} from 'react';
import {
    View,
    ScrollView,
    ImageBackground,
    ActivityIndicator,
    StyleSheet,
    Platform
} from 'react-native';
import {
    Title,
    Caption,
    Text,
    Headline,
    Avatar,
    Chip
} from 'react-native-paper';
import Util from '../../scripts/Util';
import { styles } from '../../../Styles/style';
import theme from '../../../Styles/theme';
import { Ionicons } from '@expo/vector-icons';
import StatusModal from './Status Modal';
import { connect } from "react-redux";
const TouchableOpacity = Util.basicUtil.TouchableOpacity();


const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };

class ProfileScreen extends Component {
    state = {
        isLoggedin: false,
        userData: this.props.isUserProfile ? this.props.currentUser : this.props.profileUser,
        modalVisible: false,
        friendData: this.props.friends,
        isAddingFriend: false,
        areFriends: false,
        isUserProfile: null,
        statusModalVisible: false,
        uploading: false,
        friendCount: 0,
    }

    calculateAge = (birthday) => {
        // birthday is a date
        let bDay = new Date(birthday);
        let ageDifMs = Date.now() - bDay.getTime();
        let ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    genderUpperCase = (gender) => {
        return gender.charAt(0).toUpperCase() + gender.slice(1);
    }

    //Set user data
    setUserData = () => {
        if (this.state.isUserProfile) {
            Util.user.CheckLoginStatus((boolean) => {
                this.setState({
                    isLoggedin: boolean,
                    userData: this.props.userData
                });
            });
        } else {
            if(this.props.profileUser)
                Util.user.GetUserData(this.props.profileUser.email, (user) => {
                    Util.user.CheckLoginStatus((boolean) => {
                        this.setState({
                            isLoggedin: boolean,
                            userData: user
                        });
                    });
                });
        }
    }

    setFriendData = () => {
        if (this.state.isUserProfile) {
            this.setState({friendData: this.props.friends});
        } else {
            // if (this.props.friends) {
                let friends = this.props.friends;
                let friendEmails = Object.keys(friends);
                let count = friendEmails.filter((email) => {
                    return friends[email] == true
                }).length;
                this.setState({friendCount: count});
            // }
        }
    }

    addFriend = () => {
        this.setState({isAddingFriend: true});
        Util.friends.sendFriendRequest(this.props.profileUser.email, () => {
            Util.user.sendFriendReqNotification(this.props.currentUser.displayName, this.props.profileUser.email, console.log('sent notification!'));
            Util.user.GetUserData(this.props.currentUser.email, (userData) => {
                this.props.refresh(userData)
                this.setState({
                    isAddingFriend: false,
                    areFriends: true,
                });
            })

        });
    }

    removeFriend = () => {
        this.setState({isAddingFriend: true});
        Util.friends.handleFriendRequest(this.props.profileUser.email, false,() => {

            Util.user.GetUserData(this.props.currentUser.email, (userData) => {
                this.props.refresh(userData)
                this.setState({
                    isAddingFriend: false,
                    areFriends: false,
                    friendCount: this.state.friendCount !== 0 ? this.state.friendCount -= 1 : 0
                });
            });


        });
    }

    //gets user and friend data
    setProps = () => {
        this.setState({isUserProfile: this.props.isUserProfile});
        this.setUserData();
        this.setFriendData();
    }

    onDismissStatus = () => {
        this.setState({statusModalVisible: false});
    }

    areFriends = () => {
        if (this.props.profileUser) {
            Util.user.IsFriend(this.props.currentUser, this.props.profileUser.email,(boolean) => {
                this.setState({areFriends: boolean});
            });
        }
    }

    componentDidMount() {
        console.log('isUserProfile: ' + this.props.isUserProfile);
        this.setProps();
        this.getBusinessData();
        this.areFriends();
        console.log(this.state.userData.favoritePlaces)
    }

    getBusinessData = () => {
        if (this.state.userData.isBusiness) {
            Util.business.GetBusinessData((data) => {
                this.setState({businessData: data});
            });
        }
    }

    UploadPic = () => {
        this.setState({uploading: true});
        this.props.uploadImage((uri) => {
            console.log(uri);
            let user = this.props.userData;
            user['photoSource'] = uri;
            this.setState({userData: user});
            this.props.refresh(user);
        });
    }

    render() {
        return (
            ////////////////////////////////////////
            this.state.userData ?
                <View style={localStyles.container}>
                    <View style={localStyles.navHeader}>
                        <TouchableOpacity onPress={this.props.onDrawerPress} style={localStyles.drawerBtn}>
                            <Avatar.Image
                                source={this.state.userData && this.state.userData.photoSource !== 'Unknown' ? {
                                    uri: this.state.userData.photoSource
                                } : defPhoto}
                                size={35}
                            />
                        </TouchableOpacity>

                        {/* Add Friend */}
                        {this.props.profileUser ? !this.state.areFriends ?
                            <TouchableOpacity
                                onPress={() => this.addFriend()}
                                style={localStyles.AddFriendOverlay}
                            >
                                {
                                    this.state.isAddingFriend ?
                                        <ActivityIndicator size="small"
                                                           color={theme.loadingIcon.color}></ActivityIndicator>
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
                                onPress={() => this.removeFriend()}
                                style={localStyles.AddFriendOverlay}>
                                {
                                    this.state.isAddingFriend ?
                                        <ActivityIndicator size="small"
                                                           color={theme.loadingIcon.color}></ActivityIndicator> :
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
                        {!this.props.profileUser ?
                            <TouchableOpacity style={{
                                position: "relative",
                                left: 250,
                                alignSelf: "flex-end",
                                opacity: 0.75,
                                backgroundColor: theme.generalLayout.backgroundColor,
                                borderRadius: 10,
                                marginBottom: '5%',
                            }}
                                              onPress={() => this.props.navigation.navigate('Profile', {screen: 'Edit'})}
                            >
                                <Ionicons name="md-create" size={24} color={theme.icons.color}/>
                            </TouchableOpacity>
                            :
                            null
                        }
                    </View>
                    <ScrollView contentContainerStyle={localStyles.loggedInContainer}>
                        <View style={localStyles.HeaderCont}>
                            <View style={{flexDirection: "column", justifyContent: "center"}}>
                                <Headline style={localStyles.headerName}>{this.state.userData.displayName} </Headline>
                                <Title style={localStyles.headerAgeGender}>
                                    {this.genderUpperCase(this.state.userData.gender && this.state.userData.gender !== 'Unknown' ? this.state.userData.gender + ", " : "")}
                                    {this.genderUpperCase(this.state.userData.sexualOrientation && this.state.userData.sexualOrientation !== 'Unknown' ? this.state.userData.sexualOrientation + " -" : "")} {this.state.userData.dateOfBirth && this.state.userData.dateOfBirth !== 'Unknown' ? this.calculateAge(this.state.userData.dateOfBirth._seconds ? this.state.userData.dateOfBirth._seconds * 1000 : this.state.userData.dateOfBirth.seconds * 1000) : ""}
                                </Title>
                            </View>
                            {
                                this.state.userData.photoSource ?
                                    <View>
                                        <ImageBackground style={localStyles.profilePic}
                                                         source={{uri: this.state.userData.photoSource && this.state.userData.photoSource !== "Unknown" ? this.state.userData.photoSource : defPhoto.uri}}>
                                            {
                                                !this.props.profileUser  ?
                                                    <TouchableOpacity
                                                        style={{position: "relative", bottom: -125, right: -125}}
                                                        onPress={() => {
                                                            this.UploadPic();
                                                        }}
                                                    >
                                                        <Ionicons size={25} color={theme.icons.color}
                                                                  name="ios-add-circle"></Ionicons>
                                                    </TouchableOpacity>
                                                    :
                                                    null
                                            }
                                        </ImageBackground>
                                    </View>
                                    :
                                    <TouchableOpacity style={localStyles.NoAvatarButton}
                                                      onPress={() => {
                                                          this.UploadPic();
                                                      }}
                                    >
                                        {
                                            this.state.uploading ?
                                                <ActivityIndicator color={theme.loadingIcon.color}
                                                                   size={"large"}></ActivityIndicator>
                                                :
                                                <View style={{alignItems: "center"}}>
                                                    <Ionicons size={50} color={theme.icons.color}
                                                              name="ios-person"></Ionicons>
                                                    <Caption style={{
                                                        color: theme.icons.textColor,
                                                        textAlign: "center",
                                                        fontFamily: theme.generalLayout.font
                                                    }}>Click Me To Add Picture!</Caption>
                                                </View>
                                        }
                                    </TouchableOpacity>
                            }

                            {/* <Caption  style={localStyles.FriendCount}>Casual Socialite | 420 Points</Caption> */}

                            <View style={localStyles.LocAndFriends}>
                                {<View style={{alignSelf: "flex-start", width: "50%"}}>
                                    {
                                        !this.state.userData.privacySettings.locationPrivacy ?
                                            <Caption style={localStyles.FriendCount}>
                                                {this.state.userData.loginLocation && this.state.userData.loginLocation.region ? this.state.userData.loginLocation.region.city : "Margarittaville"}, {this.state.userData.loginLocation && this.state.userData.loginLocation.region ? this.state.userData.loginLocation.region.region : "Somewhere"}
                                            </Caption>
                                            : null
                                    }
                                </View>}
                                <View style={{
                                    alignSelf: "flex-end",
                                    flexDirection: "row",
                                    justifyContent: "space-evenly",
                                    width: "50%"
                                }}>
                                    <TouchableOpacity
                                        disabled={this.state.isUserProfile ? false : true}
                                        onPress={() => this.props.navigation.navigate('Profile', {screen: 'Friends',})}>
                                        <Caption
                                            style={localStyles.FriendCount}>{(this.state.friendData != null ? this.state.friendData.length : this.state.friendCount != 0 ? this.state.friendCount : 0)} Friends</Caption>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={localStyles.mainCont}>
                            {/* status */}
                            <View style={localStyles.profRow}>
                                <View style={{flexDirection: "row"}}>
                                    <Title style={localStyles.descTitle}>
                                        Status:
                                    </Title>
                                    {

                                        !this.props.profileUser ?
                                            <TouchableOpacity style={localStyles.editStatus}
                                                              onPress={() => this.setState({statusModalVisible: true})}
                                            >
                                                <Ionicons size={25} color={theme.icons.color}
                                                          name="ios-add-circle"></Ionicons>
                                            </TouchableOpacity>
                                            :
                                            null
                                    }
                                </View>
                                <Caption
                                    style={localStyles.caption}>{this.state.userData.status ? this.state.userData.status.text : "None"}</Caption>
                            </View>
                            {/* bio */}
                            <View style={localStyles.profRow}>
                                <Title style={localStyles.descTitle}>
                                    Bio:
                                </Title>
                                <Caption
                                    style={localStyles.caption}>{this.state.userData.bio ? this.state.userData.bio : "None"}</Caption>
                            </View>
                            {/* fave drinks */}
                            <View style={localStyles.profRow}>
                                <Title style={localStyles.descTitle}>
                                    Favorite Drinks:
                                </Title>

                                <ScrollView horizontal={true} contentContainerStyle={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    paddingBottom: 10
                                }}>
                                    {
                                        this.state.userData.favoriteDrinks && this.state.userData.favoriteDrinks.length != 0 ?
                                            this.state.userData.favoriteDrinks.map((drink, i) => (

                                                <Chip mode={"outlined"} key={i}
                                                      style={{
                                                          backgroundColor: theme.generalLayout.backgroundColor,
                                                          borderColor: theme.generalLayout.secondaryColor,
                                                          marginHorizontal: 2
                                                      }}
                                                      textStyle={{
                                                          color: theme.generalLayout.textColor,
                                                          fontFamily: theme.generalLayout.font
                                                      }}>
                                                    {drink}
                                                </Chip>

                                            ))
                                            :
                                            <Chip mode={"outlined"}
                                                  style={{
                                                      backgroundColor: theme.generalLayout.backgroundColor,
                                                      borderColor: theme.generalLayout.secondaryColor,
                                                      marginHorizontal: 2
                                                  }}
                                                  textStyle={{
                                                      color: theme.generalLayout.textColor,
                                                      fontFamily: theme.generalLayout.font
                                                  }}>
                                                None
                                            </Chip>
                                    }
                                </ScrollView>
                            </View>
                            {/* favorite bars */}
                            <View style={localStyles.profRow}>
                                <Title style={localStyles.descTitle}>
                                    Favorite Bars:
                                </Title>
                                <ScrollView horizontal={true} contentContainerStyle={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    paddingBottom: 0
                                }}>
                                    {this.state.userData.favoritePlaces
                                    && this.state.userData.favoritePlaces !== 'Unknown'
                                    && Object.values(this.state.userData.favoritePlaces).length > 0 ?
                                        Object.values(this.state.userData.favoritePlaces).map((bar, i) => (
                                            bar.favorited ?
                                                <Chip mode={"outlined"}
                                                      key={i}
                                                      style={{
                                                          backgroundColor: theme.generalLayout.backgroundColor,
                                                          borderColor: theme.generalLayout.secondaryColor,
                                                          marginHorizontal: 2
                                                      }}
                                                      textStyle={{
                                                          color: theme.generalLayout.textColor,
                                                          fontFamily: theme.generalLayout.font
                                                      }}>
                                                    {bar.name ? bar.name : 'None'}
                                                </Chip>
                                                :
                                                null
                                        ))
                                        :
                                        <Chip mode={"outlined"}
                                              style={{
                                                  backgroundColor: theme.generalLayout.backgroundColor,
                                                  borderColor: theme.generalLayout.secondaryColor,
                                                  marginHorizontal: 2
                                              }}
                                              textStyle={{
                                                  color: theme.generalLayout.textColor,
                                                  fontFamily: theme.generalLayout.font
                                              }}>
                                            None
                                        </Chip>
                                    }
                                </ScrollView>
                            </View>

                        </View>
                        {
                            this.state.statusModalVisible ?
                                <StatusModal
                                    isVisible={this.state.statusModalVisible}
                                    onDismiss={() => this.onDismissStatus()}
                                    refresh={this.props.refresh}
                                    onSave={() => this.onDismissStatus()}
                                >
                                </StatusModal>
                                :
                                null
                        }
                    </ScrollView>
                </View>
                :

                ///////////////////////////////////////////
                <View style={styles.viewDark}>
                    <ActivityIndicator size="large" color={theme.loadingIcon.color}></ActivityIndicator>
                </View>

        );
    }
}

const localStyles = StyleSheet.create({
    editStatus: {
        backgroundColor: theme.generalLayout.backgroundColor,
        position: "relative",

        ...Platform.select({
            ios: {
                left: 235,
            },
            android: {
                left: 220,
            },
        }),
        top: 10,
        opacity: .75
    },
    NoAvatarButton: {
        width: 150,
        height: 150,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.generalLayout.backgroundColor,
        justifyContent: 'center',
        alignItems: "center"
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: theme.generalLayout.backgroundColor,
        elevation: 4
    },
    drinksChipCont: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start"
    },
    navHeader: {
        marginTop: 25,
        flexDirection: "row",
        borderBottomColor: theme.generalLayout.secondaryColor,
        borderBottomWidth: 1,
        width: "98%"
    },
    EditOverlay: {
        position: "relative",
        left: 215,
        alignSelf: "flex-end",
        opacity: 0.75,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 10,
        marginBottom: 5,
    },
    DrawerOverlay: {
        alignSelf: "flex-start",
        opacity: 0.75,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 10,
        paddingVertical: 0,
    },

    AddFriendOverlay: {
        position: "relative",
        left: 195,
        alignSelf: "flex-end",
        opacity: 0.75,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 5,
        marginBottom: 7.5,
        borderWidth: 1,
        borderColor: theme.generalLayout.secondaryColor
    },
    profRow: {
        marginVertical: 10
    },
    descTitle: {
        fontSize: 18,
        color: theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font
    },
    caption: {
        fontSize: 14,
        color: theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font,
        marginLeft: 15
    },
    mainCont: {
        width: "95%",
        flex: 1,
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",

    },
    LocAndFriends: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "stretch",
        width: "90%"
    },
    loggedInContainer: {
        paddingHorizontal: 10,
        minHeight:'100%',
    },
    loggedInSubView: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        width: "100%",
        justifyContent: "center",
        marginBottom: "10%",
        alignItems: "center",
    },
    HeaderCont: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        width: "100%",
        maxHeight: "30%",
        justifyContent: "flex-end",
        alignItems: "center",
        borderBottomColor: theme.generalLayout.secondaryColor,
        borderBottomWidth: 2,
        marginTop: 50

    },
    profilePic: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: "2.5%"
    },
    friendPic: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    friendCont: {
        flexDirection: "row",
        borderBottomColor: theme.generalLayout.secondaryColor,
        borderBottomWidth: 1,
    },
    name: {
        fontSize: 18,
        color: theme.generalLayout.textColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: '.5%',
        marginLeft: '2.5%',
        width: "100%",
        fontFamily: theme.generalLayout.font
    },
    FriendCount: {
        fontSize: 12,
        marginTop: "2%",
        marginBottom: "1%",
        color: theme.generalLayout.textColor,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: theme.generalLayout.font
    },
    headerName: {
        fontSize: 20,
        fontWeight: "bold",
        color: theme.generalLayout.textColor,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: "center",
        fontFamily: theme.generalLayout.font
    },
    headerAgeGender: {
        fontSize: 14,
        fontWeight: "bold",
        color: theme.generalLayout.textColor,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: "center",
        marginTop: -10,
        fontFamily: theme.generalLayout.font
    },
    ScrollView: {
        flex: 1,
        width: "100%",
        borderLeftWidth: 2,
        borderLeftColor: theme.generalLayout.secondaryColor,
        borderRightWidth: 2,
        borderRightColor: theme.generalLayout.secondaryColor,
        paddingHorizontal: "5%",
        paddingBottom: "1%"
    },
    drawerBtn: {
        ...Platform.select({
            ios: {
                marginTop: '8%',
            },
            android: {
                marginTop: '3%',
            },
        }),
        marginLeft: '3%',
        marginBottom: '3%',
        borderWidth: 1,
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 70
    },
});

function mapStateToProps(state) {
    return {
        currentUser: state.userData,
        requests: state.friendRequests,
        friends: state.friendData,
        businessData: state.businessData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refresh: (userData) => dispatch({type: 'REFRESH', data: userData})
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
