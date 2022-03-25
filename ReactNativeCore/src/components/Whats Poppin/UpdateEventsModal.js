import React  from "react";
import {
    StyleSheet,
    View,
    ActivityIndicator, Platform
} from "react-native";
import Util from '../../scripts/Util';
import { Modal, Button, TextInput, Text } from 'react-native-paper';
import theme from '../../../src/styles/theme';
import { connect } from "react-redux";

//TODO use clipboard component here
// combine events and specials into one component

class EventsModal extends React.Component  {
    state = {
      eventText: null,
      userData: null,
      saving: false,
    };

    async componentDidMount() {
      this.setState({userData: this.props.user});
      this.setState({business: this.props.business});
      this.setState({events: this.props.business.events});
      let events = this.props.business.events;
      let text = "";
      events.forEach((event, i)=>{
        if(i != events.length - 1){
          text += event.text + " & "
        }
        else {
          text += event.text
        }
      });
      this.setState({eventText:text})
    }

    onEventChange = (text) => {
      this.setState({eventText: text});
    }
    
    onSaveStatus = () => {
      let eventText = this.state.eventText;
      let user = this.state.userData
      if(eventText){
        this.setState({saving:true});
        let eventArray = eventText.split("&")
        let obj = {events:[]}
        eventArray.forEach((event)=>{
          obj.events.push({
            text: event,
            uploaded: new Date()
          })
        })
        let business = this.state.business;
        Util.business.UpdateUser(user.email, obj, ()=>{
          this.updateUserAsync(business, obj);
          this.setState({saving:false});
          this.props.onSave();
          this.props.onDismiss();
        });
      }
      else{
        Util.basicUtil.alert('Nife Error Message', 'Please enter events if you wish to update them!');
      }
    }

    updateUserAsync = (business, obj) => {
        let user = this.props.user;
        business['events']= obj.events;
        user.businessData = business;
        this.props.refresh(user);
    }

    render(){     
        return(         
            <Modal 
              contentContainerStyle={{width:"90%", height:"60%", borderRadius:50, alignSelf:"center"}}
              visible={this.props.isVisible}
              dismissable={true}
              onDismiss={() => this.props.onDismiss()}
              theme={{colors:{placeholder: theme.generalLayout.textColor}}}
            >
              
                <View style={localStyles.viewDark}>
                  <TextInput
                    mode={"outlined"}
                    label=""
                    placeholder={Platform.select({
                        ios: 'Type here...',
                        android: ''
                    })}
                    placeholderTextColor={Platform.select({
                        ios: 'white',
                        android: 'black'
                    })}
                    placeholder={"What events do you have coming up? ( Ex: July 4th - BeerFest &  July 10th - Live Music! )"}
                    onChangeText={text => this.onEventChange(text)}
                    style={localStyles.textInput}
                    value={this.state.eventText}
                    multiline={true}
                    > 
                  </TextInput>
                  <Text style={{color:theme.generalLayout.textColor, fontFamily: theme.generalLayout.font, alignSelf:"center", marginBottom:10}}>Seperate events with '&'{"\n"} ( Ex: July 4th - BeerFest & {"\n"} July 10th - Live Music! )</Text>
                  {
                    this.state.saving ?
                    <ActivityIndicator style={{marginVertical:5}} color={theme.loadingIcon.color} size="large" />
                    :
                    <Button 
                      labelStyle={{color:theme.generalLayout.textColor, fontFamily: theme.generalLayout.font}} 
                      style={localStyles.button} 
                      icon={"check"}
                      mode="contained" 
                      onPress={() => this.onSaveStatus()}
                    >
                      <Text style={{color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.font}}>Update Events</Text>
                    </Button>
                  }
                  
                </View> 
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.userData,
        friendRequests: state.friendRequests,
        friends: state.friendData,
        business: state.businessData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refresh: (userData) => dispatch({type: 'REFRESH', data: userData})
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(EventsModal);

export const eventsSpecialsStyles = StyleSheet.create({
    textInput: {
        flex: 1,
        ...Platform.select({
            ios: {
                backgroundColor: 'white',
                color: theme.generalLayout.textColor,
            },
            android: {
                backgroundColor: 'white',
                color: 'black',
            }
        }),
        width: "90%",
        height: "80%",
        alignSelf: "center",
        borderRadius: 5,
        marginTop: 5,
        fontFamily: theme.generalLayout.font,
        borderColor: theme.generalLayout.backgroundColor
    },
  buttonText:{
    color: theme.generalLayout.textColor,
    alignSelf:"center",
    paddingHorizontal:5,
    fontFamily: theme.generalLayout.font
  },
  button:{
    borderColor: theme.generalLayout.secondaryColor,
    borderRadius:10,
    borderWidth:1,
    width:"80%",
    marginBottom:10
  },

  viewDark:{
    flex:1,
    backgroundColor: theme.generalLayout.backgroundColor,
    flexDirection:"column",
    justifyContent:"center",
    alignContent:"center",
    alignItems:"center"
  }
});
const localStyles = eventsSpecialsStyles;
  
