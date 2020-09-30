import * as React from 'react';
import { View, TextInput, SafeAreaView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../Styles/theme';

export default class AutoComplete extends React.Component { 

    state = {
        showAutoComplete: false,
        searchQuery: "",
        searchData: []
    }

    showResults = (text) => {
        // Auto Complete while typing code, commented out for future updates

        // let resultArr = [];
        // for(i = 0; i < this.props.autocompleteData.length; i++) {
        //     if(this.props.autocompleteData[i].includes(text)) {
        //         resultArr.push(this.props.autocompleteData[i]);
        //     }
        // }
        this.setState({
            // searchData: resultArr,
            showAutoComplete: true,
            searchQuery: text
        })
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
                    onChangeText={(text) => this.showResults(text)}
                    onSubmitEditing={() => { this.props.onSubmit(this.state.searchQuery)}}
                />
                {
                    this.state.showAutoComplete && this.state.searchData.length > 0 ?
                        this.state.searchData.map((bar) => {
                            <TouchableOpacity>
                                <Text>{bar.name}</Text>
                            </TouchableOpacity>
                        })
                    :
                        null
                }
            </View>
        );
    }
}

  const localStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        marginTop: '-165%'
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
    }
  })