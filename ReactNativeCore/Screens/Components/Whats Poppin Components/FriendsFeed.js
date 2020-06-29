import React from 'react';
import { View, TouchableOpacity, Image, Modal, Linking, ScrollView } from 'react-native';
import { Text} from 'react-native-paper';
import { styles } from '../../../Styles/style';
import  theme  from '../../../Styles/theme';

export default class FriendsFeed extends React.Component  {
    state = {
        modalVisable: false
    }

    render() {
        return (
           <View style={styles.viewDark}>
               <Text style={{color:theme.LIGHT_PINK}}>

               </Text>
           </View>
        )
    }
}