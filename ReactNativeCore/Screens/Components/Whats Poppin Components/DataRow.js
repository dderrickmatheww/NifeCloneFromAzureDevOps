import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { styles } from '../../../Styles/style';
import theme from '../../../Styles/theme';
import {
    Headline
} from 'react-native-paper';
import Favorite from '../../Universal Components/Favorite';

export default class DataRow extends React.Component  {
    state = {
        modalVisable: false,
        refresh: false
    }

    render() {
        return (
            <View style={styles.dataRowContainer}>
                <View style={localStyles.navHeader}>
                        <Image
                            style={localStyles.LogoData}
                            source={{uri: this.props.barImage }}
                        />
                        <View style={{width:"45%", textAlign:"center", alignSelf:"center", margin: '2%'}}>
                            <Headline style={{color:theme.LIGHT_PINK, fontSize: 14, lineHeight: 0 }}>{this.props.name}</Headline>
                        </View>
                        <View style={localStyles.DrawerOverlay}>
                            <Favorite favoriteTrigg={(buisnessUID, boolean) => {this.props.favoriteABar(buisnessUID, boolean)}} buisnessUID={this.props.buisnessUID} />
                        </View>
                </View>
                {
                     this.props.address ?
                        <Text style={styles.facebookDataText}>
                            {this.props.address[0]} {"\n"}
                            {this.props.address[1] + ', ' + this.props.address[2]} {"\n"}
                            Phone #: {this.props.phone} {"\n"}
                        </Text>
                    :
                        null
                }
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
            </View>
        )
    }
}

const localStyles = StyleSheet.create({ 
    navHeader: {
        flexDirection:"row",
        borderBottomColor: theme.LIGHT_PINK,
        borderBottomWidth: 1,
        paddingBottom: 10,
        width:"100%",
        textAlign:"center",
        alignItems:"center",
        overflow: 'hidden'
    },
    DrawerOverlay: {
        alignSelf:"flex-start",
        backgroundColor: theme.DARK,
        borderRadius: 10,
        width: '5%',
        textAlign:"center",
        alignItems:"center",
        margin: '2%',
    },
    LogoData: {
        width: '33%',
        height: 90,
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 5,
        margin: '2%',
        alignItems:"center",
      },
})