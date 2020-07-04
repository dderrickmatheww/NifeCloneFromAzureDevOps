import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import IconWithBadge from './IconWithBadge';
import theme from '../../Styles/theme';
import { styles } from '../../Styles/style';

export default class Favorite extends React.Component  { 

    state= {
        isFavorited: false,
    }

    render() {
        return ( 
            <View style={styles.container}>
                {
                    this.state.isFavorited ?
                        <TouchableOpacity
                            onPress={() => {}}
                        >
                            <IconWithBadge name={'staro'} badgeCount={0} color={theme.LIGHT_PINK} size={24} type={'AntDesign'} />
                        </TouchableOpacity>
                    :
                    <TouchableOpacity
                            onPress={() => {}}
                        >
                            <IconWithBadge name={'staro'} badgeCount={0} color={theme.DARK_PINK} size={24} type={'AntDesign'} />
                    </TouchableOpacity>
                }
            </View>
                
        )
    }
}
