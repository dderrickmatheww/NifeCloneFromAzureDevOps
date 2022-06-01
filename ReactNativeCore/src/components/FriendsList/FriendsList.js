import React from 'react';
import Util from '../../utils/util'
import theme from '../../../src/styles/theme';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
// import RequestModal from './Request Modal';
import { 
  Avatar,
} from 'react-native-paper';
import { connect } from "react-redux";
import DrawerButton from "../Drawer/DrawerButton";
import {getUserFriendsPaginated} from "../../utils/api/friends";
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };

class FriendsList extends React.Component {
  
  state = {
    isLoggedin: false,
    modalVisible: false,
    friends: null,
    searchQuery: null,
    requests: null,
    loading: false,
  }


  handleOpenModal = () => {
    this.setState({ modalVisible: true });
  }

  handleRequests = (friendsData) => {

  }

  async componentDidMount() {
    this.setState({loading: true})
    const friends = await getUserFriendsPaginated({
      userId: this.props.userData.id,
      skip: 0,
      take: 50,
    })
    this.setState({friends, loading: false})
  }


  closeModal = () => {
    this.setState({ modalVisible: false });

  }

  render() {
    return (
      this.state.friends && !this.state.loading ?
        <View style={localStyles.loggedInContainer}>
          <View style={localStyles.navHeader}>
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
            <Image style={localStyles.profilePic} source={ this.props.userData.photoSource ? { uri: this.props.userData.photoSource }  : defPhoto } />
            <Text style={localStyles.Header}>{this.props.userData.displayName}'s Friends</Text>
            <Text style={localStyles.FriendCount}>{this.state.friends.length} Friends</Text>
            <View style={{color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.font, backgroundColor: theme.generalLayout.backgroundColor, borderWitdth: 1, borderColor: theme.generalLayout.secondaryColor, borderRadius:25, marginBottom:2, width:"98%"}}>
            </View>
            
          </View>
          <ScrollView style={localStyles.ScrollView}>
            {this.state.friends.map((friend, i) => (
              <TouchableOpacity  key={i} onPress={() => this.props.navigation.navigate('Profile', { screen:"OtherProfile", params: {
                email: friend.email,
                  openDrawer: () => {}
              }})}
              >
              <View style={localStyles.friendCont}>
                <Image style={localStyles.friendPic} source={ friend.photoSource  ? { uri:friend.photoSource }  : defPhoto } />
                <Text style={localStyles.name}>{friend.displayName}</Text>
              </View>
            </TouchableOpacity>
            ))}
          </ScrollView>
          {/*<RequestModal onDismiss={this.closeModal} isVisible={this.state.modalVisible} ></RequestModal>*/}
        </View>
        :
        <View style={localStyles.loggedInContainer}>
          <View style={localStyles.HeaderCont}>
            <Image style={localStyles.profilePic} source={ this.props.userData.photoSource  ? {uri:this.props.userData.photoSource }  : defPhoto} />
            <Text style={localStyles.Header}>Your Friends</Text>
            <Text style={localStyles.FriendCount}>Loading Friends...</Text>
          </View>
          <View style={localStyles.loggedInSubView}>
            <ActivityIndicator size="large" color={theme.loadingIcon.color}/>
          </View>
          {/* keep this button at the bottom */}

        </View>
    )
  }
}

function mapStateToProps(state){
  return{
    userData: state.userData,
  }
}

function mapDispatchToProps(dispatch){
  return {
    refresh: (userData) => dispatch({type:'REFRESH', data:userData})
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(FriendsList);


const localStyles = StyleSheet.create({
  RequestOverlay: {
    ...Platform.select({
      ios:{
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
      android:{
        position:"relative",
        left: 175,
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
      }
    })

  },
  navHeader:{
    marginTop:55,
    flexDirection:"row",
    width:"98%",
    maxHeight: "10%",
    // borderBottomColor: theme.LIGHT_PINK,
    // borderBottomWidth: 2,
  },
  loggedInContainer: {
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
    maxHeight:"12%",
    justifyContent: "flex-end",
    alignItems: "center",
    borderBottomColor: theme.generalLayout.secondaryColor,
    borderBottomWidth: 2,
    marginTop:50
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
    marginLeft: 15
  },
  friendCont: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: theme.generalLayout.backgroundColor,
    borderColor: theme.generalLayout.secondaryColor,
    color: theme.generalLayout.textColor,
    borderRadius: 10,
    borderWidth: .5,
    marginVertical: 5,
    paddingVertical: 10,
    width: "100%",
    height: '100%'
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
    marginTop: '1%',
    marginLeft: '3%',
    marginBottom: '3%',
    borderRadius: 70,
  },
});
