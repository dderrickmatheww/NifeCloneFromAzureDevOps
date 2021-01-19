import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
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
var defPhoto = { uri: 'https://firebasestorage.googleapis.com/v0/b/nife-75d60.appspot.com/o/Nife%20Images%2Flogoicon.PNG?alt=media&token=86fc1470-baf3-472c-bbd3-fad78787eeed' };

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
    }
    
    componentDidMount() {
        this.setState({
            userData: this.props.user,
            friendData: this.props.friends,
            businessData: this.props.business,
            isVerified: this.state.userData.isVerified ? this.state.userData.isVerified : false
        });
        this.setFriendDataArrays();
    }

    setFriendDataArrays = () => {
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
        this.setState({statusModalVisable: false});
        this.setState({eventModalVisable: false});
        this.setState({specialsModalVisable: false});
    }

    onDismissUpdate = () => {
        this.setState({modalVisible: false});
    }

    onDismissSnackBar = () => {
        this.setState({snackBarVisable: false});
    }

    refresh = (userData, friendData, requests, businessData) => {
        this.props.refresh(userData, null, null, businessData);
        this.setFriendDataArrays();
        let friendFeedData = this.state.feedData;
        friendFeedData = friendFeedData.sort((a, b) => (a.time < b.time) ? 1 : -1 );
        this.setState({ feedData: friendFeedData });
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
            
                <View style={styles.viewDark}>
                    <View style={localStyles.navHeader}>
                        <TouchableOpacity onPress={this.props.onDrawerPress} style={localStyles.drawerBtn}>
                            <Avatar.Image 
                                source={this.state.userData && this.state.userData.photoSource !== 'Unknown' ? {
                                    uri:  this.state.userData.photoSource  
                                } : defPhoto}
                                size={35}
                            />
                        </TouchableOpacity>  
                        <View style={{width:"100%", textAlign:"center", alignSelf:"center"}}>
                            <Headline style={{color:theme.LIGHT_PINK, paddingLeft:"15%"}}>Your Feed</Headline>
                        </View>
                        {
                            !this.state.userData.isBusiness ?
                            <TouchableOpacity onPress={()=>this.setState({statusModalVisable:true})} style={localStyles.StatusOverlay}>
                                <Text style={localStyles.statusButton}>Update Status</Text>
                            </TouchableOpacity> 
                            : 
                            
                            <TouchableOpacity onPress={()=>this.setState({modalVisible:true})} style={localStyles.StatusOverlay}>
                                <Text style={localStyles.statusButton}>Update. . .</Text>
                            </TouchableOpacity>
                        }
                    </View>
                        
                    {this.state.feedData ?
                     <ScrollView style={localStyles.ScrollView} contentContainerStyle={{justifyContent:"center", alignItems:"center", width:"98%", paddingBottom:20}}>
                            {
                                this.state.feedData && this.state.feedData.length >0 ?
                                    this.state.feedData.map((data, i)=>(
                                        <View key={i} style={localStyles.feedDataRow}>
                                            <Avatar.Image source={data.image} size={50}/>
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
                                    
                                        <Text style={{color:theme.LIGHT_PINK}}>Nothing to show here, add some friends and favorite spots if you haven't already!</Text>
                                    
                            }
                            
                    </ScrollView>
                    :
                    <View style={styles.viewDark}>
                        <ActivityIndicator size="large" color="#eca6c4"></ActivityIndicator>
                    </View>
                    }
                    {
                        this.state.modalVisible ?
                        <Modal 
                            contentContainerStyle={{width:"50%", height:"25%", borderRadius:10, alignSelf:"center", flexDirection:"column",
                            alignItems:"center", backgroundColor:theme.DARK}}
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
        backgroundColor: '#20232a',
        paddingBottom:10
      },
    modalButton: {
        backgroundColor: theme.DARK,
        borderRadius: 10,
        paddingVertical:0,
        borderWidth:1,
        borderColor:theme.LIGHT_PINK,
        borderRadius:5,
        paddingVertical:2,
        paddingHorizontal:5,
        textAlign:"center",
        marginVertical:5
      },
      modalButtonText: {
        color:theme.LIGHT_PINK,
        fontSize:20,
        textAlign:"center"
    },
    StatusOverlay: {
        position:"relative",
        top:2.5,
        right:145,
        backgroundColor: theme.DARK,
        borderRadius: 10,
        paddingVertical:0,
        borderWidth:1,
        borderColor:theme.LIGHT_PINK,
        borderRadius:5,
        paddingVertical:2,
        paddingHorizontal:5,
      },
    Caption: {
        color:theme.LIGHT_PINK,
        opacity: 0.60
    },
    statusButton: {
        color:theme.LIGHT_PINK,
        fontSize:10,
    },
    Paragraph:{
        color:theme.LIGHT_PINK,
        fontSize:12,
        marginTop:-10
    },
    displayName:{
        color:theme.LIGHT_PINK,
        left:60,
        top:-45,
        position:"relative",
        fontSize:15,
        fontWeight:"bold"
    },
    feedType:{
        color:theme.LIGHT_PINK,
        left:60,
        top:-50,
        position:"relative",
        fontSize:12,
        opacity: 0.60
    },
    feedDataRow:{
        flex:1,
        backgroundColor:theme.DARK,
        borderColor:theme.LIGHT_PINK,
        borderRadius:10,
        borderWidth:1,
        marginVertical:2,
        paddingVertical:5,
        paddingHorizontal:5,
        marginVertical:2,
        width:"100%",
    },
    navHeader:{
      marginTop:30,
      flexDirection:"row",
      borderBottomColor:theme.LIGHT_PINK,
      borderBottomWidth:1,
      width:"98%",
      textAlign:"center",
      alignItems:"center",
    },

    DrawerOverlay: {
        
      alignSelf:"flex-start",
      opacity: 0.75,
      backgroundColor: theme.DARK,
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
        marginTop: '3%',
        marginLeft: '1%',
        marginBottom: '3%',
        borderWidth: 1,
        borderColor: theme.LIGHT_PINK,
        borderRadius: 70
    },
  });
  