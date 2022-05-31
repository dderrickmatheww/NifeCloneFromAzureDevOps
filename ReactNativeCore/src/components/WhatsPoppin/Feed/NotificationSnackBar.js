import React from 'react';
import {
    StyleSheet,
} from 'react-native';
import {
    Snackbar,
} from 'react-native-paper';
import { connect } from "react-redux";

class NotificationSnackBar extends React.Component {
    render() {
        return (
            <Snackbar
                style={localStyles.snackbar}
                visible={this.props.isVisable} 
                onDismiss={this.props.onDismissSnackBar}
                action={{
                    label: 'Close',
                    onPress: () => this.props.onDismiss(),
                }}
            >
                { this.props.message }
            </Snackbar>
        )
    }
}

const localStyles = StyleSheet.create({
    snackbar: {
        zIndex: 3, 
        elevation: 100, 
        position: 'absolute', 
        bottom: 725
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationSnackBar);
