import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import IconWithBadge from './IconWithBadge';
import theme from '../../Styles/theme';
import { styles } from '../../Styles/style';
import Util from '../../scripts/Util';

export default class Favorite extends React.Component  { 

    state= {
        isFavorited: false,
    }

    componentDidMount() {
        Util.user.isFavorited(this.props.buisnessUID, (boolean) => {
            this.setState({
                isFavorited: boolean
            })
        });
    }

    render() {
        return ( 
            <View style={styles.container}>
                {
                    this.state.isFavorited ?
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({isFavorited: false});
                                this.props.favorite(this.props.buisnessUID, this.state.isFavorited);
                            }}
                        >
                            <IconWithBadge name={'star'} badgeCount={0} color={theme.LIGHT_PINK} size={24} type={'AntDesign'} />
                        </TouchableOpacity>
                    :
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({isFavorited: true});
                            this.props.favorite(this.props.buisnessUID, this.state.isFavorited);
                        }}
                    >
                        <IconWithBadge name={'staro'} badgeCount={0} color={theme.DARK_PINK} size={24} type={'AntDesign'} />
                    </TouchableOpacity>
                }
            </View>
                
        )
    }
}
