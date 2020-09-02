import React from 'react';
import { View, TouchableOpacity, Image,StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
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
import { Ionicons } from '@expo/vector-icons'; 
import Util from '../scripts/Util';
import StatusModal from '../Screens/Components/Profile Screen Components/Status Modal';
import EventsModal from '../Screens/Components/Whats Poppin Components/UpdateEventsModal';
import SpecialsModal from '../Screens/Components/Whats Poppin Components/UpdateSpecialsModal';

var defPhoto = require('../Media/Images/logoicon.png')
export default class FriendsFeed extends React.Component  {
    state = {
        statusModalVisable: false,
        eventModalVisable: false,
        specialsModalVisable: false,
        modalVisible: false,
        userData:this.props.user,
        friendData:this.props.friends,
        feedData: null,
        businessData:this.props.business,
        snackBarVisable:false,
        menuVisable: false,
        snackBarText:"status"
    }
    
    componentDidMount(){
        this.setState({
            userData:this.props.user,
            friendData:this.props.friends,
            businessData:this.props.business
        });
        this.setFriendDataArrays();
        this.sortFeed()
        // console.log("friendData: " + JSON.stringify(this.props.friends));
    }

    setFriendDataArrays = () => {
        // this.setState({feedData:null})
        let friends = this.props.friends;
        let user = this.props.user;
        let business = this.props.business;
        let favorites = this.props.favorites;
        let friendFeedData = [];

        if(user.status){
            let obj = {
                name: user.displayName,
                text: user.status.text,
                time: new Date(user.status.timestamp.seconds * 1000),
                image: user.photoSource ? {uri:user.photoSource} : defPhoto,
                status: true,
                visited:false,
                checkedIn:false,
            }
            friendFeedData.push(obj);
        }
        //get friend data if not a business
        if(!user.isBusiness){
            friends.forEach((friend) =>{
                if(friend.status){
                    //console.log(" \n friend.status.timestamp :" + friend.status.timestamp);
                    let obj = {
                        name: friend.displayName,
                        text: friend.status.text,
                        time: new Date(friend.status.timestamp.seconds * 1000),
                        image: friend.photoSource ? {uri:friend.photoSource} : defPhoto,
                        status: true,
                        visited:false,
                        checkedIn:false,
                    }
                    friendFeedData.push(obj);
                }
                if(friend.checkIn){
                    if((friend.checkIn.privacy == "Public" || friend.checkIn.privacy == "Friends") && friend.checkIn.checkInTime && (!friend.privacySettings || !friend.privacySettings.checkedInPrivacy)){
                        // console.log(" \n friend.checkIn.checkInTime :" + friend.checkIn.checkInTime);
                        let obj = {
                            name: friend.displayName,
                            text: "Checked in " + (friend.checkIn.name ? " at " +  friend.checkIn.name : "somewhere"),
                            time: new Date(friend.checkIn.checkInTime.seconds * 1000),
                            image: friend.photoSource ? {uri:friend.photoSource} : {defPhoto},
                            status: false,
                            visited:false,
                            checkedIn:true,
                        }
                        friendFeedData.push(obj);
                    }
                }
                if(friend.lastVisited){
                    let keys = Object.keys(friend.lastVisited);
                    keys.forEach((key)=>{
                        let visited = friend.lastVisited[key];
                        if(visited.privacy == "Public" || visited.privacy == "Friends" && (!friend.privacySettings || !friend.privacySettings.visitedPrivacy)){
                            // console.log(" \n visited.checkInTime. :" + visited.checkInTime);
                            let obj = {
                                name: friend.displayName,
                                text: "Visited " + (visited.name ? visited.name : "somewhere"),
                                time: new Date(visited.checkInTime.seconds * 1000),
                                image: friend.photoSource ? {uri:friend.photoSource} : {defPhoto},
                                status: false,
                                visited:true,
                                checkedIn:false,
                            }
                            friendFeedData.push(obj);
                        }
                    })
                }
                
            });
        }
        
        //get user data
        if(!user.isBusiness){
            if(favorites){
                console.log('Fav length: ' + favorites.length)
                favorites.forEach((place)=>{
                    if(place.events){
                        let events = place.events;
                        events.forEach((event)=>{
                            let obj = {
                                name: place.displayName,
                                text: "Event: " + event.event,
                                time: new Date(event.uploaded.seconds * 1000),
                                image: place.photoSource ? {uri:place.photoSource} : {defPhoto},
                                status: false,
                                visited:false,
                                checkedIn:false,
                                event: true,
                            }
                            friendFeedData.push(obj);
                        })
                    }
                    if(place.specials){
                            let specials = place.specials;
                            specials.forEach((special)=>{
            
                            let obj = {
                                name: place.displayName,
                                text: "Special: " + special,
                                time: new Date(),
                                image: place.photoSource ? {uri:place.photoSource} : {defPhoto},
                                status: false,
                                visited:false,
                                checkedIn:false,
                                event: false,
                                specials:true,
                            }
                            friendFeedData.push(obj);
                            })
                        }
                })
            }
            
            if(user.checkIn){
                if((user.checkIn.privacy == "Public" || user.checkIn.privacy == "Friends") && user.checkIn.checkInTime && (!friend.privacySettings || !friend.privacySettings.checkedInPrivacy)){
                    // console.log(" \n friend.checkIn.checkInTime :" + friend.checkIn.checkInTime);
                    let obj = {
                        name: user.displayName,
                        text: "Checked in " + (user.checkIn.name ? " at " +  user.checkIn.name : "somewhere"),
                        time: new Date(user.checkIn.checkInTime.seconds * 1000),
                        image: user.photoSource ? {uri:user.photoSource} : {defPhoto},
                        status: false,
                        visited:false,
                        checkedIn:true,
                    }
                    friendFeedData.push(obj);
                }
            }
            if(user.lastVisited){
                let keys = Object.keys(user.lastVisited);
                keys.forEach((key)=>{
                let visited = user.lastVisited[key];
                if(visited.privacy == "Public" || visited.privacy == "Friends" && (!friend.privacySettings || !friend.privacySettings.visitedPrivacy)){
                    // console.log(" \n visited.checkInTime. :" + visited.checkInTime);
                    let obj = {
                        name: user.displayName,
                        text: "Visited " + (visited.name ? visited.name : "somewhere"),
                        time: new Date(visited.checkInTime.seconds * 1000),
                        image: user.photoSource ? {uri:user.photoSource} : {defPhoto},
                        status: false,
                        visited:true,
                        checkedIn:false,
                    }
                    friendFeedData.push(obj);
                }
                })
            }
            
        }
        //if its a business
        if(business){
           if(business.events.length > 0){
               let events = business.events;
               events.forEach((event)=>{

                let obj = {
                    name: business.displayName,
                    text: "Event: " + event.event,
                    time: new Date(event.uploaded.seconds * 1000),
                    image: business.photoSource ? {uri:business.photoSource} : {defPhoto},
                    status: false,
                    visited:false,
                    checkedIn:false,
                    event: true,
                }
                friendFeedData.push(obj);
               })
           }
           if(business.specials.length > 0){
                let specials = business.specials;
                specials.forEach((special)=>{

                let obj = {
                    name: business.displayName,
                    text: "Special: " + special.special,
                    time: new Date(special.uploaded.seconds * 1000),
                    image: business.photoSource ? {uri:business.photoSource} : {defPhoto},
                    status: false,
                    visited:false,
                    checkedIn:false,
                    event: false,
                    specials:true,
                }
                friendFeedData.push(obj);
                })
            }
        }
        friendFeedData = friendFeedData.sort((a, b) => (a.time < b.time) ? 1 : -1 )
        this.setState({feedData:friendFeedData});
        
    }

    onSave = (updated) => {
        this.setState({statusModalVisable:false, snackBarVisable: true});
        if(updated.status){
            this.setState({snackBarText: "status"})
        }
        if(updated.events){
            this.setState({snackBarText: "events"})
        }
        if(updated.specials){
            this.setState({snackBarText: "specials"})
        }
    }
    onDismiss = ()=> {
        this.setState({statusModalVisable:false});
        this.setState({eventModalVisable:false});
        this.setState({specialsModalVisable:false});
    }
    onDismissUpdate = ()=> {
        this.setState({modalVisible:false});
    }
    onDismissSnackBar = () => {
        this.setState({snackBarVisable: false});
    }

    sortFeed = () => {
        
    }

    refresh = (userData, friendData, requests, businessData) =>{
        this.props.refresh(userData, null, null, businessData)
        console.log("refresh hit!!!!!!!!!!!!!!!!!!!!!!!!")
        this.setFriendDataArrays()
        let friendFeedData = this.state.feedData;
        friendFeedData = friendFeedData.sort((a, b) => (a.time < b.time) ? 1 : -1 )
        this.setState({feedData:friendFeedData});
        this.render()
    }

    render() {
        return (
            this.state.feedData ?
 
                <View style={styles.viewDark}>
                    <View style={localStyles.navHeader}>
                            {/* Drawer Button */}
                            <TouchableOpacity onPress={this.props.onDrawerPress} style={localStyles.DrawerOverlay}>
                                <Ionicons style={{paddingHorizontal:2, paddingVertical:0}} name="ios-menu" size={40} color={theme.LIGHT_PINK}/>
                            </TouchableOpacity> 
                            <View style={{width:"100%", textAlign:"center", alignSelf:"center"}}>
                                <Headline style={{color:theme.LIGHT_PINK, paddingLeft:75}}>Your Feed</Headline>
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
                        
                    <ScrollView style={localStyles.ScrollView} contentContainerStyle={{justifyContent:"center", alignItems:"center", width:"98%", paddingBottom:20}}>
                            {
                                this.state.feedData ?
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
                                    <View style={localStyles.feedDataRow}>
                                        <Text style={{color:theme.LIGHT_PINK}}>No data from any of your friends...</Text>
                                    </View>
                            }
                            
                    </ScrollView>
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
            
            
           :
           <View style={styles.viewDark}>
            <ActivityIndicator size="large" color="#eca6c4"></ActivityIndicator>
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
        right:125,
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
      marginTop:40,
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
      }
  });
  