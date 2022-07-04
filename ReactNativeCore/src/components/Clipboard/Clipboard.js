import * as React from 'react';
import {View, StyleSheet, Platform, TextInput, TouchableOpacity} from 'react-native';
import theme from '../../../src/styles/theme';
import {connect} from "react-redux";
import {Ionicons} from "@expo/vector-icons";
import {Caption} from "react-native-paper";

class Clipboard extends React.Component {

    //Props -> Type

    state = {
        data: this.props.data,
        isVisible: false,
        text: null,
    }


    toggleModal = (bool) => {
        this.setState({isVisible: bool});
    }

    onTextChange = (text) => {
        this.setState({text});
    }

    componentDidMount() {
        this.setState({data: this.props.data})
    }

    onSubmitText = () => {
        if(this.props.businessUUID){
            this.props.onAdd({
                description: this.state.text,
                user: this.props.userData.id,
                business: this.props.businessUUID
            })
        } else {
            this.props.onAdd({
                description: this.state.text,
                user: this.props.userData.id
            })
        }

        this.setState({isVisible: false})
    }

    render() {
        return (
            <View style={localStyles.background}>
                {/*Text Area*/}
                <View style={localStyles.dataCont}>
                    {
                        this.state.data.map((obj, i) => (
                            <View key={i} style={localStyles.itemRow}>
                                <Caption  style={localStyles.buttonText}>
                                    {obj.description}
                                </Caption>

                                {this.props.editable ? <TouchableOpacity style={localStyles.addBtn} onPress={() => this.props.onDelete(obj.id)}
                                >
                                    <Ionicons size={25} color={theme.icons.color} name="md-close"/>
                                </TouchableOpacity> : null}

                            </View>

                        ))
                    }
                </View>

                {
                    this.state.isVisible ?
                        <TextInput
                            mode={"outlined"}
                            label=""
                            placeholder={Platform.select({
                                ios: 'Type here...',
                                android: ''
                            })}
                            placeholderTextColor={Platform.select({
                                ios: 'white',
                                android: 'black'
                            })}
                            onChangeText={text => this.onTextChange(text)}
                            onEndEditing={() => this.onSubmitText()}
                            style={localStyles.textInput}
                            selectionColor={theme.generalLayout.textColor}
                            keyboardType='default'
                            theme={{colors: {underlineColor: 'transparent'}}}

                            returnKeyType='done'
                        >
                        </TextInput>
                        :

                        //Add to Button
                        this.props.editable ?
                            <TouchableOpacity
                                style={localStyles.addBtn}
                                onPress={() => this.toggleModal(true)}>
                                <Ionicons size={25} color={theme.icons.color} name="ios-add-circle"/>
                            </TouchableOpacity> : null
                }


            </View>

        )
    }
}

const localStyles = StyleSheet.create({
    itemRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dataCont: {
        flexDirection: 'column'
    },
    modal: {
        width: "95%",
        minHeight: 150,
        alignSelf: "center",
        borderColor: theme.LIGHT_PINK,
        borderWidth: 1,
        backgroundColor: theme.DARK,
        position: 'absolute',
        bottom: -50,

    },
    background: {
        backgroundColor: theme.VERY_DARK,
        width: '100%',
        minHeight: 30,
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 5,
        flex: 1,
    },
    addBtn: {
        marginLeft: 'auto',
        marginTop: 'auto',
    },
    textInput: {
        flex: 1,
        ...Platform.select({
            ios: {
                backgroundColor: 'white',
                color: theme.generalLayout.textColor,
            },
            android: {
                backgroundColor: 'white',
                color: 'black',
            }
        }),
        width: "90%",
        height: "80%",
        alignSelf: "center",
        borderRadius: 5,
        marginTop: 5,
        fontFamily: theme.generalLayout.font,
        borderColor: theme.generalLayout.backgroundColor,
        paddingHorizontal: 5
    },
    buttonText: {
        color: theme.generalLayout.textColor,
        paddingHorizontal: 5,
        fontFamily: theme.generalLayout.font,
        fontSize: 14
    },
    button: {
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 10,
        borderWidth: 1,
        width: "50%",
        marginBottom: 20
    },
    viewDark: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        color: theme.generalLayout.textColor
    }
});

function mapStateToProps(state) {
    return {
        userData: state.userData,
        requests: state.friendRequests,
        friends: state.friendData,
        businessData: state.businessData,
        yelpData: state.yelpData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refresh: (userData) => dispatch({type: 'REFRESH', data: userData})
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Clipboard);
