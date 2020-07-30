import * as React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import IconWithBadge from './IconWithBadge';
import theme from '../../Styles/theme';
import { styles } from '../../Styles/style';
import Util from '../../scripts/Util';

export default class Favorite extends React.Component  { 

    state= {
        isFavorited: false,
        loading: true
    }

    componentDidMount() {
        Util.user.isFavorited(this.props.buisnessUID, (boolean) => {
            this.setState({
                isFavorited: boolean,
                loading: false
            })
        });
    }

    render() {
        return ( 
            <View style={{width: 10, textAlign:"center", alignItems:"center"}}>
                {
                    !this.state.loading ?
                        this.state.isFavorited ?
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({isFavorited: false});
                                    this.props.favoriteTrigg(this.props.buisnessUID, false);
                                }}
                            >
                                <IconWithBadge name={'star'} badgeCount={0} color={theme.LIGHT_PINK} size={30} type={'AntDesign'} />
                            </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={async () => {
                                this.setState({isFavorited: true});
                                this.props.favoriteTrigg(this.props.buisnessUID, true);
                            }}
                        >
                            <IconWithBadge name={'staro'} badgeCount={0} color={theme.DARK_PINK} size={30} type={'AntDesign'} />
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
