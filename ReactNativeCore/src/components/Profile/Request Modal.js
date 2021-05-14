import React  from "react";
import {
    TouchableOpacity,
    StyleSheet,
    View,
    ActivityIndicator,
    ScrollView,
    Image
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Util from '../../scripts/Util';
import { Modal, Text, Subheading } from 'react-native-paper';
import theme from '../../../Styles/theme';
import { styles } from '../../../Styles/style';
import {connect} from "react-redux";
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };

class RequestModal extends React.Component  {
    state = {
      requests: this.props.requests,
      requestLoading: false,
    };
  handleRequest = (friendEmail, answer) => {
      this.setState({ requestLoading: true });
      Util.friends.handleFriendRequest(friendEmail, answer, () => {
        Util.user.GetUserData(this.props.user.email, (userData) =>{
          this.props.refresh(userData);
          this.setState({ requestLoading: false });
        })
      });

    }

    render(){     
        return(         
            <Modal 
              contentContainerStyle={{width:"90%", height:"75%", borderRadius:50, alignSelf:"center"}}
              visible={this.props.requests.length > 0 ? this.props.isVisible : this.props.requests.length > 0}
              dismissable={true}
              onDismiss={this.props.onDismiss}
            >
              {
                this.props.requests ?
                <View style={styles.viewDark}>
                  <View style={{justifyContent:"center", alignItems:"center", marginBottom:15, borderBottomColor:theme.LIGHT_PINK, borderBottomWidth:1}}>
                    <Subheading style={{color:theme.generalLayout.textColor, fontFamily: theme.generalLayout.font}}>Your Friend Requests</Subheading>
                  </View>
                  <ScrollView  contentContainerStyle={{paddingTop:20, paddingBottom:25, justifyContent:"center", alignItems:"center"}}>
                    {this.props.requests.map((friend, i) => (
                        <View key={i} style={localStyles.friendCont}>
                          
                            <Image style={localStyles.friendPic} source={ friend.photoSource  ? {uri:friend.photoSource}  : defPhoto} />
                            <Text style={localStyles.name}>{friend.displayName}</Text>
                          
                          <View style={{ flexDirection:"row", marginVertical:5}}>
                            <TouchableOpacity style={localStyles.DenyFriendOverlay}
                              onPress={!this.state.requestLoading ? () => this.handleRequest(friend.email, false) : null}
                            >
                              { this.state.requestLoading ?
                                <ActivityIndicator size="large" color={theme.loadingIcon.color}></ActivityIndicator>
                                :
                                <View style={{flexDirection:"row"}}>
                                  <Ionicons name="ios-close" size={25} color={theme.icons.color}></Ionicons>
                                    <Text style={localStyles.buttonText}>
                                      Deny 
                                    </Text>
                                </View>
                                
                              }
                            </TouchableOpacity>
                            <TouchableOpacity style={localStyles.AddFriendOverlay}
                              onPress={!this.state.requestLoading ? ()=> this.handleRequest(friend.email, true) : null}
                            >
                            { this.state.requestLoading ?
                                <ActivityIndicator size="large" color={theme.loadingIcon.color}></ActivityIndicator>
                                :
                                <View style={{flexDirection:"row"}}>
                                  <Ionicons name="ios-checkmark" size={25} color={theme.icons.color}></Ionicons>
                                  <Text style={localStyles.buttonText}>
                                    Accept
                                  </Text>
                                </View>
                              }
                            </TouchableOpacity>
                          </View>  
                        </View>
                    ))}
                  </ScrollView>
                </View> 
                :
                <View style={styles.viewDark}>
                    <ActivityIndicator size="large" color={theme.loadingIcon.color}></ActivityIndicator>
                </View> 
              }
            </Modal>
        )
    }
}

const localStyles = StyleSheet.create({
  buttonText:{
    fontSize:14,
    color:theme.generalLayout.textColor,
    alignSelf:"center",
    paddingHorizontal:5,
    fontFamily: theme.generalLayout.font
  },
  AddFriendOverlay: {
    flexDirection:"row",
    alignSelf:"flex-start",
    justifyContent:"center",
    backgroundColor: theme.generalLayout.backgroundColor,
    borderRadius: 5,
    borderWidth:1,
    borderColor: theme.generalLayout.secondaryColor,
    paddingHorizontal: 4,
    right:-25,
  },
  DenyFriendOverlay: {
    flexDirection:"row",
    alignSelf:"flex-end",
    justifyContent:"center",
    backgroundColor: theme.generalLayout.backgroundColor,
    borderRadius: 5,
    borderWidth:1,
    borderColor: theme.generalLayout.secondaryColor,
    paddingHorizontal: 4,
    left:-25,
  },
  friendPic: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  friendCont: {
    width:"90%",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    borderColor: theme.generalLayout.secondaryColor,
    borderWidth: 1,
    paddingHorizontal:50,
    paddingVertical:5,
    flexWrap:"wrap",
    borderRadius:5,
    marginVertical:5
  },
  name: {
    fontSize: 18,
    textAlign:"center",
    color: theme.generalLayout.textColor,
    marginVertical: '.5%',
    width: "100%",
    fontFamily: theme.generalLayout.font
  },
  closeButton:{
    left: "55%",
    top: "-7.5%",
  }, 
  activityIndicator: {
    top: '15%',
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center' ,
    backgroundColor: theme.generalLayout.backgroundColor
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width:"90%",
    height:"80%",
    marginBottom:"15%",
    marginTop:"20%",
    marginHorizontal: "2.5%",
    backgroundColor: theme.generalLayout.backgroundColor,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.generalLayout.secondaryColor,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex:1,
  },


  imgCont: {
    flex: 1,
    backgroundColor: theme.generalLayout.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: theme.generalLayout.secondaryColor,
    borderWidth: 10,
    borderRadius: 20,
    width:'100%',
  },
  modalImage:{
    width: '100%',
    height: '100%',
    borderColor: theme.generalLayout.secondaryColor,
    borderWidth: 10,
    borderRadius: 20,
  },
  textCont:{
    margin:"10%",
    width:"100%",
    backgroundColor: theme.generalLayout.secondaryColor,
    borderRadius:20,
  },
  descCont: {
    borderRadius: 20,
    borderColor: theme.generalLayout.secondaryColor,
    borderWidth: 1,
    backgroundColor: theme.generalLayout.backgroundColor,
    margin:"1%",
  },
  modalText:{
    color: theme.generalLayout.textColor,
    padding: 5,
    marginLeft:"1%",
    fontWeight:"bold",
    fontFamily: theme.generalLayout.font
  },

  titleCont: {
    backgroundColor: theme.generalLayout.backgroundColor,
    width: '100%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    top: "-7.5%"
  },
  modalTitle:{
    color: theme.generalLayout.textColor,
    padding: 5,
    fontSize:24,
    borderRadius: 20,
    textAlign:"center",
    fontWeight:'bold',
    backgroundColor: theme.generalLayout.secondaryColor,
    marginVertical:"2%",
    width:"90%",
    fontFamily: theme.generalLayout.font
  },
  ratingText:{
    color: theme.generalLayout.textColor,
    padding: 5,
    fontWeight:"bold",
    textAlign:"center",
    fontFamily: theme.generalLayout.font
  },
  rating:{
    marginTop:"2%",
    marginBottom:"1%",
  }
});

function mapStateToProps(state){
  return{
    requests: state.friendRequests,
    user: state.userData,
  }
}

function mapDispatchToProps(dispatch){
  return {
    refresh: (userData) => dispatch({type:'REFRESH', data:userData})
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(RequestModal);
