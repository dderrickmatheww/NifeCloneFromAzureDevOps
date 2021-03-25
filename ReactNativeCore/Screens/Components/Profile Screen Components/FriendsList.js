import React from 'react';
import Util from '../../../scripts/Util';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import theme from '../../../Styles/theme';
import { Ionicons } from '@expo/vector-icons'; 
import RequestModal from './Request Modal';
import { 
  Avatar,
} from 'react-native-paper';
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };

class FriendsList extends React.Component {
  
  state = {
    isLoggedin: false,
    userData: this.props.user,
    modalVisible: false,
    friends: null,
    searchQuery: null,
    requests: null,
  }
  
  //gets user and friend data
  setPropData = () => {
    Util.user.CheckLoginStatus((loggedIn) => {
      this.setState({
        friends: this.props.friends,
        requests: this.props.requests,
        userData: this.props.user,
        isLoggedin: loggedIn
      });
    });
  }

  handleOpenModal = () => {
    this.setState({ modalVisible: true });
  }

  componentDidMount() {
    this.setPropData();
  }

  filterRequests = (email, didAccept) => {
    let friends = this.state.friends;
    let requests = this.state.requests;
    let newRequests = [];
    if(didAccept){
      requests.forEach((req)=>{
        if(req.email == email){
          friends.push(req);
        }
        else {
          newRequests.push(req)
        }
      });
    } 
    else {
      requests.forEach((req)=>{
        if(req.email != email){
          newRequests.push(req)
        }
      });
    }
    this.setState({ 
      friends: friends,
      requests: newRequests 
    });
  }

  handleRefresh = () => {
    this.setState({ modalVisible: false });
    this.props.refresh(null, this.state.friends, this.state.requests);
  }

  render() {
    return (
      (this.state.friends != null && this.state.friends != undefined) ?
        <View style={localStyles.loggedInContainer}>
          <View style={localStyles.navHeader}>
              <TouchableOpacity onPress={this.props.onDrawerPress} style={localStyles.drawerBtn}>
                  <Avatar.Image 
                      source={this.state.userData && this.state.userData.photoSource !== 'Unknown' ? {
                          uri:  this.state.userData.photoSource  
                      } : defPhoto}
                      size={35}
                  />
              </TouchableOpacity> 
              {/* Requests button */}
              {
                this.state.requests && this.state.requests.length > 0 ?
                <TouchableOpacity onPress={() => this.handleOpenModal()} style={localStyles.RequestOverlay}>
                  <Ionicons style={{paddingHorizontal:2, paddingVertical:0}} name="ios-notifications" size={20} color={theme.icons.color}/>
                    
                  <Text style={localStyles.Requests}>
                    {this.state.requests.length} Requests
                  </Text>
                </TouchableOpacity> : null
              }
              

            </View>
          <View style={localStyles.HeaderCont}>
            <Image style={localStyles.profilePic} source={ this.state.userData.photoSource ? { uri: this.state.userData.photoSource }  : defPhoto } />
            <Text style={localStyles.Header}>{this.state.userData.displayName}'s Friends</Text>
            <Text style={localStyles.FriendCount}>{(this.state.friends != null ? this.state.friends.length : "0")} Friends</Text>
            <View style={{color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.font, backgroundColor: theme.generalLayout.backgroundColor, borderWitdth: 1, borderColor: theme.generalLayout.secondaryColor, borderRadius:25, marginBottom:2, width:"98%"}}>
              {/* <Searchbar
                  placeholder=""
                  onChangeText={(query) => this.onChangeSearch(query)}
                  value={this.state.searchQuery}
                  inputStyle={{color:theme.LIGHT_PINK}}
                  style={{color:theme.LIGHT_PINK, backgroundColor:theme.DARK, borderWitdth: 1, borderColor:theme.LIGHT_PINK, borderRadius:25, marginBottom:2}}
                  iconColor={theme.LIGHT_PINK}
                />  */}
            </View>
            
          </View>
          <ScrollView style={localStyles.ScrollView}>
            {this.state.friends.map((friend, i) => (
              <TouchableOpacity  key={i} onPress={() => this.props.navigation.navigate('Profile', { screen:"OtherProfile", params: { user:friend, isUserProfile: false }})}>
              <View style={localStyles.friendCont}>
                <Image style={localStyles.friendPic} source={ friend.photoSource  ? { uri:friend.photoSource }  : defPhoto } />
                <Text style={localStyles.name}>{friend.displayName}</Text>
              </View>
            </TouchableOpacity>
            ))}
          </ScrollView>
          <RequestModal filter={this.filterRequests} onDismiss={()=> this.handleRefresh()} isVisible={this.state.modalVisible} requests={this.state.requests}></RequestModal>
        </View>
        :
        <View style={localStyles.loggedInContainer}>
          <View style={localStyles.HeaderCont}>
            <Image style={localStyles.profilePic} source={ this.state.userData.photoSource  ? {uri:this.state.userDataphotoSource}  : defPhoto} />
            <Text style={localStyles.Header}>Your Friends</Text>
            <Text style={localStyles.FriendCount}>Loading Friends...</Text>
          </View>
          <View style={localStyles.loggedInSubView}>
            <ActivityIndicator size="large" color={theme.loadingIcon.color}></ActivityIndicator>
          </View>
          {/* keep this button at the bottom */}
          
        </View>
    )
  }
}

