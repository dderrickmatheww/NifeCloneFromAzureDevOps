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
import Util from '../../../scripts/Util';
import * as firebase from 'firebase';
import {Modal, Text, Subheading} from 'react-native-paper';
import theme from '../../../Styles/theme';
import { styles } from '../../../Styles/style';

var defPhoto = require('../../../Media/Images/logoicon.png');
class RequestModal extends React.Component  {
    state = {
      requests: null,
      requestLoading:false,
    };


    async componentDidMount() {
      this.setState({requests:this.props.requests});
    }

    handleAccept = (friendEmail) => {
      this.setState({requestLoading:true});
      Util.friends.AcceptFriendRequest(firebase.firestore(), firebase.auth().currentUser.email, friendEmail, () =>{
        this.updateRequestList(friendEmail, ()=>{
          this.setState({requestLoading:false});
        });
      });
    }

    handleDeny = (friendEmail) => {
      this.setState({requestLoading:true});
      Util.friends.RemoveFriend(firebase.firestore(), firebase.auth().currentUser.email, friendEmail, () =>{
        this.updateRequestList(friendEmail, ()=>{
          this.setState({requestLoading:false});
        });
      });
    }
    
    updateRequestList = (friendEmail, callback) => {
      let requests = this.state.requests;
      let cleanedRequests = []
      requests.forEach((request, i)=>{
        if(friendEmail != request.email){
          cleanedRequests.push(request);
        }
      });
      this.setState({requests:cleanedRequests});
      callback();
    }

    render(){     
        return(         
            <Modal 
              contentContainerStyle={{width:"90%", height:"75%", borderRadius:50, alignSelf:"center"}}
              visible={this.props.isVisible}
              dismissable={true}
              onDismiss={this.props.onDismiss}
            >
              {
                this.state.requests ? 
                <View style={styles.viewDark}>
                  <View style={{justifyContent:"center", alignItems:"center", marginBottom:15, borderBottomColor:theme.LIGHT_PINK, borderBottomWidth:1}}>
                    <Subheading style={{color:theme.LIGHT_PINK}}>Your Friend Requests</Subheading>
                  </View>
                  <ScrollView  contentContainerStyle={{paddingTop:20, paddingBottom:25, justifyContent:"center", alignItems:"center"}}>
                    {this.state.requests.map((friend, i) => (
                        <View key={i} style={localStyles.friendCont}>
                          
                            <Image style={localStyles.friendPic} source={ friend.photoSource  ? {uri:friend.photoSource}  : defPhoto} />
                            <Text style={localStyles.name}>{friend.displayName}</Text>
                          
                          <View style={{ flexDirection:"row"}}>
                            <TouchableOpacity style={localStyles.DenyFriendOverlay}
                              onPress={!this.state.requestLoading ? ()=> this.handleDeny(friend.email) : null}
                            >
                              { this.state.requestLoading ?
                                <ActivityIndicator size="large" color={theme.LIGHT_PINK}></ActivityIndicator>
                                :
                                <View style={{flexDirection:"row"}}>
                                  <Ionicons name="ios-close" size={30} color={theme.LIGHT_PINK}></Ionicons>
                                    <Text style={localStyles.buttonText}>
                                      
                                      Deny 
                                    </Text>
                                </View>
                                
                              }
                            </TouchableOpacity>
                            <TouchableOpacity style={localStyles.AddFriendOverlay}
                              onPress={!this.state.requestLoading ? ()=> this.handleAccept(friend.email) : null}
                            >
                            { this.state.requestLoading ?
                                <ActivityIndicator size="large" color={theme.LIGHT_PINK}></ActivityIndicator>
                                :
                                <View style={{flexDirection:"row"}}>
                                  <Ionicons name="ios-checkmark" size={30} color={theme.LIGHT_PINK}></Ionicons>
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
                    <ActivityIndicator size="large" color={theme.LIGHT_PINK}></ActivityIndicator>
                </View> 
              }

            </Modal>
            
        )
    }
}

const localStyles = StyleSheet.create({
  buttonText:{
    color:theme.LIGHT_PINK,
    alignSelf:"center",
    paddingHorizontal:5,
  },
  AddFriendOverlay: {
    flexDirection:"row",
    alignSelf:"flex-start",
    justifyContent:"center",
    backgroundColor: theme.DARK,
    borderRadius: 5,
    borderWidth:1,
    borderColor: theme.LIGHT_PINK,
    paddingHorizontal: 4,
    right:-50,
  },
  DenyFriendOverlay: {
    flexDirection:"row",
    alignSelf:"flex-end",
    justifyContent:"center",
    backgroundColor: theme.DARK,
    borderRadius: 5,
    borderWidth:1,
    borderColor: theme.LIGHT_PINK,
    paddingHorizontal: 4,
    left:-50,
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
    borderColor: theme.LIGHT_PINK,
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
    color: theme.LIGHT_PINK,
    marginVertical: '.5%',
    width: "100%",
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
    backgroundColor: '#20232a'
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
    backgroundColor: "#20232a",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ff1493",
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
    backgroundColor: '#5D5E60',
    alignItems: 'center',
    justifyContent: 'center',
    
    borderColor:"#5D5E60",
    borderWidth: 10,
    borderRadius: 20,
    width:'100%',
  },
  modalImage:{
    width: '100%',
    height: '100%',
    borderColor:"#BEB2C8",
    borderWidth: 10,
    borderRadius: 20,
  },
  textCont:{
    margin:"10%",
    width:"100%",
    backgroundColor: "#5D5E60",
    borderRadius:20,
  },
  descCont: {
    borderRadius: 20,
    borderColor: "black",
    borderWidth: 1,
    backgroundColor:"#BEB2C8",
    margin:"1%",
  },
  modalText:{
    color: "#20232a",
    padding: 5,
    marginLeft:"1%",
    fontWeight:"bold",
  },

  titleCont: {
    backgroundColor:"#5D5E60",
    width: '100%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    top: "-7.5%"
  },
  modalTitle:{
    color: "#20232a",
    padding: 5,
    fontSize:24,
    borderRadius: 20,
    textAlign:"center",
    fontWeight:'bold',
    backgroundColor:"#BEB2C8",
    marginVertical:"2%",
    width:"90%",

  },
  ratingText:{
    color: "#20232a",
    padding: 5,
    fontWeight:"bold",
    textAlign:"center"
  },
  rating:{
    marginTop:"2%",
    marginBottom:"1%",
  }

});
  
  export default RequestModal;