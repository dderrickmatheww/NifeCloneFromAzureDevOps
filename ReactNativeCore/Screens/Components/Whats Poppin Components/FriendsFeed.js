import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
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
import Util from '../../../scripts/Util';
import StatusModal from '../Profile Screen Components/Status Modal';
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };

export default class FriendsFeed extends React.Component  {
    state = {
        modalVisable: false,
        userData: null,
        friendData: null,
        feedData: null,
        snackBarVisable:false,
    }
    
    componentDidMount(){
        this.setState({userData: this.props.user});
        this.setState({friendData: this.props.friends});
        this.setFriendDataArrays();
    }

    setFriendDataArrays = () => {
        let friends = this.props.friends;
        let user = this.props.user;
        let friendFeedData = [];
        friends.forEach((friend) =>{
            if(friend.status){
                let obj = {
                    name: friend.displayName,
                    text: friend.status.text,
                    time: new Date(friend.status.timestamp.seconds ? friend.status.timestamp.seconds : friend.status.timestamp._seconds  * 1000),
                    image: friend.photoSource ? {uri:friend.photoSource} : defPhoto,
                    status: true,
                    visited:false,
                    checkedIn:false,
                }
                friendFeedData.push(obj);
            }
            if(friend.checkIn){
                if((friend.checkIn.privacy == "Public" || friend.checkIn.privacy == "Friends") && friend.checkIn.checkInTime &&(!friend.privacySettings || !friend.privacySettings.checkInPrivacy)){
                    let obj = {
                        name: friend.displayName,
                        text: "Checked in " + (friend.checkIn.name ? " at " +  friend.checkIn.name : "somewhere"),
                        time: new Date(friend.checkIn.checkInTime.seconds ? friend.checkIn.checkInTime.seconds: friend.checkIn.checkInTime._seconds * 1000),
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
                        let obj = {
                            name: friend.displayName,
                            text: "Visited " + (visited.name ? visited.name : "somewhere"),
                            time: new Date(visited.checkInTime.seconds ? visited.checkInTime.seconds: visited.checkInTime._seconds * 1000),
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
                        <Headline style={{ color: theme.TEXT_COLOR, marginLeft: '5%', marginBottom: '2%'}}>Friend's Feed</Headline>
                    </View>
                    <TouchableOpacity onPress={()=>this.setState({modalVisable:true})} style={localStyles.StatusOverlay}>
                        <Text style={localStyles.statusButton}>Update Status</Text>
                    </TouchableOpacity> 
                </View>
                
               {
                this.state.feedData ?
                    <ScrollView style={localStyles.ScrollView} contentContainerStyle={{justifyContent:"center", alignItems:"center", width:"98%", paddingBottom:20}}>
                        {
                            this.state.feedData && this.state.feedData.length > 0 ?
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
                                <Text style={localStyles.emptyPoppinFeed}>Nothing to show here, add some friends if you haven't already!</Text>
                                
                        }
                    </ScrollView> 
                :
                    <View style={localStyles.viewDark}>
                        <ActivityIndicator size="large" color={theme.GOLD}></ActivityIndicator>
                    </View>
               }
               {
                   this.state.modalVisable ?
                    <StatusModal
                        isVisible={this.state.modalVisable}
                        user={this.state.userData}
                        refresh={this.refresh()}
                        onDismiss={() => this.onDismiss()}
                        onSave={()=> this.onSave()}
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
                >
                    Updated your status!
                </Snackbar>
           </View> 
           
        )
    }
}
const localStyles = StyleSheet.create({
    StatusOverlay: {
        position:"relative",
        right: 150,
        backgroundColor: theme.DARK,
        borderRadius: 10,
        borderWidth: .5,
        borderColor: theme.TEXT_COLOR,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 8
    },
    drawerBtn: {
        marginTop: '1%',
        marginLeft: '3%',
        marginBottom: '3%',
        borderRadius: 70
    },
    Caption: {
        color:theme.LIGHT_PINK,
        opacity: 0.60
    },
    statusButton: {
        color: theme.TEXT_COLOR,
        fontSize: 11,
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
        marginVertical:2,
        width:"100%",
    },
    noFeedData:{
        flex:1,
        backgroundColor:theme.DARK,
        borderColor:theme.LIGHT_PINK,
        width:"100%",
    },
    navHeader: {
        marginTop: 12.5,
        flexDirection:"row",
        borderBottomColor: theme.LIGHT_PINK,
        borderBottomWidth:1,
        width:"98%",
        textAlign:"center",
        alignItems:"center",
    },
    safeAreaContainer: {
        flex: 1,
        paddingTop:"7%",
        backgroundColor: theme.DARK,
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
    },
    emptyPoppinFeed: {
        color: theme.TEXT_COLOR, 
        fontSize: 16,
        padding: 20,
        textAlign: "center",
        justifyContent: "center"
    },
    viewDark: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center' ,
        backgroundColor: theme.DARK
    },
  });
  