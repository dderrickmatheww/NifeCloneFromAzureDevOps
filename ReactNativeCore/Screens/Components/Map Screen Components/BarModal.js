import React, { Component, useState } from "react";
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    Dimensions,
    TouchableHighlight,
    View
} from "react-native";

class BarModal extends React.Component  {
    constructor(props) {
    
        super(props);
        this.state = {isVisible: false};
    }

    closeModal = () => {
        this.setState({isVisible: false});
        console.log('test')
    }

    componentDidMount(){
        this.setState({isVisible: this.props.isVisible});
    }

    render(){
        
        return(
            
                <Modal 
                    style={localStyles.modalView}
                    animationType="slide"
                    visible={this.state.isVisible}
                    coverScreen={false}
                    onSwipeStart={() => this.closeModal()}
                >
                    <View style={localStyles.imgCont}>
                        <Image source={this.props.source} style={localStyles.img}/>
                    </View>
                    <View styles={localStyles.titleContainer}>
                        <Text style={localStyles.barName}> {this.props.barName}</Text>
                    </View>
                    <View styles={localStyles.ratingClosedCont}>
                        <Text style={localStyles.rating}>  {this.props.rating}/5 rating in {this.props.reviewCount} reviews.</Text>
                        <Text style={localStyles.pricing}> Price: {this.props.price}</Text>
                    </View>
                    <View styles={localStyles.contactCont}>
                        <Text style={localStyles.contact}>  Number: {this.props.phone} </Text>
                        <Text style={localStyles.closed}>  Closed: {this.props.closed == true ? "Yes" : "No"}</Text>
                    </View>
                    <View styles={localStyles.addressCont}>
                        <Text style={localStyles.address}>  {this.props.address} </Text>
                    </View>
                </Modal>
            
        )
    }
}

const localStyles = StyleSheet.create({
    mainCont: {
        flex:1,
        justifyContent: "center",
        alignItems:"center",
        width: (Dimensions.get('window').width * 0.50),
        height: (Dimensions.get('window').height * 0.50 ),
        maxWidth: (Dimensions.get('window').width * 0.50),
        maxHeight: (Dimensions.get('window').height * 0.50 ),
    },
    img: {
        flex: 1,
        width: (Dimensions.get('window').width * 0.50),
        height: (Dimensions.get('window').height * 0.50 ),
        maxWidth: (Dimensions.get('window').width * 0.50),
        maxHeight: (Dimensions.get('window').height * 0.50 ),
        
    },
    imgCont: {
        flex: 1,
        width: (Dimensions.get('window').width * 0.50),
        height: (Dimensions.get('window').height * 0.50 ),
        maxWidth: (Dimensions.get('window').width * 0.50),
        maxHeight: (Dimensions.get('window').height * 0.50 ),
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        width: (Dimensions.get('window').width * 0.75),
        height: (Dimensions.get('window').height * 0.75 ),
        maxWidth: (Dimensions.get('window').width * 0.75),
        maxHeight: (Dimensions.get('window').height * 0.75 ),
      },

      modalView:{
          margin:20,
          width: (Dimensions.get('window').width * 0.50),
          height: (Dimensions.get('window').height * 0.50 ),
          maxWidth: (Dimensions.get('window').width * 0.50),
          maxHeight: (Dimensions.get('window').height * 0.50 ),
      }
  });

  
  export default BarModal;