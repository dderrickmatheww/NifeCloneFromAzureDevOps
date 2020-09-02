import React  from "react";
import {
    StyleSheet,
    View,
    ActivityIndicator
} from "react-native";
import Util from '../../../scripts/Util';
import * as firebase from 'firebase';
import {Modal, Button, TextInput, Text} from 'react-native-paper';
import theme from '../../../Styles/theme';
import { styles } from '../../../Styles/style';
import { event } from "react-native-reanimated";

export default class StatusModal extends React.Component  {
    state = {
      eventText: null,
      userData:null,
      saving:false,
    };


    async componentDidMount() {
      this.setState({userData:this.props.user});
      this.setState({business:this.props.business});
      this.setState({events:this.props.business.events});

      let events = this.props.business.events;
      let text = ""
      events.forEach((event, i)=>{
        if(i != events.length - 1){
          text += event.event + " & "
        }
        else {
          text += event.event
        }
        
      })
      this.setState({eventText:text})
    }

    onEventChange = (text) => {
      // console.log(text);
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
            event: event,
            uploaded: new Date()
          })
        })
        let business = this.state.business;
        Util.business.UpdateUser(firebase.firestore(), user.email, obj, ()=>{
          console.log('Updating events');
          
         
          this.updateUserAsync(business, obj);
          this.setState({saving:false});
          this.props.onSave();
          this.props.onDismiss()
        });
      }
      else{
        alert('Please enter events if you wish to update them')
      }
    }

    updateUserAsync = (business, obj) => {
      business['events']= obj.events;
      this.props.refresh(null, null, null, business);
      
    }

    render(){     
        return(         
            <Modal 
              contentContainerStyle={{width:"90%", height:"60%", borderRadius:50, alignSelf:"center"}}
              visible={this.props.isVisible}
              dismissable={true}
              onDismiss={() => this.props.onDismiss()}
              theme={{colors:{placeholder:theme.LIGHT_GREY}}}
            >
              
                <View style={localStyles.viewDark}>
                  <TextInput
                    mode={"outlined"}
                    label=""
                    placeholder={"What events do you have coming up? ( Ex: July 4th - BeerFest &  July 10th - Live Music! )"}
                    onChangeText={text => this.onEventChange(text)}
                    style={localStyles.textInput}
                    value={this.state.eventText}
                    multiline={true}
                    > 
                  </TextInput>
                  <Text style={{color:theme.LIGHT_PINK, alignSelf:"center", marginBottom:10}}>Seperate events with '&'{"\n"} ( Ex: July 4th - BeerFest & {"\n"} July 10th - Live Music! )</Text>
                  {
                    this.state.saving ?
                    <ActivityIndicator style={{marginVertical:5}} color={theme.LIGHT_PINK} size="large" />
                    :
                    <Button 
                      labelStyle={{color:theme.LIGHT_PINK}} 
                      style={localStyles.button} 
                      icon={"check"}
                      mode="contained" 
                      onPress={() => this.onSaveStatus()}
                    >
                      <Text style={{color:theme.LIGHT_PINK}}>Update Events</Text>
                    </Button>
                  }
                  
                </View> 
                

            </Modal>
            
        )
    }
}


const localStyles = StyleSheet.create({
  textInput:{
    flex:1,
    backgroundColor:theme.LIGHT,
    color:theme.DARK,
    width:"90%", 
    height:"80%", 
    alignSelf:"center", 
    borderRadius: 5,
    marginTop:5,
  },
  buttonText:{
    color:theme.LIGHT_PINK,
    alignSelf:"center",
    paddingHorizontal:5,
  },
  button:{
    borderColor:theme.LIGHT_PINK,
    borderRadius:10,
    borderWidth:1,
    width:"50%",
    marginBottom:10
  },

  viewDark:{
    flex:1,
    backgroundColor:theme.DARK,
    flexDirection:"column",
    justifyContent:"center",
    alignContent:"center",
    alignItems:"center"
  }

});
  