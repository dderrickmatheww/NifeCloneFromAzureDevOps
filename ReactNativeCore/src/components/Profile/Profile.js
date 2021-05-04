import React, {Component} from 'react';
import {
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
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
    Chip,
    Surface
} from 'react-native-paper';
import Util from '../../scripts/Util';
import {styles} from '../../../Styles/style';
import theme from '../../../Styles/theme';
import {Ionicons} from '@expo/vector-icons';
import StatusModal from './Status Modal';
import {connect} from "react-redux";


const defPhoto = {uri: Util.basicUtil.defaultPhotoUrl};

class ProfileScreen extends Component {
    state = {
        isLoggedin: false,
        userData: this.props.userData,
        modalVisible: false,
        friendData: this.props.friends,
        isAddingFriend: false,
        areFriends: false,
        isUsersProfile: null,
        statusModalVisible: false,
        uploading: false,
        friendCount: 0,
    }

    calculateAge = (birthday) => {
        // birthday is a date
        var bDay = new Date(birthday);
        var ageDifMs = Date.now() - bDay.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    genderUpperCase = (gender) => {
        return gender.charAt(0).toUpperCase() + gender.slice(1);
    }

    //Set user data
    setUserData = () => {
        if (this.state.isUsersProfile) {
            Util.user.CheckLoginStatus((boolean) => {
                this.setState({
                    isLoggedin: boolean,
                    userData: this.props.user
                });
            });
        } else {
            Util.user.GetUserData(this.props.userData.email, (user) => {
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
        if (this.state.isUsersProfile) {
            this.setState({friendData: this.props.friends});
        } else {
            if (this.props.friends) {
                let friends = this.state.userData.friends;
                let count = friends.length;
                let friendEmails = Object.keys(friends);
                friendEmails.forEach((email) => {
                    if (friends[email] == true) {
                        count += 1;
                    }
                });
                this.setState({friendCount: count});
            }
        }
    }

    addFriend = () => {
        this.setState({isAddingFriend: true});
        Util.friends.AddFriend(this.state.userData.email, () => {
            this.setState({
                isAddingFriend: false,
                areFriends: true,
            });
        });
    }

    removeFriend = () => {
        this.setState({isAddingFriend: true});
        Util.friends.RemoveFriend(this.state.userData.email, () => {
            this.setState({
                isAddingFriend: false,
                areFriends: false,
                friendCount: this.state.friendCount !== 0 ? this.state.friendCount -= 1 : 0
            });
        });
    }

    //gets user and friend data
    setProps = () => {
        this.setState({isUsersProfile: this.props.isUserProfile});
        this.setUserData();
        this.setFriendData();
    }

    onDismissStatus = () => {
        this.setState({statusModalVisible: false});
    }

    areFriends = () => {
        if (!this.props.isUserProfile) {
            Util.user.IsFriend(this.props.user.friends, (boolean) => {
                this.setState({areFriends: boolean});
            });
        }
    }

    componentDidMount() {
        console.log('isUserProfile: ' + this.props.isUserProfile);
        this.setProps();
        this.getBusinessData();
        this.areFriends();
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
            let user = this.state.userData;
            user['photoSource'] = uri;
            // this.setState({ userData: user });
            this.props.refresh(user);
        });
    }

    render() {
        return (
            ////////////////////////////////////////
            this.props.userData ?
                <SafeAreaView style={localStyles.container}>
                    <View style={localStyles.navHeader}>
                        <TouchableOpacity onPress={this.props.onDrawerPress} style={localStyles.drawerBtn}>
                            <Avatar.Image
                                source={this.props.userData && this.props.userData.photoSource !== 'Unknown' ? {
                                    uri: this.props.userData.photoSource
                                } : defPhoto}
                                size={35}
                            />
                        </TouchableOpacity>

                        {/* Add Friend */}
                        {!this.state.isUsersProfile ? !this.state.areFriends ?
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
                        {this.state.isUsersProfile ?
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
                                <Headline style={localStyles.headerName}>{this.props.userData.displayName} </Headline>
                                <Title style={localStyles.headerAgeGender}>
                                    {this.genderUpperCase(this.props.userData.gender && this.props.userData.gender !== 'Unknown' ? this.props.userData.gender + ", " : "")}
                                    {this.genderUpperCase(this.props.userData.sexualOrientation && this.props.userData.sexualOrientation !== 'Unknown' ? this.props.userData.sexualOrientation + " -" : "")} {this.props.userData.dateOfBirth && this.props.userData.dateOfBirth !== 'Unknown' ? this.calculateAge(this.props.userData.dateOfBirth._seconds ? this.props.userData.dateOfBirth._seconds * 1000 : this.props.userData.dateOfBirth.seconds * 1000) : ""}
                                </Title>
                            </View>
                            {
                                this.props.userData.photoSource ?
                                    <View>
                                        <ImageBackground style={localStyles.profilePic}
                                                         source={{uri: this.props.userData.photoSource && this.props.userData.photoSource !== "Unknown" ? this.props.userData.photoSource : defPhoto.uri}}>
                                            {
                                                this.props.isUserProfile ?
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
                                        !this.props.userData.privacySettings.locationPrivacy ?
                                            <Caption style={localStyles.FriendCount}>
                                                {this.props.userData.loginLocation && this.props.userData.loginLocation.region ? this.props.userData.loginLocation.region.city : "Margarittaville"}, {this.props.userData.loginLocation && this.props.userData.loginLocation.region ? this.props.userData.loginLocation.region.region : "Somewhere"}
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
                                        disabled={this.state.isUsersProfile ? false : true}
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
                                        this.state.isUsersProfile ?
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
                                    style={localStyles.caption}>{this.props.userData.status ? this.props.userData.status.text : "None"}</Caption>
                            </View>
                            {/* bio */}
                            <View style={localStyles.profRow}>
                                <Title style={localStyles.descTitle}>
                                    Bio:
                                </Title>
                                <Caption
                                    style={localStyles.caption}>{this.props.userData.bio ? this.props.userData.bio : "None"}</Caption>
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
                                        this.props.userData.favoriteDrinks && this.props.userData.favoriteDrinks.length != 0 ?
                                            this.props.userData.favoriteDrinks.map((drink, i) => (

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
                                    {this.props.userData.favoritePlaces
                                    && this.props.userData.favoritePlaces !== 'Unknown'
                                    && this.props.userData.favoritePlaces.length > 0 ?
                                        Object.values(this.props.userData.favoritePlaces).map((bar, i) => (
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
                                    user={this.props.userData}
                                    onDismiss={() => this.onDismissStatus()}
                                    refresh={this.props.refresh}
                                    onSave={() => this.onDismissStatus()}
                                >
                                </StatusModal>
                                :
                                null
                        }
                    </ScrollView>
                </SafeAreaView>
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
        marginTop: 90

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
        userData: state.userData,
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
