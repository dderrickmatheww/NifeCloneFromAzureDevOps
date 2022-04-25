import * as React from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import theme from '../../../src/styles/theme';
import { styles } from '../../styles/style';
import Util from '../../utils/util';
import IconWithBadge from "../IconWithBadge/IconWithBadge";

export default class Favorite extends React.Component  {

    state= {
        isFavorited: this.props.user.user_favorite_places.some(place => place.business === this.props.businessUID),
        loading: true
    }

    componentDidMount() {

    }

    handlePress = (bool) =>{
        this.setState({isFavorited: bool});
        this.props.favoriteTrigg(this.props.user.uuid, this.props.buisnessUID, bool);
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
                                <IconWithBadge name={'star'} badgeCount={0} color={theme.icons.color} size={30} type={'AntDesign'} />
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
