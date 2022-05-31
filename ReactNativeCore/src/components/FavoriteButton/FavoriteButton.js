import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import theme from '../../../src/styles/theme';
import { styles } from '../../styles/style';
import Util from '../../utils/util';
import IconWithBadge from "../IconWithBadge/IconWithBadge";
import { updateOrDeleteFavorites, getUser } from "../../utils/api/users";
const TouchableOpacity = Util.basicUtil.TouchableOpacity();
import { connect } from "react-redux";

class Favorite extends React.Component  {

    state = {
        isFavorited: false,
        loading: false,
        favorite: null
    }

    async componentDidMount() {
        await this.gatherFavoriteInfo()
    }

    gatherFavoriteInfo = async () => {
        const favorited = this.props.userData.user_favorite_places.some(place => place.business == this.props.buisnessUID)
        const favoritePlace = this.props.userData.user_favorite_places.find(place => place.business === this.props.buisnessUID)
        this.setState({isFavorited: favorited, favorite: favoritePlace})
    }

    handlePress = async (isAdding) =>{
        this.setState({ isFavorited: isAdding, loading: true });
        await updateOrDeleteFavorites(this.props.userData.uuid, this.props.buisnessUID, isAdding, this.state.favorite?.id);
        this.setState({ loading: false });
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

function mapStateToProps(state){
    return {
        ...state
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refresh: ({ userData }) => dispatch({ 
            type:'REFRESH', 
            data: {
                userData
            }
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorite);