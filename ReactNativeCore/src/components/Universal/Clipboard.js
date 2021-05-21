import * as React from 'react';
import {View,  StyleSheet, Platform, TextInput} from 'react-native';
import theme from '../../../Styles/theme';
import Util from '../../scripts/Util';
import {connect} from "react-redux";
import {Ionicons} from "@expo/vector-icons";
import {Caption} from "react-native-paper";

const TouchableOpacity = Util.basicUtil.TouchableOpacity();

class Clipboard extends React.Component {

    //Props -> Type

    state = {
        data: this.props.data,
        isVisible: false,
        text:null,
    }


    toggleModal = (bool) => {
        this.setState({isVisible: bool});
    }

    onTextChange = (text) =>{
        this.setState({text:text});
    }

    removeIndex = (idx) => {
        let userData = this.props.user;
        let data = this.props.data.splice(idx,1);
        this.setState({data:data})
        if(this.props.type == 'events'){
            userData.businessData.events = data
            Util.business.UpdateUser(this.props.user.email, {events: data})
            this.props.refresh(userData);
        } else if(this.props.type == 'specials') {
            userData.businessData.specials = data
            Util.business.UpdateUser(this.props.user.email, {specials: data})
            this.props.refresh(userData);
        }

    }

    componentDidMount() {

    }

    onSubmitText = () =>{
        let userData = this.props.user;
        let update = {text: this.state.text}
        if(this.props.type == 'events' || this.props.type == 'specials')
            update['uploaded'] = new Date();

        this.props.data.push(update);

        if(this.props.type == 'events'){
            userData.businessData.events = this.props.data;
            Util.business.UpdateUser(this.props.user.email, {events: this.props.data})
            this.props.refresh(userData);
        } else if(this.props.type == 'specials'){
            userData.businessData.specials = this.props.data;
            Util.business.UpdateUser(this.props.user.email, {specials: this.props.data})
            this.props.refresh(userData);
        } else if(this.props.type == 'favoriteDrinks'){
            // userData.businessData.events = this.state.data;
            // Util.business.UpdateUser(this.props.user.email, {events: this.state.data})
            // this.props.refresh(userData);
        }
        this.setState({isVisible: false})
    }

    render() {
        return (
            <View style={localStyles.background}>
                {/*Text Area*/}
                <View style={localStyles.dataCont}>
                    {
                        this.props.data.map((obj,i) => (
                            <View style={localStyles.itemRow}>
                                <Caption key={i} style={localStyles.buttonText}>
                                    {obj.text}
                                </Caption>

                                <TouchableOpacity style={localStyles.addBtn}
                                                  onPress={() => this.removeIndex(i)}
                                >
                                    <Ionicons size={20} color={theme.icons.color}
                                              name="md-close"></Ionicons>
                                </TouchableOpacity>

                            </View>

                        ))
                    }
                </View>

                {this.state.isVisible ?
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
                    </TextInput> :

                    //Add to Button
                    <TouchableOpacity style={localStyles.addBtn}
                                      onPress={() => this.toggleModal(true)}
                    >
                        <Ionicons size={25} color={theme.icons.color}
                                  name="ios-add-circle"></Ionicons>
                    </TouchableOpacity>
                }




            </View>

        )
    }
}

const localStyles = StyleSheet.create({
    itemRow:{
        flex:1,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    dataCont:{
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
        paddingHorizontal:5
    },
    buttonText: {
        color: theme.generalLayout.textColor,
        paddingHorizontal: 5,
        fontFamily: theme.generalLayout.font
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
        user: state.userData,
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
