import * as React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../Styles/theme';
import { askAsync } from 'expo-permissions';

export default class AutoComplete extends React.Component { 

    state = {
        showAutoComplete: false,
        searchQuery: "",
        searchData: [],
        loading: true
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.autocompleteData !== this.props.autocompleteData) {
            this.setState({
                searchData: this.props.autocompleteData,
                loading: false
            })
        }
    }
    
    componentDidMount() {
        this.setState({
            searchData: this.props.autocompleteData
        })
    }

    showResults = async (text) => {
        await this.props.onSubmit(this.state.searchQuery);
        this.setState({
            showAutoComplete: true,
            searchQuery: text,
            searchData: this.props.autocompleteData,
            loading: true
        });
    }

    render() {
        return (
            <View style={localStyles.container} >
                <TextInput
                    style={localStyles.searchBar}
                    placeholder={this.props.placeHolderText}
                    placeholderTextColor={this.props.color}
                    returnKeyType={this.props.returnKey}
                    secureTextEntry={this.props.secureText}
                    keyboardType={this.props.keyboardType}
                    value={this.state.searchQuery}
                    onChangeText={(text) => {this.setState({
                        searchQuery: text
                    })}}
                    onSubmitEditing={() => { this.showResults(this.state.searchQuery)}}
                />
                
                    {
                        this.state.showAutoComplete ?
                            <ScrollView
                                contentContainerStyle={localStyles.autoCompleteContainer}
                            >
                                {
                                    !this.state.loading ?
                                        this.state.searchData.map((bar) => (
                                            <TouchableOpacity style={localStyles.autoCompBtn}>
                                                <Text style={localStyles.autoCompText}>{bar.name}</Text>
                                            </TouchableOpacity>
                                        ))
                                    :
                                    <ActivityIndicator 
                                        style={localStyles.autoCompLoader}
                                        size={'large'}
                                        color={"#D4DE24"}
                                    />
                                }
                            </ScrollView>
                        :
                            null
                    }
                
            </View>
        );
    }
}

  const localStyles = StyleSheet.create({
    container: {
        zIndex: 1000,
        alignItems: 'center',
        justifyContent:"center"
    },
    searchBar: {
        borderBottomWidth: 3,
        borderBottomColor: 'lightgrey',
        width: 350,
        height: 25,
        marginHorizontal:10,
        alignItems: 'center',
        color: theme.BLUE,
        justifyContent: 'center',
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowOffset: {
            width: 20, 
            height: 20
        },
        textShadowRadius: 20
    },
    autoCompBtn: {
        width: 350,
        marginTop: 10,
        marginBottom: 5,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightgrey',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: theme.LIGHT_PINK
    },
    autoCompLoader: {
        width: 350,
        marginTop: 10,
        marginBottom: 5,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center'
    },
    autoCompleteContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.DARK,
        maxHeight: 1000,
        padding: 5,
        borderWidth: 2,
        borderColor: 'lightgrey',
        width: 350,
        borderRadius: 2
    }
  })