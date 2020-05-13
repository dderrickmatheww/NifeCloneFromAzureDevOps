import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { styles } from '../../Styles/style';
import * as firebase from 'firebase';

export default class DataRow extends React.Component  {
    render() {
        return (
            <View style={styles.dataRowContainer}>
                <View>
                    <TouchableOpacity style={styles.facebookDataBtn} 
                        onPress={() => { this.props.onDataRowPress(true) }}
                    >
                        <Image
                            style={styles.LogoData}
                            source={require("../../Media/Images/fblogo.png")}
                        />
                        <Text style={styles.facebookDataText}>{this.props.name} in {this.props.city}, {this.props.state}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}