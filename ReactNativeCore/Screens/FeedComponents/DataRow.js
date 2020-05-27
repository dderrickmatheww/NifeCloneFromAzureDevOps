import React from 'react';
import { View, Text, TouchableOpacity, Image, Modal, Linking, ScrollView } from 'react-native';
import { styles } from '../../Styles/style';
import * as firebase from 'firebase';

export default class DataRow extends React.Component  {
    state = {
        modalVisable: false
    }

    render() {
        return (
            <View style={styles.dataRowContainer}>
                <View>
                    <TouchableOpacity style={styles.facebookDataBtn} 
                        onPress={() => { 
                            let boolean = this.state.modalVisable ? false : true;
                            this.setState({modalVisable: boolean});
                        }}
                    >
                        <Image
                            style={styles.LogoData}
                            source={require("../../Media/Images/fblogo.png")}
                        />
                        <Text style={styles.facebookDataText}>{this.props.name} in {this.props.city}, {this.props.state}</Text>
                    </TouchableOpacity>
                    <Modal
                        visible={this.state.modalVisable}
                        animationType="slide"
                        transparent={true}
                    >
                        <View style={styles.centeredView}>
                            <ScrollView 
                                style={ styles.modalScrollView }
                            >
                                <View style={styles.modalView}>
                                    <TouchableOpacity style={styles.closeBtn}
                                        onPress={() => {this.setState({modalVisable: false})}}
                                    >
                                        <Image style={styles.close} source={require("../../Media/Images/close.png")}/>
                                    </TouchableOpacity>
                                    <Text>{this.props.name}</Text>
                                    <Text>Address: {this.props.street} {this.props.city}, {this.props.state} {this.props.zip}</Text>
                                    <Text>Phone #: {this.props.phone}</Text>
                                    <Text>{this.props.description}</Text>
                                        {
                                            this.props.specialties ? 
                                                <View>
                                                    {
                                                        (
                                                            this.props.specialties.breakfast == "0" &&
                                                            this.props.specialties.coffee == "0" &&
                                                            this.props.specialties.drinks == "0" &&
                                                            this.props.specialties.lunch == "0" ?
                                                            null :
                                                            <Text>{this.props.name}'s specialties: </Text>
                                                        )
                                                    }
                                                    {
                                                        this.props.specialties.breakfast == "1" ?
                                                            <Text> {'\u2B24'} A great breakfast option!</Text> 
                                                        : null
                                                    }
                                                    {
                                                        this.props.specialties.coffee == "1" ?
                                                            <Text> {'\u2B24'} A superb coffee option!</Text> 
                                                        : null
                                                    }
                                                    {
                                                        this.props.specialties.drinks == "1" ?
                                                            <Text> {'\u2B24'} They make great drinks!</Text> 
                                                        : null
                                                    } 
                                                    {
                                                        this.props.specialties.lunch == "1" ?
                                                            <Text>{'\u2B24'} A great place to grab a bite for lunch!</Text> 
                                                        : null
                                                    }
                                                </View> 
                                            : null
                                        }
                                    <View>
                                        <Text style={{color: 'blue'}}
                                            onPress={() => Linking.openURL(this.props.link)}>
                                            Facebook Page
                                        </Text>
                                        <Text style={{color: 'blue'}}
                                            onPress={() => Linking.openURL(this.props.website)}>
                                            {this.props.name}'s website
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ height: 100 }} />
                            </ScrollView>
                        </View>
                    </Modal>
                </View>
            </View>
        )
    }
}