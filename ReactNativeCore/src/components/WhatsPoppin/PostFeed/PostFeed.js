import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Feed from './Feed/Feed';
import NavHeader from '../NavHeader/NavHeader';
import theme from '../../../styles/theme';
import { connect } from "react-redux";
import StatusModal from "../NavHeader/PostModal/StatusModel";
import NotificationSnackBar from "../NavHeader/NotificationSnackBar";
import {
    Text,
    Modal,
    Provider,
    Portal
} from 'react-native-paper';

class PostFeed extends React.Component {
    state = {
        postModal: false,
        notificationSnackBar: false,
        userData: this.props.userData,
        feedData: this.props.feedData,
        isBusiness: this.props.userData.businessId != null,
        modalType: "",
        statusModal: {
            type: "",
            visability: false
        },
    } 

    onDismiss = () => {
        this.setState({ 
            postModal: false,
            statusModal: {
                type: "",
                visability: false
            }
        });
    }

    render() {
        return (
            <View style={localStyles.safeAreaContainer}>
                <NavHeader navigation={this.props.navigation} modalTrigger={(modalToggle) => this.setState(modalToggle)} />
                <View style={{ height: '90%' }}>
                    <Feed type={"My Feed"} />
                </View>
                <Provider>
                    <Portal>
                        <Modal 
                        contentContainerStyle={{
                            alignSelf: "center",
                            width: '90%',
                            height: '75%'
                        }}
                        style={localStyles.modalContainer}
                        visible={this.state.postModal}
                        dismissable={true}
                        onDismiss={this.onDismiss}
                    >
                        {
                            this.state.userData.businessId != null ?
                                    <>
                                        <TouchableOpacity 
                                            onPress={() => this.setState({ modalType: "STATUS", modalVisability: true })}
                                            style={localStyles.modalButton}
                                        >
                                            <Text style={localStyles.modalButtonText}>
                                                Update Status
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity 
                                            onPress={() => this.setState({ modalType: "EVENT", modalVisability: true })}
                                            style={localStyles.modalButton}
                                        >
                                            <Text style={localStyles.modalButtonText}>
                                                Update Events
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity 
                                            onPress={() => this.setState({ modalType: "SPECIAL", modalVisability: true })}
                                            style={localStyles.modalButton}
                                        >
                                            <Text style={localStyles.modalButtonText}>
                                                Update Specials
                                            </Text>
                                        </TouchableOpacity>
                                        <StatusModal 
                                            modalType={ this.state.statusModal.type } 
                                            isVisible={ this.state.modalVisability }
                                            onDismiss={this.onDismiss}
                                        />
                                    </>
                            :
                                    <StatusModal
                                        isVisible={ this.props.postModal }
                                        modalType={ "STATUS" }
                                        onDismiss={this.onDismiss}
                                    />
                            }
                        </Modal>
                    </Portal>
                </Provider>
            </View>
        )
    }

}

const localStyles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        paddingTop: "7%",
        backgroundColor: theme.generalLayout.backgroundColor,
        width: '100%',
        height: '100%'
    },
    modalContainer: {
        flex: 1,
        width: '100%',
        height: '100%'
    }
});

function mapStateToProps(state){
    return {
        ...state
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refresh: ({ userData, feedData }) => dispatch({ 
            type:'REFRESH', 
            data: {
                userData,
                feedData 
            }
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostFeed);