const localStyles = StyleSheet.create({
  RequestOverlay: {
    position:"relative",
    left: 195,
    alignSelf:"flex-end",
    opacity: 0.75,
    backgroundColor: theme.generalLayout.backgroundColor,
    borderRadius: 5,
    marginBottom:7.5,
    borderWidth:1,
    borderColor: theme.generalLayout.secondaryColor,
    justifyContent:"center",
    alignContent:"center",
    padding:3,
    flexDirection:"row"
  },
  navHeader:{
    marginTop:25,
    flexDirection:"row",
    width:"98%",
    maxHeight: "10%",
    // borderBottomColor: theme.LIGHT_PINK,
    // borderBottomWidth: 2,
  },
  loggedInContainer: {
    alignItems: "flex-start",
    flex: 1,
    flexDirection: "column",
    backgroundColor: theme.generalLayout.backgroundColor,
    alignItems: "center",
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
    maxHeight:"15%",
    justifyContent: "flex-end",
    alignItems: "center",
    borderBottomColor: theme.generalLayout.secondaryColor,
    borderBottomWidth: 2,
    paddingBottom: 2
  },
  profilePic: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginBottom: "5%",
  },
  friendPic: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: '20%'
  },
  friendCont: {
    flexDirection: "row",
    borderColor: theme.generalLayout.secondaryColor,
    borderRadius: 50,
    width: '100%',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
    padding: '3%',
    paddingBottom: '5%'

  },
  name: {
    fontSize: 18,
    color: theme.generalLayout.textColor,
    marginVertical: '.5%',
    marginLeft: '5%',
    width: "100%",
    fontFamily: theme.generalLayout.font
  },
  FriendCount: {
    fontSize: 15,
    marginVertical:5,
    color: theme.generalLayout.textColor,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: theme.generalLayout.font
  },
  Requests: {
    fontSize: 15,
    marginTop: "2%",
    marginBottom: "1%",
    color: theme.generalLayout.textColor,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal:2,
    fontFamily: theme.generalLayout.font
  },
  Header: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.generalLayout.textColor,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: theme.generalLayout.font
  },
  ScrollView: {
    flex: 1,
    width: "100%",
    paddingHorizontal: "5%",
    paddingBottom: "1%"
  },
  drawerBtn: {
    marginTop: '8%',
    marginLeft: '3%',
    marginBottom: '3%',
    borderWidth: 1,
    borderColor: theme.generalLayout.secondaryColor,
    borderRadius: 70
  },
});

export default FriendsList;
