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

export default class StatusModal extends React.Component  {
    state = {
      statusText: null,
      userData:null,
      saving:false,
    };


    async componentDidMount() {
      this.setState({userData:this.props.user});
    }

    onStatusChange = (text) => {
      console.log(text);
      this.setState({statusText: text});
    }

    onSaveStatus = () => {
      this.setState({saving:true});
      
      let status = this.state.statusText;
      let obj = {status:{
        text: status,
        timestamp: new Date()
      }}
      let user = this.state.userData;
      Util.user.UpdateUser(firebase.firestore(), user.email, obj, ()=>{
        console.log('Updating Status');
        
       
        this.updateUserAsync(user, obj);
        this.setState({saving:false});
        this.props.onSave();
      });
    }

    updateUserAsync = (user, obj) => {
      user['status']= obj.status;
      let userStringify = JSON.stringify(user);
      Util.asyncStorage.SetAsyncStorageVar('User', userStringify)
      .then(()=>{
        this.props.refresh(user, null, null);
      });
    }

    render(){     
        return(         
            <Modal 
              contentContainerStyle={{width:"90%", height:"40%", borderRadius:50, alignSelf:"center"}}
              visible={this.props.isVisible}
              dismissable={true}
              onDismiss={() => this.props.onDismiss()}
            >
              
                <View style={localStyles.viewDark}>
                  <TextInput
                    mode={"outlined"}
                    label=""
                    placeholder={"What're you feelin' tonight?"}
                    onChangeText={text => this.onStatusChange(text)}
                    style={localStyles.textInput}
                    value={this.state.statusText}
                    multiline={true}
                    > 
                  </TextInput>
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
                      <Text style={{color:theme.LIGHT_PINK}}>Update Status</Text>
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
  
