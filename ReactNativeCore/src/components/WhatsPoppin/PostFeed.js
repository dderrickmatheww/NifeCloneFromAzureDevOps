import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import Feed from '../Universal/Feed';
import theme from '../../styles/theme';
import { connect } from "react-redux";

class PostFeed extends React.Component {

    render() {
        return (
            <View style={localStyles.safeAreaContainer}>
                <NavHeader navigation={this.props.navigation} />
                <Feed />
            </View>
        )
    }

}

const localStyles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        paddingTop: "7%",
        backgroundColor: theme.generalLayout.backgroundColor,
        width: '100%'
    },
});

function mapStateToProps(state){
    return {
        ...state
    }
}

function mapDispatchToProps(dispatch){
    return {
        refresh: (userData, feedData) => dispatch({ type:'REFRESH', data: userData, feed: feedData }),
        yelpDataRefresh: (data) => dispatch({ type:'YELPDATA', data: data }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostFeed);
