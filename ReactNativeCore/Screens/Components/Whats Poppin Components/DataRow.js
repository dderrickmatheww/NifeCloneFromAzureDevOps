import React from 'react';
import { View, Text, Image, ScrollView, } from 'react-native';
import { styles } from '../../../Styles/style';
import Favorite from '../../Universal Components/Favorite';

export default class DataRow extends React.Component  {
    state = {
        modalVisable: false,
        refresh: false
    }

    render() {
        return (
            <View style={styles.dataRowContainer}>
                <ScrollView 
                    contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}} 
                    style={styles.dataRowScroll}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={styles.whatsPoppinData}>
                        <Image
                            style={styles.LogoData}
                            source={{uri: this.props.barImage }}
                        />
                        <Text style={styles.facebookDataText}>
                            {this.props.name} {"\n"} 
                            {this.props.address[0]} {"\n"}
                            {this.props.address[1] + ', ' + this.props.address[2]} {"\n"}
                            Phone #: {this.props.phone} {"\n"}
                        </Text>
                        <Favorite favorite={(buisnessUID, boolean) => {this.props.favorite(buisnessUID, boolean)}} buisnessUID={this.props.buisnessUID} />
                    </View>
                        { 
                            this.props.usersCheckedIn > 1 ? 
                                <Text style={styles.checkedInDataText}>
                                    {"\n"}
                                    There are {this.props.usersCheckedIn} people currently here!
                                </Text>
                            : 
                                <Text style={styles.checkedInDataText}>
                                    {"\n"}
                                    There is {this.props.usersCheckedIn} person currently here! 
                                </Text>
                        }
                </ScrollView>
            </View>
        )
    }
}