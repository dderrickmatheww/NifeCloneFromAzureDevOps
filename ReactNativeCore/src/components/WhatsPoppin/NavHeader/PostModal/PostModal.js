import React from "react";
import {
    StyleSheet, 
    Platform,
    View
} from "react-native";
import { Modal, Text } from 'react-native-paper';
import theme from '../../styles/theme';
import { connect } from "react-redux";

class PostModal extends React.Component {

  state = {
    userData: this.props.userData,
    feedData: this.props.feedData,
    modalType: "",
    modalVisability: false
  };

  render() {     
    return(         
      <Modal 
        contentContainerStyle={{
          width: "90%", 
          height: "70%", 
          borderRadius: 50, 
          alignSelf: "center"
        }}
        visible={this.props.isVisible}
        dismissable={true}
        onDismiss={() => {
          this.setState({ 
            modalType: "",
            modalVisability: false
          });
          this.props.onDismiss();
        }}
      >
        {
          this.state.userData.businessId != null ?
            <View style={localStyles.viewDark}>
              <TouchableOpacity 
                onPress={() => this.setState({ modalType: "STATUS", modalVisability: true })}
                style={localStyles.modalButton}
              >
                  <Text style={localStyles.modalButtonText}>
                    Update Status
                  </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => this.setState({ modalType: "EVENT", modalVisability: true })}
                style={localStyles.modalButton}
              >
                  <Text style={localStyles.modalButtonText}>
                    Update Events
                  </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => this.setState({ modalType: "SPECIAL", modalVisability: true })}
                style={localStyles.modalButton}
              >
                  <Text style={localStyles.modalButtonText}>
                    Update Specials
                  </Text>
              </TouchableOpacity>
              <StatusModal 
                modalType={ this.state.modalType } 
                isVisible={ this.state.modalVisability }
              />
            </View>
          :
            <StatusModal
                isVisible={ this.props.isVisible }
                modalType={ "STATUS" }
            />
        }
      </Modal>
    )
  }
}

function mapStateToProps(state){
    return {
        ...state
    }
}

function mapDispatchToProps(dispatch){
    return {
        refresh: (userData, feedData) => dispatch({ type:'REFRESH', data: userData, feed: feedData }),
        yelpDataRefresh: (data) => dispatch({ type:'YELPDATA', data: data }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);

const localStyles = StyleSheet.create({
  textInput:{
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: theme.generalLayout.backgroundColor,
        color: theme.generalLayout.textColor,
      },
      android:{
        backgroundColor: 'white',
        color: 'black',
      }
    }),
    width:"90%", 
    height:"80%", 
    alignSelf:"center", 
    borderRadius: 5,
    marginTop:5,
    fontFamily: theme.generalLayout.font,
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
    width:"50%",
    marginBottom: 20
  },
  viewDark:{
    flex: 1,
    backgroundColor: theme.generalLayout.backgroundColor,
    flexDirection:"column",
    justifyContent:"center",
    alignContent:"center",
    alignItems:"center",
    color: theme.generalLayout.textColor,
    borderRadius: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.generalLayout.secondaryColor
  },
  modalButton: {
    backgroundColor: theme.generalLayout.backgroundColor,
    borderWidth: 1,
    borderColor: theme.generalLayout.secondaryColor,
    borderRadius: 5,
    ...Platform.select({
        ios: {
            paddingVertical: 10,
            paddingHorizontal: 5,
            marginVertical: 10,
        },
        android: {
            paddingVertical: 2,
            paddingHorizontal: 5,
            marginVertical: 5,
        }
    }),
    textAlign: "center",
    color: theme.generalLayout.textColor,
    width: 200,
    fontFamily:theme.generalLayout.font
  },
  modalButtonText: {
      color: theme.generalLayout.textColor,
      fontSize: 20,
      textAlign: "center",
      fontFamily: theme.generalLayout.font
  },
  viewDark: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.generalLayout.backgroundColor,
    paddingBottom: 10
  },
});
