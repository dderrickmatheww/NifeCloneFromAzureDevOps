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
      statusText: null,
      userData: null,
      saving: false,
      refresh: null
    };

    componentDidMount() {
      this.setState({ 
        userData: this.props.user
      });
    }

    onStatusChange = (text) => {
      this.setState({statusText: text});
    }

    onSaveStatus = () => {
      this.setState({ saving: true });
      let status = this.state.statusText;
      let obj = {
        status: {
          text: status,
          timestamp: new Date()
        }
      }
      let user = this.props.user;
      user['status'] = obj.status;
      let updatedUserData = user;
      this.props.refresh(updatedUserData, null, null, null);
      Util.user.UpdateUser(user.email, obj, () => {
        this.setState({ saving: false });
        this.props.onSave();
      });
    }

    render(){     
        return(         
          <Modal 
            contentContainerStyle={{width:"90%", height:"60%", borderRadius:50, alignSelf:"center"}}
            visible={this.props.isVisible}
            dismissable={true}
            onDismiss={() => this.props.onDismiss()}
          >
            <View style={localStyles.viewDark}>
              <TextInput
                mode={"outlined"}
                label=""
                placeholder={"Type here..."}
                placeholderTextColor={{color: theme.generalLayout.textColor}}
                onChangeText={text => this.onStatusChange(text)}
                style={localStyles.textInput}
                selectionColor={theme.generalLayout.secondaryColor}
                value={this.state.statusText}
                multiline={true}
                > 
              </TextInput>
              {
                this.state.saving ?
                <ActivityIndicator style={{marginVertical:5}} color={theme.loadingIcon.color} size="large" />
                :
                <Button 
                  labelStyle={{color: theme.generalLayout.textColor}} 
                  style={localStyles.button} 
                  icon={"check"}
                  mode="contained" 
                  onPress={() => this.onSaveStatus()}
                >
                  <Text style={{color: theme.generalLayout.textColor}}>Update Status</Text>
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
  },
  buttonText:{
    color: theme.generalLayout.textColor,
    alignSelf:"center",
    paddingHorizontal:5,
  },
  button:{
    borderColor: theme.generalLayout.secondaryColor,
    borderRadius:10,
    borderWidth:1,
    width:"50%",
    marginBottom: 20
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
  
