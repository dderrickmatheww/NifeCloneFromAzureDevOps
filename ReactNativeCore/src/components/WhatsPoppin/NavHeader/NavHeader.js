import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {
    Text,
    Headline,
} from 'react-native-paper';
import theme from '../../../styles/theme';
import { connect } from "react-redux";
import DrawerButton from "../../Drawer/DrawerButton";
import PostModal from "./PostModal/PostModal";
import NotificationSnackBar from "./NotificationSnackBar";

class NavHeader extends React.Component {

    state = {
        postModal: false,
        notificationSnackBar: false,
        userData: this.props.userData,
        feedData: this.props.feedData,
        isBusiness: this.props.userData.businessId != null
    }

    render() {
        return (
            <View style={localStyles.navHeader}>
                <DrawerButton
                    userPhoto={this.state.userData.photoSource}
                    drawerButtonColor={theme.generalLayout.secondaryColor}
                    onPress={this.props.navigation.openDrawer}
                />
                <View style={{ width: "100%" }}>
                    <Headline style={{
                        color: theme.generalLayout.textColor,
                        fontFamily: theme.generalLayout.fontBold,
                        marginLeft: '5%',
                        marginBottom: '2%'
                    }}>Your Feed</Headline>
                </View>
                <TouchableOpacity 
                    onPress={() => this.setState({ isVisable: true })}
                    style={localStyles.StatusOverlay}
                >
                    <Text 
                        style={localStyles.statusButton}
                    >
                        { this.state.isBusiness ? 'Update...' : 'Update Status' }
                    </Text>
                </TouchableOpacity>
                <PostModal 
                    isVisable={this.state.postModal}
                    onDismiss={() => this.setState({ isVisable: false, notificationSnackBar: true })}
                />
                <NotificationSnackBar 
                    isVisable={this.state.notificationSnackBar}
                    onDismiss={() => this.setState({ notificationSnackBar: false })}
                />
            </View>
        )
    }
}

const localStyles = StyleSheet.create({
    StatusOverlay: {
        position: "relative",
        right: 150,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderWidth: .5,
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 8
    },
    statusButton: {
        color: theme.generalLayout.textColor,
        fontSize: 11,
        fontFamily: theme.generalLayout.font
    },
    navHeader: {
        marginTop: 12.5,
        flexDirection: "row",
        borderBottomColor: theme.generalLayout.secondaryColor,
        borderBottomWidth: 1,
        width: "98%",
        textAlign: "center",
        alignItems: "center",
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

export default connect(mapStateToProps, mapDispatchToProps)(NavHeader);
