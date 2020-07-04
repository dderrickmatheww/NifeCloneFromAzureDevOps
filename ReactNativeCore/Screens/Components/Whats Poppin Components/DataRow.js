import React from 'react';
import { View, Text, TouchableOpacity, Image, Modal, Linking, ScrollView } from 'react-native';
import { styles } from '../../../Styles/style';

export default class DataRow extends React.Component  {
    state = {
        modalVisable: false
    }

    render() {
        return (
            <View style={styles.dataRowContainer}>
                <ScrollView 
                    contentContainerStyle={{alignItems: 'center', justifyContent: 'center', width: 375}} 
                    style={styles.dataRowScroll}
                    showsHorizontalScrollIndicator={false}
                >
                        <Image
                            style={styles.LogoData}
                            source={{uri: this.props.barImage }}
                        />
                        <Text style={styles.facebookDataText}>
                            {this.props.name} {"\n"} 
                            {this.props.address} {"\n"}
                            Phone #: {this.props.phone} {"\n"}
                        </Text>
                        { 
                            this.props.usersCheckedIn > 1 ? 
                                <Text style={styles.facebookDataText}>
                                    {"\n"}
                                    There are {this.props.usersCheckedIn} people currently here! 
                                </Text>
                            : 
                                <Text style={styles.facebookDataText}>
                                    There is {this.props.usersCheckedIn} person currently here! 
                                </Text>
                        }
                        
                </ScrollView>
            </View>
        )
    }
}