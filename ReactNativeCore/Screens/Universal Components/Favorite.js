import * as React from 'react';
import * as Device from 'expo-device';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import IconWithBadge from './IconWithBadge';
import theme from '../../Styles/theme';
import { styles } from '../../Styles/style';
import Util from '../../scripts/Util';
// let TouchableOpacity;
// if(Device.osName == "Android") {
//     TouchableOpacity = require('react-native-gesture-handler').TouchableOpacity;
// }
// else {
//     TouchableOpacity = require('react-native').TouchableOpacity;
// }
export default class Favorite extends React.Component  { 

    state= {
        isFavorited: false,
        loading: true
    }

    componentDidMount() {
        Util.user.isFavorited(this.props.buisnessUID, this.props.user, (boolean) => {
            this.setState({
                isFavorited: boolean,
                loading: false
            })
        });
    }

    handlePress = (bool) =>{
        this.setState({isFavorited: bool});
        this.props.favoriteTrigg(this.props.buisnessUID, bool);
    }

    render() {
        return ( 
            <View style={{width: 10, textAlign:"center", alignItems:"center", zIndex:1000}}>
                {
                    !this.state.loading ?
                        this.state.isFavorited ?
                            <TouchableOpacity
                                onPress={() => this.handlePress(false)}
                            >
                                <IconWithBadge name={'star'} badgeCount={0} color={theme.LIGHT_PINK} size={30} type={'AntDesign'} />
                            </TouchableOpacity>
                        :
                        <TouchableOpacity
                        onPress={() => this.handlePress(true)}
                        >
                            <IconWithBadge name={'staro'} badgeCount={0} color={theme.LIGHT_PINK_OPAC} size={30} type={'AntDesign'} />
                        </TouchableOpacity>
                    :
                    <View style={styles.viewDark}>
                        <ActivityIndicator 
                            size={'small'}
                            color={theme.LIGHT_PINK}
                        />
                    </View>
                }
            </View>
                
        )
    }
}
