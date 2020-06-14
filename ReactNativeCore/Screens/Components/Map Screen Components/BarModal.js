import React  from "react";
import {
  TouchableHighlight,
    Modal,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';
import { TouchableOpacity } from "react-native-gesture-handler";
import Util from '../../../scripts/Util';
import * as firebase from 'firebase';

class BarModal extends React.Component  {
    state = {
      isVisible: false,
      isLoggedin: firebase.auth().currentUser ? true : false,
      userData: firebase.auth().currentUser ? firebase.auth().currentUser : null,
      checkedIn: ""
    };

    closeModal = () => {
        this.setState({isVisible: false});
        console.log('test')
    }

    async componentDidMount() {
      await this.IsUserCheckedInLocal();
    }
    
    IsUserCheckedInLocal = async () => {
      if(this.state.userData) {
        Util.user.IsUserCheckedIn(this.state.userData.email, this.props.buisnessUID, (boolean) => {
          this.setState({ 
            checkedIn: boolean
          });
        });
      }
      else {
        return;
      }
    }

    render(){     
        return(         
            <Modal 
              animationType="slide"
              visible={this.props.isVisible}
              transparent={true}
            >
            <View style={localStyles.centeredView}>
              <View style={localStyles.modalView}>
                <TouchableHighlight  style={localStyles.closeButton}
                    onPress={this.props.onPress}
                  >
                  <Ionicons name="ios-close" size={32} color="#E2E4E3"/>
                </TouchableHighlight>
                <View style={localStyles.titleCont}>
                    <Text style={localStyles.modalTitle}>{this.props.barName}</Text>
                  </View>
                <View style={localStyles.imgCont}>
                      <ImageBackground source={this.props.source} style={localStyles.modalImage}/>
                </View>
                <View  style={localStyles.textCont}>
                  <View  style={localStyles.descCont}>
                    <Rating 
                      ratingBackgroundColor="#BEB2C8"
                      startingValue={this.props.rating}
                      showRating={false}
                      readonly={true}
                      imageSize={20}
                      type="custom"
                      style={localStyles.rating}
                    />
                    <Text style={localStyles.ratingText}> in {this.props.reviewCount} reviews.</Text> 
                  </View>
                  <View  style={localStyles.descCont}>
                    <Text style={localStyles.modalText}>Price: {this.props.price}</Text>
                  </View>
                  <View style={localStyles.descCont}>
                    <Text style={localStyles.modalText}>Number: {this.props.phone} </Text>
                  </View>
                  <View style={localStyles.descCont}>
                    <Text style={localStyles.modalText}>Closed: {this.props.closed == true ? "Yes" : "No"}</Text>
                  </View>
                  <View style={localStyles.descCont}>
                    <Text style={localStyles.modalText}>{this.props.address} </Text>
                  </View>
                  {/* <View style={localStyles.descCont}>
                    <TouchableOpacity></TouchableOpacity>
                  </View> */}
                </View>
                {
                this.state.isLoggedin ? 
                  this.state.userData ? 
                    !this.state.checkedIn == "" ?
                      this.state.checkedIn == 'true' ?
                        <View> 
                          <TouchableOpacity
                            onPress={() => { 
                              Util.asyncStorage.GetAsyncStorageVar("User", (userData) => {
                                let user = JSON.parse(userData);
                                Util.user.CheckOut(user.email, (boolean) => {
                                  this.setState({
                                    checkedIn: boolean
                                  });
                                });
                              })
                            }}
                            style={localStyles.descCont}
                          >
                            <Text style={localStyles.modalText}>Check out</Text>
                          </TouchableOpacity>
                        </View>
                        :
                        <View>
                          <TouchableOpacity
                            onPress={() => { 
                              let email = this.state.userData.email;
                              let buisnessUID = this.props.buisnessUID;
                              Util.user.CheckIn(buisnessUID, email, "Public", (boolean) => {
                                this.setState({
                                  checkedIn: boolean
                                });
                              });
                            }}
                            style={localStyles.descCont}
                          >
                            <Text style={localStyles.modalText}>Check in publicly</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              let email = this.state.userData.email;
                              let buisnessUID = this.props.buisnessUID;
                              Util.user.CheckIn(buisnessUID, email, "Friends Only", (boolean) => {
                                this.setState({
                                  checkedIn: boolean
                                });
                              });
                            }}
                            style={localStyles.descCont}
                          >
                            <Text style={localStyles.modalText}>Check in with just friends</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              let email = this.state.userData.email;
                              let buisnessUID = this.props.buisnessUID;
                              Util.user.CheckIn(buisnessUID, email, "Private", (boolean) => {
                                this.setState({
                                  checkedIn: boolean
                                });
                              });
                            }}
                            style={localStyles.descCont}
                          >
                            <Text style={localStyles.modalText}>Check in privatly</Text>
                          </TouchableOpacity>
                        </View> 
                        :
                        <View style={localStyles.activityIndicator}>
                            <ActivityIndicator 
                                size={'large'}
                                color={'#ff1493'}
                            />
                      </View>
                    :
                    <View>

                    </View>
                  : null
                }
              </View>
            </View>
        </Modal>
            
        )
    }
}

const localStyles = StyleSheet.create({
  
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
  
  export default BarModal;