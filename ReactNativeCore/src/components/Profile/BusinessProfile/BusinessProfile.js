import React, {Component} from 'react';
import {
    View,
    ScrollView,
    ImageBackground,
    ActivityIndicator,
    StyleSheet,
    Platform,
    TouchableOpacity
} from 'react-native';
import {
    Title,
    Caption,
    Headline, Avatar
} from 'react-native-paper';
import Util, {defaultPhotoUrl} from '../../../utils/util';
import {connect} from "react-redux";
import {createBusinessEvent, deleteBusinessEvent, getBusiness} from "../../../utils/api/businesses";
import theme from "../../../styles/theme";
import StatusModal from "../../StatusModal/StatusModal";
import {styles} from "../../../styles/style";
import Clipboard from "../../Clipboard/Clipboard";
import UserProfileHeader from "../UserProfile/UserProfileHeader";
import {ProfilePicture} from "../ProfilePicture";
import {NoProfilePicture} from "../NoProfilePicture";
import {getUser, updateUser, uploadImage} from "../../../utils/api/users";


const defPhoto = {uri: defaultPhotoUrl};


class BusinessProfile extends Component {
    state = {
        isLoggedin: false,
        userData: !this.props.currentUser ? this.props.currentUser : this.props.currentUser,
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
        isCurrentUser: false,
        events: [],
        specials: [],
        loading: true,
        eventsLoading: false
    }

    calculateAge = (birthday) => { // birthday is a date
        const bDay = new Date(birthday);
        const ageDifMs = Date.now() - bDay.getTime();
        const ageDate = new Date(ageDifMs); // miliseconds from epoch
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

    getBusinessData = async () => {
        const uuid = this.props.route.params.uuid;
        const businessData = await getBusiness(uuid)
        this.setState({businessData})
    }

    async isCurrentUser() {
        this.setState({
            isCurrentUser: this.state.businessData.id === this.props.currentBusiness.id
        })
    }

    async getEventsAndSpecials() {
        const events = this.state.businessData?.business_events.filter(event => event.type === 'Event')
        const specials = this.state.businessData?.business_events.filter(event => event.type === 'Special')
        this.setState({
            events, specials
        })
        console.log('Events: ', this.state.events)
    }

    async getUserInfo() {
        const userEmail = this.props.route.params.email;
        console.log(userEmail)
        const userData = await getUser(userEmail)
        this.setState({userData})
        if(this.state.isCurrentUser){
            this.props.refresh({userData})
        }
    }

    async componentDidMount() {
        await this.getUserInfo()
        await this.getBusinessData()
        await this.isCurrentUser()
        await this.getEventsAndSpecials()
        this.setState({loading: false})
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

    async deleteEventOrSpecial(id) {
        this.setState({eventsLoading: true})
        console.log("event Id: ", id)
        const deleted = await deleteBusinessEvent(id)
        if (deleted.type === 'Event') {
            let events = this.state.events
            events = events.filter(event => event.id !== id)
            console.log(events)
            this.setState({events, eventsLoading: false});
        } else if (deleted.type === 'Special') {
            let specials = this.state.specials
            specials = specials.filter(event => event.id !== id)
            this.setState({specials, eventsLoading: false});
        }

    }

    async addEventOrSpecial(event) {
        const newEvent = await createBusinessEvent(event)
        if (event.type === 'Event') {
            const events = this.state.events
            events.push(newEvent)
            this.setState({events});
        } else if (event.type === 'Special') {
            const specials = this.state.specials
            specials.push(newEvent)
            this.setState({specials});
        }
    }

    UploadPic = async () => {
        this.setState({uploading: true})
        const email = this.props.route.params.email
        const photoSource = await uploadImage();
        await updateUser({ email,  photoSource});
        await this.getUserInfo()
        this.setState({uploading: false})
    }

    render() {
        return (
            ////////////////////////////////////////
            this.state.businessData && !this.state.loading ?
                <View style={localStyles.container}>
                    <View style={localStyles.navHeader}>
                        <TouchableOpacity onPress={this.props.route.params.openDrawer} style={localStyles.drawerBtn}>
                            <Avatar.Image
                                source={this.state.userData.photoSource ? {uri: this.state.userData.photoSource} : defPhoto}
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
                                this.state.userData.photoSource ?
                                    <ProfilePicture
                                        userData={this.state.userData}
                                        isCurrentUser={this.state.isCurrentUser}
                                        onPress={async () => {
                                            await this.UploadPic();
                                        }}
                                    />
                                    :
                                    <NoProfilePicture
                                        onPress={async () => {
                                            await this.UploadPic()
                                        }}
                                        uploading={this.state.uploading}
                                    />
                            }
                            {/*Address and Followers */}
                            <View style={localStyles.addressCont}>
                                <View style={{
                                    alignSelf: "center",
                                    width: "100%",
                                    textAlign: 'center',
                                    marginHorizontal: 'auto'
                                }}>
                                    {
                                        this.state.followerCount ?
                                            <Caption style={localStyles.followerCount}>
                                                Followers: {this.state.followerCount}
                                            </Caption>
                                            :
                                            null
                                    }
                                </View>

                                <View style={{alignSelf: "flex-start", width: "100%"}}>
                                    <Caption style={localStyles.address}>
                                        {`${this.state.businessData.street} ${this.state.businessData.city}, ${this.state.businessData.state}`}
                                    </Caption>

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
                                {
                                    !this.state.eventsLoading ?
                                        <Clipboard
                                            data={this.state.events}
                                            editable={this.state.isCurrentUser}
                                            onDelete={async (id) => this.deleteEventOrSpecial(id)}
                                            onAdd={async (event) => await this.addEventOrSpecial({
                                                ...event,
                                                type: 'Event'
                                            })}
                                            businessUUID={this.state.businessData.uuid}
                                        /> : <ActivityIndicator size="large" color={theme.loadingIcon.color}/>
                                }
                            </View>
                            {/* Specials */}
                            <View style={localStyles.profRow}>
                                <View style={{flexDirection: "row"}}>
                                    <Title style={localStyles.descTitle}>
                                        Specials:
                                    </Title>
                                </View>
                                {
                                    !this.state.eventsLoading ?
                                        <Clipboard
                                            data={this.state.specials}
                                            editable={this.state.isCurrentUser}
                                            onDelete={async (id) => this.deleteEventOrSpecial(id)}
                                            onAdd={async (event) => await this.addEventOrSpecial({
                                                ...event,
                                                type: 'Special'
                                            })}
                                            businessUUID={this.state.businessData.uuid}
                                        /> : <ActivityIndicator size="large" color={theme.loadingIcon.color}/>
                                }
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
                    <ActivityIndicator size="large" color={theme.loadingIcon.color}/>
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
        elevation: 4,
    },
    drinksChipCont: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start"
    },
    navHeader: {
        marginTop: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
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
        flexDirection: 'column',
        zIndex: 2,
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
        marginTop: 20

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
        currentBusiness: state.businessData,
        yelpData: state.yelpData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refresh: (userData) => dispatch({type: 'REFRESH', data: userData})
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(BusinessProfile);

