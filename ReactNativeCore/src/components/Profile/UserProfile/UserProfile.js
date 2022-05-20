import React, {Component} from 'react';
import {
    View,
    ScrollView,
} from 'react-native';
import {connect} from "react-redux";
import {Loading} from "../../Loading";
import {getUser} from "../../../utils/api/users";
import {localStyles} from "./style";
import UserProfileHeader from "./UserProfileHeader";
import {ProfilePicture} from "../ProfilePicture";
import * as PropTypes from "prop-types";
import {NoProfilePicture} from "../NoProfilePicture";
import {UserInformation} from "../UserInformation";
import {getUserRegion} from "../../../utils/location";
import {LocationAndFriends} from "./LocationAndFriends";
import {ProfileStatus} from "./ProfileStatus";
import {ProfileBio} from "./ProfileBio";



ProfileBio.propTypes = {userData: PropTypes.any};

class UserProfile extends Component {

    state = {
        loading: false,
        userData: null,
        isCurrentUser: true,
        areFriends: false,
        isAddingFriend: false,
        uploading: false,
        region: null,
    }

    async getUserInfo() {
        const userEmail = this.props.route.params.email;
        const userData = await getUser(userEmail)
        this.setState({userData})
    }

    async isCurrentUser() {
        this.setState({
            isCurrentUser: this.state.userData.id === this.props.currentUser.id
        })
    }

    async areFriends() {
        this.setState({
            areFriends: this.state.userData.user_friends.some(friend => friend.id === this.props.currentUser.id)
        })
    }

    async addFriend() {
        this.setState({isAddingFriend: true})
        console.log('Add Friend')
        this.setState({isAddingFriend: false})
    }

    async removeFriend() {
        this.setState({loading: true})
        console.log('Add Friend')
        this.setState({loading: false})
    }

    calculateAge = (birthday) => {
        // birthday is a date
        let bDay = new Date(birthday);
        let ageDifMs = Date.now() - bDay.getTime();
        let ageDate = new Date(ageDifMs); // miliseconds from epoch.
        return ` ${Math.abs(ageDate.getUTCFullYear() - 1970)}`;
    }

    toUpperCase = (gender) => {
        return gender.charAt(0).toUpperCase() + gender.slice(1);
    }

    UploadPic = () => {
        this.setState({uploading: true})
        this.setState({uploading: false})
    }

    getFriendsLength() {
        return this.state.userData.user_friends.filter(friend => friend.isFriend).length
    }

    async getRegion() {
        const location = await getUserRegion({
            latitude: this.state.userData.latitude,
            longitude: this.state.userData.longitude,
        })
        const {region} = location[0];
        this.setState({region});
    }

    async componentDidMount() {
        this.setState({loading: true})
        await this.getUserInfo()
        await this.isCurrentUser;
        if (!this.state.isCurrentUser) {
            await this.areFriends
        }
        await this.getRegion();
        this.setState({loading: false})
    }

    render() {
        return (
            ////////////////////////////////////////
            this.state.userData && !this.state.loading ?
                <View style={localStyles.container}>
                    <UserProfileHeader
                        currentUser={this.state.isCurrentUser}
                        areFriends={this.state.areFriends}
                        addFriend={() => this.addFriend()}
                        addingFriend={this.state.isAddingFriend}
                        removeFriend={() => this.removeFriend()}
                        editProfile={() => this.props.navigation.navigate('Profile', {screen: 'Edit'})}
                        openDrawer={this.props.route.params.openDrawer}
                    />
                    <ScrollView contentContainerStyle={localStyles.loggedInContainer}>
                        <View style={localStyles.HeaderCont}>
                            <UserInformation
                                userData={this.state.userData}
                                genderUpperCase={this.toUpperCase(this.state.userData.gender ? this.state.userData.gender + ", " : "")}
                                sexualOrientation={this.toUpperCase(this.state.userData.sexualOrientation ? this.state.userData.sexualOrientation + " -" : "")}
                                dateOfBirth={this.calculateAge(this.state.userData.dateOfBirth)}
                            />
                            {
                                this.state.userData.photoSource ?
                                    <ProfilePicture
                                        userData={this.state.userData}
                                        isCurrentUser={this.state.isCurrentUser}
                                        onPress={() => {
                                            this.UploadPic();
                                        }}
                                    />
                                    :
                                    <NoProfilePicture
                                        onPress={() => {
                                            this.UploadPic()
                                        }}
                                        uploading={this.state.uploading}
                                    />
                            }

                            <LocationAndFriends
                                userData={this.state.userData} region={this.state.region}
                                currentUser={this.state.isCurrentUser}
                                onPress={() => this.props.route.navigate('Profile', {screen: 'Friends'})}
                                friendsLength={this.getFriendsLength()}
                            />
                        </View>
                        <View style={localStyles.mainCont}>
                            {/* status */}
                            <ProfileStatus currentUser={this.state.isCurrentUser}
                                           onPress={() => this.setState({statusModalVisible: true})}
                                           userData={this.state.userData}/>
                            {/* bio */}
                            <ProfileBio userData={this.state.userData}/>

                            {/*    TODO add favorite bars/drinks back */}

                        </View>

                    </ScrollView>
                </View>
                : <Loading/>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.userData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refresh: ({userData}) => dispatch({
            type: 'REFRESH',
            data: {
                userData
            }
        })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);