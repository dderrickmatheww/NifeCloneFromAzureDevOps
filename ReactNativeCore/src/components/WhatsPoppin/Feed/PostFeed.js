import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Feed from './Feed';
import NavHeader from '../Navigation/NavHeader';
import theme from '../../../styles/theme';
import { connect } from "react-redux";
import StatusModal from "../../StatusModal/StatusModal";
import NotificationSnackBar from "./NotificationSnackBar";
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
        type: "",
        visability: false
    } 

    onDismiss = () => {
        this.setState({ 
            postModal: false,
            type: "",
            visability: false
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
                                        height: '60%'
                                    }}
                                    style={localStyles.modalContainer}
                                    visible={this.state.postModal}
                                    dismissable={true}
                                    onDismiss={this.onDismiss}
                                >
                                {
                                    this.props.userData.businessId != null ?
                                        <>
                                        { 
                                            this.state.type == "" ?
                                                <>
                                                    <TouchableOpacity 
                                                        onPress={() => this.setState({ 
                                                            type: "STATUS",
                                                            modalVisability: true
                                                        })}
                                                        style={localStyles.modalButton}
                                                    >
                                                        <Text style={localStyles.modalButtonText}>
                                                            Update Status
                                                        </Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity 
                                                        onPress={() => this.setState({ 
                                                            type: "EVENT",
                                                            modalVisability: true
                                                        })}
                                                        style={localStyles.modalButton}
                                                    >
                                                        <Text style={localStyles.modalButtonText}>
                                                            Update Events
                                                        </Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity 
                                                        onPress={() => this.setState({ 
                                                            type: "SPECIAL",
                                                            modalVisability: true
                                                        })}
                                                        style={localStyles.modalButton}
                                                    >
                                                        <Text style={localStyles.modalButtonText}>
                                                            Update Specials
                                                        </Text>
                                                    </TouchableOpacity>
                                                </>
                                            :
                                                null
                                        }
                                        { 
                                            this.state.type != "" ?
                                                <StatusModal 
                                                    isVisible={ this.state.modalVisability }
                                                    modalType={ this.state.type }
                                                    onDismiss={this.onDismiss}
                                                />
                                            :
                                                null
                                        }
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
    },
    modalButton: {
        backgroundColor: theme.generalLayout.backgroundColor,
        borderWidth: 1,
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 5,
        padding: '5%',
        textAlign: "center",
        margin: '10%',
        fontFamily: theme.generalLayout.font
    },
    modalButtonText: {
        color: theme.generalLayout.textColor,
        fontSize: 20,
        textAlign: "center",
        fontFamily: theme.generalLayout.font
    },
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
