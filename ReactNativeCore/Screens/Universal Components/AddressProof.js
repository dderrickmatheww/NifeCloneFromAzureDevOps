import React  from "react";
import {
    StyleSheet,
    View,
    ActivityIndicator
} from "react-native";
import Util from '../../scripts/Util';
import * as firebase from 'firebase';
import {Modal, Button, TextInput, Text} from 'react-native-paper';
import theme from '../../Styles/theme';

export default class StatusModal extends React.Component  {
    state = {
      statusText: null,
      userData:null,
      saving:false,
    };


    async componentDidMount() {
      this.setState({userData:this.props.user});
    }

    handleUploadImage = () => {
      this.props.uploadImage()
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
                  <Text style={{color:theme.generalLayout.textColor, fontFamily: theme.generalLayout.font, marginHorizontal:20, marginBottom:25}}>
                    Please upload your proof of address. Your account will be deleted if you do not complete this. 
                  </Text>
                  {
                    this.state.saving ?
                    <ActivityIndicator style={{marginVertical:5}} color={theme.loadingIcon.color} size="large" />
                    :
                    <Button 
                      labelStyle={{color:theme.generalLayout.textColor, fontFamily: theme.generalLayout.font}} 
                      style={localStyles.button} 
                      icon={"check"}
                      mode="contained" 
                      onPress={() => this.handleUploadImage()}
                    >
                      <Text style={{color:theme.generalLayout.textColor, fontFamily: theme.generalLayout.font}}>Upload Image</Text>
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
    backgroundColor:theme.generalLayout.backgroundColor,
    color: theme.generalLayout.textColor,
    fontFamily: theme.generalLayout.font,
    width:"90%", 
    height:"80%", 
    alignSelf:"center", 
    borderRadius: 5,
    marginTop:5,
  },
  buttonText:{
    color:theme.generalLayout.textColor,
    fontFamily: theme.generalLayout.font,
    alignSelf:"center",
    paddingHorizontal:5,
  },
  button:{
    borderColor:theme.generalLayout.secondaryColor,
    borderRadius:10,
    borderWidth:1,
    width:"50%",
    marginBottom:10,
    marginTop:20,
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
  
