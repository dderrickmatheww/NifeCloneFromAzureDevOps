import React from 'react';
import { View, TouchableOpacity, StyleSheet, RefreshControl, ScrollView, ActivityIndicator } from 'react-native';
import { 
    Text, 
    Headline,
    Avatar,
    Caption,
    Paragraph,
    Snackbar,
    Modal
} from 'react-native-paper';
import { styles } from '../Styles/style';
import  theme  from '../Styles/theme';
import Util from '../scripts/Util';
import StatusModal from '../Screens/Components/Profile Screen Components/Status Modal';
import AddressProof from '../Screens/Universal Components/AddressProof';
import EventsModal from '../Screens/Components/Whats Poppin Components/UpdateEventsModal';
import SpecialsModal from '../Screens/Components/Whats Poppin Components/UpdateSpecialsModal';
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };

export default class FriendsFeed extends React.Component  {

    state = {
        statusModalVisable: false,
        eventModalVisable: false,
        specialsModalVisable: false,
        modalVisible: false,
        userData: this.props.user,
        friendData: this.props.friends,
        feedData: null,
        businessData: this.props.business,
        snackBarVisable: false,
        menuVisable: false,
        snackBarText: "status",
        isVerified: false,
        refresh: false
    }
    
    async componentDidMount() {
        this.setState({
            userData: this.props.user,
            friendData: this.props.friends,
            businessData: this.props.business,
            isVerified: this.state.userData.isVerified ? this.state.userData.isVerified : false
        });
        await this.setFriendDataArrays();
    }

