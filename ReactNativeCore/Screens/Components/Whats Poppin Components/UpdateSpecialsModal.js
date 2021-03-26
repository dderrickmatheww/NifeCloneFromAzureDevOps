import React  from "react";
import {
    StyleSheet,
    View,
    ActivityIndicator
} from "react-native";
import Util from '../../../scripts/Util';
import {Modal, Button, TextInput, Text} from 'react-native-paper';
import theme from '../../../Styles/theme';

export default class StatusModal extends React.Component  {
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
          text += special.special + ", "
        }
        else if(i == specials.length - 1 || specials.length == 1){
          text += special.special
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
            special: special,
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
      business['specials']= obj.specials;
      this.props.refresh(null, null, null, business);
      
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


const localStyles = StyleSheet.create({
  textInput:{
    flex:1,
    backgroundColor: theme.generalLayout.backgroundColor,
    color: theme.generalLayout.textColor,
    width:"90%", 
    height:"80%", 
    alignSelf:"center", 
    borderRadius: 5,
    marginTop:5,
    fontFamily: theme.generalLayout.font
  },
  buttonText:{
    color: theme.generalLayout.textColor,
    alignSelf:"center",
    paddingHorizontal:5,
    fontFamily: theme.generalLayout.font
  },
  button:{
    borderColor:theme.generalLayout.secondaryColor,
    borderRadius:10,
    borderWidth:1,
    width:"60%",
    marginBottom:10
  },

  viewDark:{
    flex:1,
    backgroundColor:theme.generalLayout.backgroundColor,
    flexDirection:"column",
    justifyContent:"center",
    alignContent:"center",
    alignItems:"center"
  }

});
  
