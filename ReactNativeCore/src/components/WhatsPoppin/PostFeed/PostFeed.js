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
import StatusModal from "../NavHeader/StatusModal/StatusModel";
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
                <NavHeader type={ this.props.route.params.type } navigation={this.props.navigation} modalTrigger={(modalToggle) => this.setState(modalToggle)} />
                <View style={{ height: '90%' }}>
                    <Feed type={ this.props.route.params.type } />
                </View>
                {
                    this.props.route.params.type === "My Feed" ?
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
                                    this.props.userData.businessId != null ?
                                        <>
                                            <TouchableOpacity 
                                                onPress={() => this.setState({ 
                                                    statusModel: {
                                                        type: "STATUS",
                                                        modalVisability: true
                                                    }
                                                })}
                                                style={localStyles.modalButton}
                                            >
                                                <Text style={localStyles.modalButtonText}>
                                                    Update Status
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                onPress={() => this.setState({ 
                                                    statusModel: {
                                                        type: "EVENT",
                                                        modalVisability: true
                                                    }
                                                })}
                                                style={localStyles.modalButton}
                                            >
                                                <Text style={localStyles.modalButtonText}>
                                                    Update Events
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                onPress={() => this.setState({ 
                                                    statusModel: {
                                                        type: "SPECIAL",
                                                        modalVisability: true
                                                    }
                                                })}
                                                style={localStyles.modalButton}
                                            >
                                                <Text style={localStyles.modalButtonText}>
                                                    Update Specials
                                                </Text>
                                            </TouchableOpacity>
                                            <StatusModal 
                                                isVisible={ this.state.statusModal.modalVisability }
                                                modalType={ this.state.statusModal.type }
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
                    :
                        null
                }
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
