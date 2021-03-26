import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import IconWithBadge from './IconWithBadge';
import theme from '../../Styles/theme';
import { styles } from '../../Styles/style';
import Util from '../../scripts/Util';
import {TouchableOpacity} from 'react-native-gesture-handler';

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
        this.props.favoriteTrigg(this.props.buisnessUID, bool, this.props.buisnessName);
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
                                <IconWithBadge name={'star'} badgeCount={0} color={theme.icons.color} size={30} type={'AntDesign'} />
                            </TouchableOpacity>
                        :
                        <TouchableOpacity
                        onPress={() => this.handlePress(true)}
                        >
                            <IconWithBadge name={'staro'} badgeCount={0} color={theme.icons.color} size={30} type={'AntDesign'} />
                        </TouchableOpacity>
                    :
                    <View style={styles.viewDark}>
                        <ActivityIndicator 
                            size={'small'}
                            color={theme.loadingIcon.color}
                        />
                    </View>
                }
            </View>
                
        )
    }
}
