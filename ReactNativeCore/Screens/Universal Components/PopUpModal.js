import React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from "react-native";
import theme from '../../Styles/theme';
import { Ionicons } from '@expo/vector-icons'; 

export default class PopUpModal extends React.Component  {
    state = {
       isVisible: this.props.isVisible ? true : false,
    }

    toggleModal = async (boolean) => {
        await this.setState({isVisible: boolean});
        this.props.toggleModal(this.state.isVisible);
    }

    componentDidUpdate(prevProps) {
        if (this.props.isVisible !== prevProps.isVisible) {
            this.setState({
                isVisible: this.props.isVisible
            });
        }
    }

    render(){
        return(
        <Modal  
            animationType="slide"
            visible={this.state.isVisible}
            transparent={true}
        >
            <View style={localStyles.centeredView}>
                <View style={localStyles.modalView}>
                    <TouchableHighlight  style={localStyles.closeButton}
                            onPress={() => {
                                this.toggleModal(false);
                            }}
                        >
                        <Ionicons name="ios-close" size={32} color={theme.icons.color}/>
                    </TouchableHighlight>
                    <View style={localStyles.titleCont}>
                        <Text style={localStyles.modalTitle}>Opps, it looks like you've hit your favorite limit! (Max: 10)</Text>
                        <Text style={localStyles.modalTitle}>Please go to your profile to edit your favorites if desired!</Text>
                    </View>
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
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalView: {
      width:"90%",
      height:"30%", 
      backgroundColor: theme.DARK,
      borderColor: theme.LIGHT_PINK,
      borderWidth: 1,
      borderRadius: 20,
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
    titleCont: {
        borderRadius: 20,
        padding: '1%',
        borderWidth: 1,
        justifyContent: 'center', 
        alignItems: 'center' ,
        width: '100%',
        backgroundColor:"#BEB2C8",
        textAlign: "center",
    },
    modalTitle:{
      color: "#20232a",
      padding: 5,
      fontSize: 20,
      textAlign:"center",
      fontWeight:'bold',
      marginVertical:"2%",
    },
    BtnHolder: {
        padding: '1%',
        justifyContent: 'center', 
        alignItems: 'center' ,
        width: '100%',
        textAlign:"center",
        flexDirection:"row",
    },
    Btn: {
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor:"#BEB2C8",
        borderRadius: 20,
        width: '50%',
        padding: '5%',
        margin: '2%',
        marginTop: '20%'
    },
    BtnText: {
        color: "#20232a",
        padding: 5,
        fontSize: 20,
        textAlign:"center",
        fontWeight:'bold',
        marginVertical:"2%",
    }
  });