    setFriendDataArrays = async () => {
        let friends = this.props.friends;
        let user = this.props.user;
        let business = this.props.business;
        let favorites = this.props.favorites;
        let friendFeedData = [];

        if(user.status) {
            let obj = {
                name: user.displayName,
                text: user.status.text,
                time: new Date(user.status.timestamp.seconds ? user.status.timestamp.seconds : user.status.timestamp._seconds * 1000),
                image: user.photoSource ? {uri:user.photoSource} : defPhoto,
                status: true,
                visited: false,
                checkedIn: false,
            }
            friendFeedData.push(obj);
        }
        //get friend data if not a business
        if(!user.isBusiness && typeof friends !== 'undefined' && friends.length > 0) {
            friends.forEach((friend) => {
                if(friend.status){
                    let obj = {
                        name: friend.displayName,
                        text: friend.status.text,
                        time: new Date(friend.status.timestamp.seconds ? friend.status.timestamp.seconds : friend.status.timestamp._seconds * 1000),
                        image: friend.photoSource ? {uri:friend.photoSource} : defPhoto,
                        status: true,
                        visited: false,
                        checkedIn: false,
                    }
                    friendFeedData.push(obj);
                }
                if (friend.checkIn) {
                    if (
                        (friend.checkIn.privacy == "Public" || friend.checkIn.privacy == "Friends") && 
                        friend.checkIn.checkInTime && 
                        (!friend.privacySettings || !friend.privacySettings.checkedInPrivacy)
                    ) {
                        let obj = {
                            name: friend.displayName,
                            text: "Checked in " + (friend.checkIn.name ? " at " +  friend.checkIn.name : "somewhere! No name provided!"),
                            time: new Date(friend.checkIn.checkInTime.seconds ? friend.checkIn.checkInTime.seconds : friend.checkIn.checkInTime._seconds * 1000),
                            image: friend.photoSource ? { uri: friend.photoSource} : { defPhoto },
                            status: false,
                            visited:false,
                            checkedIn:true,
                        }
                        friendFeedData.push(obj);
                    }
                }
                if (friend.lastVisited) {
                    let keys = Object.keys(friend.lastVisited);
                    keys.forEach((key) => {
                        let visited = friend.lastVisited[key];
                        if(visited.privacy == "Public" || visited.privacy == "Friends" && (!friend.privacySettings || !friend.privacySettings.visitedPrivacy)) {
                            let obj = {
                                name: friend.displayName,
                                text: "Visited " + (visited.name ? visited.name : "somewhere! No name provided!"),
                                time: new Date(visited.checkInTime.seconds ? visited.checkInTime.seconds : visited.checkInTime._seconds * 1000),
                                image: friend.photoSource ? { uri: friend.photoSource } : { defPhoto },
                                status: false,
                                visited:true,
                                checkedIn:false,
                            }
                            friendFeedData.push(obj);
                        }
                    });
                }
            });
        }
        
        //get user data
        if (!user.isBusiness) {
            if (favorites && favorites.length > 0) {
                favorites.forEach((place) => {
                    if (place.events) {
                        let events = place.events;
                        events.forEach((event) => {
                            let obj = {
                                name: place.displayName,
                                text: "Event: " + event.event,
                                time: new Date(event.uploaded.seconds ? event.uploaded.seconds : event.uploaded._seconds * 1000),
                                image: place.photoSource ? { uri: place.photoSource } : { defPhoto },
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
                                text: "Special: " + special,
                                time: new Date(),
                                image: place.photoSource ? { uri: place.photoSource } : { defPhoto },
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
            
            if (user.checkIn) {
                if (
                    (user.checkIn.privacy == "Public" || user.checkIn.privacy == "Friends") && 
                    user.checkIn.checkInTime && 
                    (!user.privacySettings || !user.privacySettings.checkedInPrivacy)
                ) {
                    let obj = {
                        name: user.displayName,
                        text: "Checked into " + (user.checkIn.name ? " at " +  user.checkIn.name : "somewhere! No name provided!"),
                        time: new Date(user.checkIn.checkInTime.seconds ? user.checkIn.checkInTime.seconds : user.checkIn.checkInTime._seconds * 1000),
                        image: user.photoSource ? { uri: user.photoSource } : { defPhoto },
                        status: false,
                        visited: false,
                        checkedIn: true
                    }
                    friendFeedData.push(obj);
                }
            }
            
            if (user.lastVisited) {
                let keys = Object.keys(user.lastVisited);
                keys.forEach((key) => {
                    let visited = user.lastVisited[key];
                    if (
                        visited.privacy == "Public" || visited.privacy == "Friends" && 
                        (!user.privacySettings || !user.privacySettings.visitedPrivacy)
                    ) {
                        let obj = {
                            name: user.displayName,
                            text: "Visited " + (visited.name ? visited.name : "somewhere! No name provided!"),
                            time: new Date(visited.checkInTime.seconds ? visited.checkInTime.seconds: visited.checkInTime._seconds * 1000),
                            image: user.photoSource ? {uri:user.photoSource} : {defPhoto},
                            status: false,
                            visited:true,
                            checkedIn:false,
                        }
                        friendFeedData.push(obj);
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
                        text: "Event: " + event.event,
                        time: new Date(event.uploaded.seconds ? event.uploaded.seconds : event.uploaded._seconds   * 1000),
                        image: business.photoSource ? {uri:business.photoSource} : {defPhoto},
                        status: false,
                        visited: false,
                        checkedIn:  false,
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
                        text: "Special: " + special.special,
                        time: new Date(special.uploaded.seconds ? special.uploaded.seconds : special.uploaded._seconds * 1000),
                        image: business.photoSource ? { uri: business.photoSource } : { defPhoto },
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
        friendFeedData = friendFeedData.sort((a, b) => (a.time < b.time) ? 1 : -1 );
        this.setState({ feedData: friendFeedData });
    }

    onSave = (updated) => {
        this.setState({statusModalVisable: false, snackBarVisable: true});
        if (updated.status){
            this.setState({snackBarText: "status"});
        }
        if (updated.events){
            this.setState({snackBarText: "events"});
        }
        if (updated.specials) {
            this.setState({snackBarText: "specials"});
        }
    }

    onDismiss = () => {
        this.setState({
            statusModalVisable: false,
            eventModalVisable: false,
            specialsModalVisable: false
        });
    }

    onDismissUpdate = () => {
        this.setState({modalVisible: false});
    }

    onDismissSnackBar = () => {
        this.setState({snackBarVisable: false});
    }
    onRefresh = async () => {
        this.setState({ refresh: true });
        await this.refresh();
    }
    refresh = async (userData, friendData, requests, businessData) => {
        this.props.refresh(userData, null, null, businessData);
        await this.setFriendDataArrays();
        let friendFeedData = this.state.feedData;
        friendFeedData = friendFeedData.sort((a, b) => (a.time < b.time) ? 1 : -1 );
        this.setState({ 
            feedData: friendFeedData, 
            refresh: false 
        });
        this.render();
    }

    handleUploadImage = () => {
        let userEmail = firebase.auth().currentUser.email;
        ImagePicker.getCameraRollPermissionsAsync()
        .then((result) => {
            if (result.status == "granted") {
            this.setState({ uploading: true });
            ImagePicker.launchImageLibraryAsync()
            .then((image) => {
                let uri = image.uri;
                Util.business.UploadAddressProof(uri, userEmail, (resUri) => {
                    this.setState({ isVerified: true });
                    Util.business.SendProofEmail(userEmail, resUri);
                    Util.user.UpdateUser(userEmail, { isVerified: true})
                    let user = this.state.userData;
                    user.isVerified = true;
                    this.setState({userData:user});
                    this.refresh(user, null, null, null);
                }, true);
            })
            .catch((error) => {
                Util.basicUtil.Alert('Function HomeScreen/handleUploadImage - Error message:', error.message, null);
                Util.basicUtil.consoleLog('HomeScreen/handleUploadImage', false);
            });
            }
            else {
                ImagePicker.requestCameraRollPermissionsAsync()
                .then((result)=>{
                    if(result.status == "granted") {
                        this.setState({uploading:true});
                        ImagePicker.launchImageLibraryAsync()
                        .then((image) => {
                            let uri = image.uri
                            Util.business.UploadAddressProof(uri, userEmail, (resUri) => {
                                this.setState({isVerified:true});
                                Util.business.SendProofEmail(userEmail, resUri);
                                Util.user.UpdateUser(firebase.firestore(), userEmail, {isVerified:true}, ()=>{
                                    let user = this.state.userData;
                                    user.isVerified = true;
                                    this.setState({userData:user});
                                    this.refresh(user, null, null, null);
                                });
                            }, true);
                        })
                        .catch((error) => {
                            Util.basicUtil.Alert('Function HomeScreen/handleUploadImage - Error message:', error.message, null);
                            Util.basicUtil.consoleLog('HomeScreen/handleUploadImage', false);
                        });
                    }
                });
            }
        });
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
                            <Headline style={{ color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.fontBold, marginLeft: '5%', marginBottom: '2%'}}>Your Feed</Headline>
                        </View>
                        {
                            !this.state.userData.isBusiness ?
                                <TouchableOpacity onPress={() => this.setState({ statusModalVisable: true })} style={localStyles.StatusOverlay}>
                                    <Text style={localStyles.statusButton}>Update Status</Text>
                                </TouchableOpacity> 
                            : 
                                <TouchableOpacity onPress={()=>this.setState({modalVisible:true})} style={localStyles.StatusOverlay}>
                                    <Text style={localStyles.statusButton}>Update...</Text>
                                </TouchableOpacity>
                        }
                    </View>
                        
                    {this.state.feedData ?
                     <ScrollView style={localStyles.ScrollView} contentContainerStyle={{justifyContent:"center", alignItems:"center", width:"98%", paddingBottom:20}}
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
                                this.state.feedData && this.state.feedData.length >0 ?
                                    this.state.feedData.map((data, i)=>(
                                        <View key={i} style={localStyles.feedDataRow}>
                                            <Avatar.Image source={data.image.uri !== "Unknown" ? data.image : defPhoto} size={50}/>
                                            <Text style={localStyles.displayName}>
                                                {data.name}
                                                {
                                                    this.state.userData.isBusiness ?
                                                    <Caption style={localStyles.feedType}>{"   "+ this.state.businessData.city + ", " + this.state.businessData.state}</Caption> : null
                                                }
                                            </Text>
                                            <Caption style={localStyles.feedType}>{data.visited ?"took a visit" : data.checkedIn ? "checked in" : data.event ? "booked an event" : data.specials ? "has a new special" : "status update"}</Caption>
                                            
                                            <Paragraph style={localStyles.Paragraph}>{data.text}</Paragraph>
                                            <Caption style={localStyles.Caption}>{Util.date.TimeSince(data.time)} ago</Caption>
                                        </View> 
                                    )) 
                                    : 
                                    
                                        <Text style={localStyles.emptyPoppinFeed}>Nothing to show here, add some friends and favorite spots if you haven't already!</Text>
                                    
                            }
                            
                    </ScrollView>
                    :
                    <View style={styles.viewDark}>
                        <ActivityIndicator size="large" color={theme.loadingIcon.color}></ActivityIndicator>
                    </View>
                    }
                    {
                        this.state.modalVisible ?
                        <Modal 
                            contentContainerStyle={{width:"50%", height:"25%", borderRadius:10, alignSelf:"center", flexDirection:"column",
                            alignItems:"center", backgroundColor: theme.generalLayout.backgroundColor}}
                            visible={this.state.modalVisible}
                            dismissable={true}
                            onDismiss={() => this.onDismissUpdate()}
                            >
                            
                                <View style={localStyles.viewDark}>
                                    <TouchableOpacity onPress={()=>this.setState({statusModalVisable:true})} style={localStyles.modalButton}>
                                        <Text style={localStyles.modalButtonText}>Update Status</Text>
                                    </TouchableOpacity> 
                                    <TouchableOpacity onPress={()=>this.setState({eventModalVisable:true})} style={localStyles.modalButton}>
                                        <Text style={localStyles.modalButtonText}>Update Events</Text>
                                    </TouchableOpacity> 
                                    <TouchableOpacity onPress={()=>this.setState({specialsModalVisable:true})} style={localStyles.modalButton}>
                                        <Text style={localStyles.modalButtonText}>Update Specials</Text>
                                    </TouchableOpacity> 
                                </View> 
                            </Modal>
                        :
                        null
                    }
                    {
                         !this.state.isVerified && this.state.userData.isBusiness?
                            <AddressProof
                                isVisible={!this.state.userData.isVerified }
                                user={this.state.userData}
                                onDismiss={()=>this.onDismiss()}
                                onSave={()=>this.onSave({status:true})}
                                refresh={this.refresh}
                                uploadImage={this.handleUploadImage}
                            >
                            </AddressProof> 
                        :
                            null
                    }
                    {
                        this.state.statusModalVisable ?
                        <StatusModal
                            isVisible={this.state.statusModalVisable}
                            user={this.state.userData}
                            onDismiss={()=>this.onDismiss()}
                            onSave={()=>this.onSave({status:true})}
                            refresh={this.refresh}
                        >
                        </StatusModal> 
                        :
                        null
                    }
                    {
                        this.state.eventModalVisable && this.state.businessData ?
                        <EventsModal
                            isVisible={this.state.eventModalVisable}
                            user={this.state.userData}
                            onDismiss={()=>this.onDismiss()}
                            onSave={()=>this.onSave({events:true})}
                            refresh={this.refresh}
                            business={this.state.businessData}
                        >
                        </EventsModal> 
                        :
                        null
                    }
                    {
                        this.state.specialsModalVisable && this.state.businessData ?
                        <SpecialsModal
                            isVisible={this.state.specialsModalVisable}
                            user={this.state.userData}
                            onDismiss={()=>this.onDismiss()}
                            onSave={()=>this.onSave({specials:true})}
                            refresh={this.refresh}
                            business={this.state.businessData}
                        >
                        </SpecialsModal> 
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
                            Updated your {this.state.snackBarText}!
                    </Snackbar>
                </View>
        )
    }
}
const localStyles = StyleSheet.create({
    viewDark: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center' ,
        backgroundColor: theme.generalLayout.backgroundColor,
        paddingBottom:10
      },
    modalButton: {
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 10,
        paddingVertical:0,
        borderWidth:1,
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius:5,
        paddingVertical:2,
        paddingHorizontal:5,
        textAlign:"center",
        marginVertical:5,
        fontFamily: theme.generalLayout.font
      },
      modalButtonText: {
        color: theme.generalLayout.secondaryColor,
        fontSize:20,
        textAlign:"center",
        fontFamily: theme.generalLayout.font
    },
    StatusOverlay: {
        position:"relative",
        right: 150,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 10,
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
    Paragraph:{
        color: theme.generalLayout.textColor,
        fontSize:12,
        marginTop:-10,
        fontFamily: theme.generalLayout.font
    },
    displayName:{
        color: theme.generalLayout.textColor,
        left:60,
        top:-45,
        position:"relative",
        fontSize:15,
        fontWeight:"bold",
        fontFamily: theme.generalLayout.fontBold
    },
    feedType:{
        color: theme.generalLayout.textColor,
        left:60,
        top:-50,
        position:"relative",
        fontSize:12,
        opacity: 0.60
    },
    feedDataRow:{
        flex:1,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius:10,
        borderWidth:1,
        marginVertical:2,
        paddingVertical:5,
        paddingHorizontal:5,
        marginVertical:2,
        width:"100%",
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
        flexDirection:"row",
        borderBottomColor: theme.generalLayout.secondaryColor,
        borderBottomWidth:1,
        width:"98%",
        textAlign:"center",
        alignItems:"center",
    },
    DrawerOverlay: {
      alignSelf:"flex-start",
      opacity: 0.75,
      backgroundColor: theme.generalLayout.backgroundColor,
      borderRadius: 10,
      paddingVertical:0,
    },
    ScrollView: {
        flex: 1,
        width: "100%",
        paddingHorizontal: "5%",
        paddingBottom: 10,
        paddingTop: 10
      },
      drawerBtn: {
        marginTop: '1%',
        marginLeft: '3%',
        marginBottom: '3%',
        borderRadius: 70
    },
    safeAreaContainer: {
        flex: 1,
        paddingTop:"7%",
        backgroundColor: theme.generalLayout.backgroundColor,
    },
  });
  