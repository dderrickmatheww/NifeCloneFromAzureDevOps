import React  from "react";
import {
    View,
    ActivityIndicator, Platform
} from "react-native";
import Util from '../../scripts/Util';
import { Modal, Button, TextInput, Text } from 'react-native-paper';
import theme from '../../../src/styles/theme';
import { eventsSpecialsStyles } from "./UpdateEventsModal";
import { connect } from "react-redux";

 class SpecialsModal extends React.Component  {
    state = {
      specialText: null,
      userData:null,
      saving:false,
    };


    async componentDidMount() {
      this.setState({userData:this.props.user});
      this.setState({business:this.props.business});
      this.setState({specials:this.props.business.specials});

      let specials = this.props.business.specials;
      let text = ""
      specials.forEach((special, i)=>{
        if(i != specials.length - 1){
          text += special.text + ", "
        }
        else if(i == specials.length - 1 || specials.length == 1){
          text += special.text
        }
        
      })
      this.setState({specialText:text})
    }

    onEventChange = (text) => {
      this.setState({specialText: text});
    }
    

    onSaveStatus = () => {
      
      
      let specialText = this.state.specialText;
      let user = this.state.userData
      if(specialText){
        this.setState({saving:true});
        let specialArray = specialText.split(",")
        let obj = {specials:[]}
        specialArray.forEach((special)=>{
          obj.specials.push({
            text: special,
            uploaded: new Date()
          })
        })
        let business = this.state.business;
        Util.business.UpdateUser(user.email, obj, ()=>{
          this.updateUserAsync(business, obj);
          this.setState({saving:false});
          this.props.onSave();
          this.props.onDismiss()
        });
      }
      else{
        alert('Please enter specials if you wish to update them')
      }
    }

    updateUserAsync = (business, obj) => {
        let user = this.props.user;
      business['specials']= obj.specials;
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
                    placeholder={"What drink specials are you offering? (Ex: $1 Beer, $6 Vodka)"}
                    onChangeText={text => this.onEventChange(text)}
                    style={localStyles.textInput}
                    value={this.state.specialText}
                    multiline={true}
                    > 
                  </TextInput>
                  <Text style={{color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.font, alignSelf:"center", marginBottom:10}}>Seperate specials with commas {"\n"}(Ex: $1 Beer, $6 Vodka)</Text>
                  {
                    this.state.saving ?
                    <ActivityIndicator style={{marginVertical:5}} color={theme.loadingIcon.color} size="large" />
                    :
                    <Button 
                      labelStyle={{color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.font}} 
                      style={localStyles.button} 
                      icon={"check"}
                      mode="contained" 
                      onPress={() => this.onSaveStatus()}
                    >
                      <Text style={{color:theme.generalLayout.textColor, fontFamily: theme.generalLayout.font}}>Update Specials</Text>
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


export default connect(mapStateToProps, mapDispatchToProps)(SpecialsModal);

const localStyles = eventsSpecialsStyles

  
