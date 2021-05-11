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
import  theme  from '../../../Styles/theme';
import Util from '../../scripts/Util';
import StatusModal from '../Profile/Status Modal';
import { connect } from "react-redux";
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };

class FriendsFeed extends React.Component  {
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
        this.setFriendDataArrays()
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
                        <Headline style={{ color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.fontBold, marginLeft: '5%', marginBottom: '2%'}}>Friend's Feed</Headline>
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
                        <ActivityIndicator size="large" color={theme.loadingIcon.color}></ActivityIndicator>
                    </View>
               }
               {
                   this.state.modalVisable ?
                    <StatusModal
                        isVisible={this.state.modalVisable}
                        user={this.state.userData}
                        refresh={this.refresh}
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
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 10,
        borderWidth: .5,
        borderColor: theme.generalLayout.secondaryColor,
        paddingVertical: 8,
        paddingHorizontal: 8,
        fontFamily: theme.generalLayout.font
    },
    drawerBtn: {
        marginTop: '1%',
        marginLeft: '3%',
        marginBottom: '3%',
        borderRadius: 70
    },
    Caption: {
        color: theme.generalLayout.textColor,
        opacity: 0.60,
        fontFamily: theme.generalLayout.font
    },
    statusButton: {
        color:  theme.generalLayout.textColor,
        fontSize: 11,
        fontFamily: theme.generalLayout.font
    },
    Paragraph:{
        color:  theme.generalLayout.textColor,
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
        fontFamily: theme.generalLayout.font
    },
    feedType:{
        color:  theme.generalLayout.textColor,
        left:60,
        top:-50,
        position:"relative",
        fontSize:12,
        opacity: 0.60,
        fontFamily: theme.generalLayout.font
    },
    feedDataRow:{
        flex:1,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius:10,
        borderWidth:1,
        paddingVertical:5,
        paddingHorizontal:5,
        marginVertical:2,
        width:"100%",
    },
    noFeedData:{
        flex:1,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderColor: theme.generalLayout.secondaryColor,
        width:"100%",
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
    safeAreaContainer: {
        flex: 1,
        paddingTop:"7%",
        backgroundColor: theme.generalLayout.backgroundColor,
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
        paddingBottom: 30,
        paddingTop: 10
    },
    emptyPoppinFeed: {
        color: theme.generalLayout.textColor, 
        fontSize: 16,
        padding: 20,
        textAlign: "center",
        justifyContent: "center",
        fontFamily: theme.generalLayout.font
    },
    viewDark: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center' ,
        backgroundColor: theme.generalLayout.secondaryColor
    },
  });

  function mapStateToProps(state) {
    return {
      user: state.userData,
      friendRequests: state.friendRequests,
      friends: state.friendData,
      business: state.businessData
    }
  }
  
  function mapDispatchToProps(dispatch){
    return {
      refresh: (userData) => dispatch({type:'REFRESH', data:userData})
    }
  }
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(FriendsFeed);
  