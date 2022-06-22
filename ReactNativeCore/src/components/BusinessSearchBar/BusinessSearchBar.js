import * as React from 'react';
import {View, TextInput, Text, ActivityIndicator, StyleSheet, FlatList} from 'react-native';
import {
    Avatar
} from 'react-native-paper';
import theme from '../../../src/styles/theme';
import Util from '../../utils/util';
import {searchBusinesses} from "../../utils/api/businesses";
import {MILES_PER_METER} from "../../utils/location";

const TouchableOpacity = Util.basicUtil.TouchableOpacity();

export default class BusinessSearchBar extends React.Component {

    state = {
        showData: false,
        searchQuery: "",
        searchData: null,
        loading: false,
        isAutoComplete: false
    }

    onSubmit = async (text) => {
        this.setState({showData: true, loading: true})
        const searchData = await searchBusinesses(this.props.latitude, this.props.longitude, text)
        this.setState({loading: false})
        this.setState({searchData})
    }
    handleOnChange = async (text) => {
        this.setState({searchQuery: text})
        if(text === "" || text.length < 3){
            this.setState({showData: false})
        }
    }

    render() {
        return (
            <View style={localStyles.container}>
                <TextInput
                    style={localStyles.searchBar}
                    placeholder={'Search...'}
                    placeholderTextColor={theme.generalLayout.textColor}
                    returnKeyType={'search'}
                    secureTextEntry={false}
                    keyboardType={'default'}
                    value={this.state.searchQuery}
                    onChangeText={(text) => this.handleOnChange(text)}
                    onSubmitEditing={async () => {
                        await this.onSubmit(this.state.searchQuery)
                    }}
                    // onBlur={() => this.setState({showData: false})}
                />
                {
                    this.state.showData ?
                        !this.state.loading ?
                            <FlatList
                                data={this.state.searchData}
                                keyExtractor={item => item.id}
                                renderItem={({item}) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={(e) => {
                                            this.props.handleBarSelect(e, item.id);
                                            this.setState({showData:false})
                                        }}
                                        style={localStyles.autoCompBtn}
                                    >
                                        {
                                            item.image_url ?
                                                <Avatar.Image
                                                    source={{
                                                        uri: item.image_url
                                                    }}
                                                    style={localStyles.buisnessImage}
                                                    size={40}
                                                /> : null
                                        }
                                        <Text style={localStyles.nameTxt}>
                                            {item.name}
                                        </Text>
                                        <Text style={localStyles.addressTxt}>
                                            {(item.distance * MILES_PER_METER).toFixed(1)} mi. away
                                        </Text>

                                    </TouchableOpacity>
                                )}
                            /> : <ActivityIndicator
                                style={localStyles.autoCompLoader}
                                size={'large'}
                                color={theme.loadingIcon.color}
                            />
                        : null
                }
            </View>

        )
    }
}

const localStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: "center",
        width: '100%',
        elevation: 1,
        zIndex: 1,
    },
    font: {
        textShadowColor: 'black',
        textShadowOffset: {
            width: 20,
            height: 20
        },
        textShadowRadius: 20,
        color: theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font
    },
    searchBar: {
        borderBottomWidth: 3,
        borderBottomColor: theme.generalLayout.secondaryColor,
        width: '70%',
        marginHorizontal: 10,
        marginBottom: 15,
        alignItems: 'center',
        color: theme.generalLayout.textColor,
        justifyContent: 'center',
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowOffset: {
            width: 20,
            height: 20
        },
        textShadowRadius: 20,
        fontFamily: theme.generalLayout.font,
    },
    row: {
        flexDirection: 'row'
    },
    buisnessImage: {
        backgroundColor: 'lightgrey',
        marginLeft: -20,
    },
    autoCompBtn: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 3,
        borderWidth: .5,
        borderColor: theme.generalLayout.secondaryColor,
        flexDirection: 'row',
        marginVertical: 2,
    },
    nameTxt: {
        width: '43%',
        padding: 3,
        ...Platform.select({
            ios: {
                marginLeft: '2%'
            },
            android: {}
        }),
        alignItems: "center",
        justifyContent: 'center',
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowOffset: {
            width: 20,
            height: 20
        },
        color: theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font
    },
    addressTxt: {
        width: '33%',
        padding: 3,
        alignItems: "center",
        justifyContent: 'center',
        color: theme.generalLayout.textColor,
        fontSize: 12,
    },
    autoCompBtnContainer: {
        padding: 5,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: theme.generalLayout.secondaryColor,
        width: '100%',
    },
    autoCompLoader: {
        width: '90%',
        marginTop: 10,
        marginBottom: 5,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center'
    },
    autoCompleteContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.generalLayout.backgroundColor,
        maxHeight: 1000,
        padding: 5,
        borderWidth: 2,
        borderColor: theme.generalLayout.secondaryColor,
        width: '70%',
        marginTop: '-5%',
        zIndex: 1000,
        top: 37,
        position: 'absolute',
    }
})