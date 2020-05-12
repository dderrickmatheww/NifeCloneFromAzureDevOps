import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../Styles/style';
import * as firebase from 'firebase';

export default class DataRow extends React.Component  {
    render() {
        return (
            <View style={styles.dataRowContainer}>
                <TouchableOpacity style={styles.dataRow}>
                    <Text>{this.props.name}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}