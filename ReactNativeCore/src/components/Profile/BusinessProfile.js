import React, {Component} from 'react';
import {View, ScrollView, ImageBackground, ActivityIndicator, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {
    Title,
    Caption,
    Headline,
    Chip,
    Surface, Avatar, Text
} from 'react-native-paper';
import Util from '../../scripts/Util';
import {styles} from '../../../src/styles/style';
import theme from '../../../src/styles/theme';
import {Ionicons} from '@expo/vector-icons';
import StatusModal from './Status Modal';
import Clipboard from '../Universal/Clipboard';
import {connect} from "react-redux";


const defPhoto = {uri: Util.basicUtil.defaultPhotoUrl};


class BusinessProfile extends Component {
    state = {
        isLoggedin: false,
        userData: !this.props.profileUser? this.props.currentUser : this.props.profileUser,
        modalVisible: false,
        friendData: null,
        isAddingFriend: false,
        areFriends: false,
        statusModalVisible: false,
        uploading: false,
        businessData: this.props.isUserProfile ? this.props.businessData : null,
        followerCount: 0,
        yelpData: this.props.yelpData ? this.props.yelpData : null,
        isUserProfile: this.props.isUserProfile,
        open: null,
        close: null,

    }

    calculateAge = (birthday) => { // birthday is a date
        var bDay = new Date(birthday);
        var ageDifMs = Date.now() - bDay.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    getHours = () => {
        let dayIndex = new Date().getDay();
        let hours = this.state.businessData.data.hours[0].open[dayIndex];
        let start = hours.start.slice(0, 2) + ':' + hours.start.slice(2);
        let end = hours.end.slice(0, 2) + ':' + hours.end.slice(2);
        if (start.split(':')[0] > 12) {
            let standardTime = start.split(':')[0] - 12;
            start = standardTime + ":" + start.split(':')[1] + ' PM'
            this.setState({start: start});

        }
        if (end.split(':')[0] > 12) {
            let standardTime = end.split(':')[0] - 12;
            end = standardTime + ":" + end.split(':')[1] + ' PM'
            this.setState({close: end});
        }
    }



    onDismissStatus = () => {
        this.setState({statusModalVisible: false});
    }

    getBusinessData = () => {
            if (this.props.profileUser)
                Util.business.GetBusinessByUID(this.state.userData.businessId, (data) => {
                    console.log(data);
                    this.setState({businessData: data});
                    // this.getHours();
                    Util.business.GetFavoriteCount(this.state.userData.businessId, (count) => {
                        this.setState({followerCount: count});
                    });
                });
            else {
                //console.log(this.props.businessData)
                this.setState({businessData: this.props.businessData})
                // this.getHours();

                Util.business.GetFavoriteCount(this.state.userData.businessId, (count) => {
                    this.setState({followerCount: count});
                });
            }

    }

    componentDidMount() {
        this.getBusinessData();
    }

    favoriteABar = async (buisnessUID, boolean) => {
        let updatedUserData = this.props.currentUser;
        await Util.user.setFavorite(updatedUserData, buisnessUID, boolean, this.state.userData.displayName, (boolean, boolean2) => {
            if (!boolean2) {
                updatedUserData['favoritePlaces'][buisnessUID] = {
                    favorited: boolean,
                    name: this.state.userData.displayName
                };
                this.props.refresh(updatedUserData, null, null, null);
                this.setState({
                    followerCount: boolean ? this.state.followerCount += 1 : this.state.followerCount > 0 ? this.state.followerCount -= 1 : 0
                });
            } else {
                alert("You already have 10 favorites. Go to edit profile to remove some!");
            }
        });
    }

    UploadPic = () => {
        this.setState({uploading: true});
        this.props.uploadImage((uri) => {
            let user = this.props.userData;
            Util.business.UpdateUser(user.email, {photoSource: uri});
            user['photoSource'] = uri;
            this.setState({userData: user});
            this.props.refresh(user);
        });
    }

    render() {
        return (
            ////////////////////////////////////////
            this.state.businessData ?
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

                    </View>
                    <ScrollView contentContainerStyle={localStyles.loggedInContainer}>
                        <View style={localStyles.HeaderCont}>
                            {/*Display Name */}
                            <View style={{flexDirection: "column", justifyContent: "center"}}>
                                <Headline style={localStyles.headerName}>{this.state.userData.displayName} </Headline>
                            </View>
                            {

                                <ImageBackground style={localStyles.profilePic}
                                                 source={{uri: this.state.userData.photoSource && this.state.userData.photoSource !== "Unknown" ? this.state.userData.photoSource : defPhoto.uri}}>
                                    {
                                        !this.props.profileUser ?
                                            <TouchableOpacity
                                                style={{position: "relative", bottom: 0, left: 125 , zIndex:15}}
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

                            }

                            {/*Address and Followers */}
                            <View style={localStyles.addressCont}>
                                <View style={{alignSelf: "center", width: "100%", textAlign:'center', marginHorizontal:'auto'}}>
                                    {
                                        this.state.followerCount ?
                                            <Caption style={localStyles.followerCount}>
                                                Followers: {this.state.followerCount}
                                            </Caption>
                                            : null
                                    }
                                </View>

                                <View style={{alignSelf: "flex-start", width: "100%"}}>
                                    {
                                        this.state.businessData.data.location ?
                                            <Caption style={localStyles.address}>
                                                {this.state.businessData.data.location.display_address[0] + " " + this.state.businessData.data.location.display_address[1]}
                                            </Caption>
                                            : null
                                    }
                                </View>

                            </View>
                        </View>
                        <View style={localStyles.mainCont}>
                            {/* Events */}
                            <View style={localStyles.profRow}>
                                <View style={{flexDirection: "row"}}>
                                    <Title style={localStyles.descTitle}>
                                        Events:
                                    </Title>
                                </View>
                                <Clipboard editable={!this.props.profileUser} type={'events'} data={this.state.businessData.events} />
                                {/*    TODO Event Adder*/}
                            </View>
                            {/* Specials */}
                            <View style={localStyles.profRow}>
                                <View style={{flexDirection: "row"}}>
                                    <Title style={localStyles.descTitle}>
                                        Specials:
                                    </Title>
                                </View>
                                <Clipboard editable={!this.props.profileUser} type={'specials'} data={this.state.businessData.specials} />
                                {/*    TODO Specials Adder*/}
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
        paddingHorizontal:10,
        paddingVertical:5,
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
        marginVertical: 10,
        flexDirection:'column',
        zIndex:2,
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
        justifyContent: "flex-start",

    },
    addressCont: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "stretch",
        width: "90%"
    },
    loggedInContainer: {
        paddingHorizontal: 10,
        minHeight: '100%',
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
        marginTop: 75

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
    address: {
        fontSize: 12,
        marginTop: "2%",
        marginBottom: "1%",
        color: theme.generalLayout.textColor,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: theme.generalLayout.font
    },
    followerCount: {
        fontSize: 12,
        marginTop: "2%",
        marginBottom: "1%",
        color: theme.generalLayout.textColor,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
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
        yelpData: state.yelpData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refresh: (userData) => dispatch({type: 'REFRESH', data: userData})
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(BusinessProfile);

