import React from 'react';
import { View, TouchableOpacity, Image, Modal, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { 
    Text, 
    Headline,
    Avatar,
    Caption,
    Paragraph,
    Snackbar
} from 'react-native-paper';
import { styles } from '../../../Styles/style';
import  theme  from '../../../Styles/theme';
import { Ionicons } from '@expo/vector-icons'; 
import Util from '../../../scripts/Util';
import StatusModal from '../Profile Screen Components/Status Modal';

var defPhoto = require('../../../Media/Images/logoicon.png')
export default class FriendsFeed extends React.Component  {
    state = {
        modalVisable: false,
        userData:null,
        friendData:null,
        feedData: null,
        snackBarVisable:false,
    }
    
    componentDidMount(){
        this.setState({userData:this.props.user});
        this.setState({friendData:this.props.friends});
        this.setFriendDataArrays();
        console.log("friendData: " + JSON.stringify(this.props.friends));
    }

    setFriendDataArrays = () => {
        let friends = this.props.friends;
        let user = this.props.user;
        let friendFeedData = [];
        friends.forEach((friend) =>{
            if(friend.status){
                console.log(" \n friend.status.timestamp :" + friend.status.timestamp);
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
                if((friend.checkIn.privacy == "Public" || friend.checkIn.privacy == "Friends") && friend.checkIn.checkInTime){
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
                    if(visited.privacy == "Public" || visited.privacy == "Friends"){
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
        
        
        friendFeedData = friendFeedData.sort((a, b) => (a.time < b.time) ? 1 : -1 )
        this.setState({feedData:friendFeedData});
    }

    onSave = () => {
        this.setState({modalVisable:false});
        this.setState({snackBarVisable: true});
        
    }
    onDismiss = ()=> {
        this.setState({modalVisable:false});
    }
    onDismissSnackBar = () => {
        this.setState({snackBarVisable: false});
    }

    refresh = (userData, friendData, requests) =>{
        this.props.refresh(userData, null, null)
        setFriendDataArrays()
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
                        <Headline style={{color:theme.LIGHT_PINK, paddingLeft:75}}>Friend's Feed</Headline>
                    </View>
                    <TouchableOpacity onPress={()=>this.setState({modalVisable:true})} style={localStyles.StatusOverlay}>
                        <Text style={localStyles.statusButton}>Update Status</Text>
                    </TouchableOpacity> 
                </View>
                
               <ScrollView style={localStyles.ScrollView} contentContainerStyle={{justifyContent:"center", alignItems:"center", width:"98%"}}>
                    {
                        this.state.feedData ?
                            this.state.feedData.map((data, i)=>(
                                <View key={i} style={localStyles.feedDataRow}>
                                    <Avatar.Image source={data.image} size={50}/>
                                    <Text style={localStyles.displayName}>{data.name}</Text>
                                    <Caption style={localStyles.feedType}>{data.visited ?"took a visit" : data.checkedIn ? "checked in" : "status update"}</Caption>
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
                   this.state.modalVisable ?
                  <StatusModal
                    isVisible={this.state.modalVisable}
                    user={this.state.userData}
                    onDismiss={()=>this.onDismiss()}
                    onSave={()=>this.onSave()}
                    refresh={this.refresh}
                  >
                  </StatusModal> 
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
                    Updated your status!
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
        paddingHorizontal:5
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
        paddingVertical:5,
        paddingHorizontal:5,
        marginVertical:5,
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
        paddingBottom: 30,
        paddingTop: 10
      }
  });
  