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
                            <Headline style={{color:theme.LIGHT_PINK, fontSize: 14, }}>{this.props.name}</Headline>
                        </View>
                        <View style={localStyles.DrawerOverlay}>
                            <Favorite favoriteTrigg={(buisnessUID, boolean, buisnessName) => {this.props.favoriteABar(buisnessUID, boolean, buisnessName)}} user={this.props.user} buisnessUID={this.props.buisnessUID} buisnessName={this.props.name}/>
                        </View>
                </View>
                {
                     this.props.address && typeof this.props.address[0] !== 'undefined' ?
                        <Text style={styles.facebookDataText}>
                            {this.props.address[0]} {"\n"}
                            {this.props.address[1] + ', ' + this.props.address[2]} {"\n"}
                            Phone #: {this.props.phone} {"\n"}
                        </Text>
                    :
                    <Text style={styles.facebookDataText}>
                        No address available!
                    </Text>
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
        marginVertical:5,
        alignItems:"center",
      },
})