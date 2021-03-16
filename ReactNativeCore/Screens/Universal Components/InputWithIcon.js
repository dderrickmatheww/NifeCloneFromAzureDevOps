import * as React from 'react';
import * as Device from 'expo-device';
import { View, TextInput, Text, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import {
  Avatar
} from 'react-native-paper';
import theme from '../../Styles/theme';

let TouchableOpacity;
if(Device.osName == "Android") {
    TouchableOpacity = require('react-native-gesture-handler').TouchableOpacity;
}
else {
    TouchableOpacity = require('react-native').TouchableOpacity;
}

export default class InputWithIcon extends React.Component { 
  
  state = {
    showAutoComplete: false,
    searchQuery: "",
    searchData: [],
    loading: true,
    isAutoComplete: false
  }
  
  componentDidMount() {
    this.setState({
      isAutoComplete: this.props.autocomplete ? true : false
    });
  }
  componentWillUnmount() {
    this.setState({
      showAutoComplete: false
    });
  }

  onBlur = () => {
    this.setState({
      showAutoComplete: false,
      loading: true
    });
  }

  handleBarSelect = (id) => {
    this.setState({
      showAutoComplete: false,
      searchData: [],
      loading: true
    });
    this.props.PopUpBarModel(null, id, this.state.searchData);
  }

  showResults = (text) => {
    this.setState({
      showAutoComplete: true
    });
    this.props.onSubmit(text, (searchRes) => {
      this.setState({
        searchData: searchRes,
        loading: false
      });
    });
  }

  render() {
    return (
      this.state.isAutoComplete ?
        <View style={localStyles.container} >
          <TextInput
              style={localStyles.searchBar}
              placeholder={this.props.placeHolderText}
              placeholderTextColor={this.props.color}
              returnKeyType={this.props.returnKey}
              secureTextEntry={this.props.secureText}
              keyboardType={this.props.keyboardType}
              value={this.state.searchQuery}
              onChangeText={(text) => {
                if(text == "") {
                  this.setState({
                    showAutoComplete: false,
                    searchQuery: text
                  });
                }
                else{
                  this.setState({
                    searchQuery: text
                  });
                }
              }}
              onSubmitEditing={() => { 
                if(this.state.searchQuery == "") {
                  this.setState({
                    showAutoComplete: false
                  });
                }
                else{
                  this.showResults(this.state.searchQuery);
                }
              }}
          />
          {
            this.state.showAutoComplete ?
                <View
                    style={localStyles.autoCompleteContainer}
                >
                  {
                    !this.state.loading ?
                      <FlatList
                        data={this.state.searchData}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            key={Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}
                            onPress={() => { this.handleBarSelect(item.id); }}
                            style={localStyles.autoCompBtn}
                          >
                            { 
                              item.image_url ? 
                                <Avatar.Image 
                                  source={{
                                    uri:  item.image_url  
                                  }}
                                  style={localStyles.buisnessImage}
                                  size={45}
                                />
                              :
                                null
                            }
                            <Text
                              style={localStyles.nameTxt}
                            >
                              {item.name}
                            </Text>
                            { 
                              typeof item.distance !== 'undefined' ?
                                  <Text
                                    style={localStyles.addressTxt}
                                  >
                                      {item.distance} mi. away
                                  </Text>
                              :
                               null
                            }
                          </TouchableOpacity>
                        )}
                        keyExtractor={item => item.id}
                      />
                    :
                    <ActivityIndicator 
                        style={localStyles.autoCompLoader}
                        size={'large'}
                        color={theme.loadingIcon.color}
                    />
                  }
              </View>
            :
                null
          }
      </View>
      :
        <View style={{ width: '100%', height: 24, margin: 10 }}>
          <TextInput
            style={localStyles.font}
            placeholder={this.props.placeHolderText}
            placeholderTextColor={this.props.color}
            returnKeyType={this.props.returnKey}
            secureTextEntry={this.props.secureText}
            keyboardType={this.props.keyboardType}
            selectionColor={this.props.color}
            value={this.props.value}
            onChangeText={(text) => this.props.onChangeText(text, type)}
            onSubmitEditing={(text, eventCount, target) => this.props.onSubmit(text, eventCount, target)}
          />
        </View>
      );
    }
  }

  const localStyles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent:"center",
      width: '100%'
  },
  font: {
    textShadowColor: 'black',
    textShadowOffset: {
        width: 20, 
        height: 20
    },
    textShadowRadius: 20,
    color: theme.GOLD
  },
  searchBar: {
      borderBottomWidth: 3,
      borderBottomColor: theme.GOLD,
      width: '90%',
      marginHorizontal: 10,
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
  row: {
    flexDirection: 'row'
  },
  buisnessImage: {
    width: '20%',
    alignItems: "flex-start",
    justifyContent: 'flex-start',
    backgroundColor: 'lightgrey',
  },
  autoCompBtn: {
      width: 350,
      marginTop: 10,
      marginBottom: 5,
      marginTop: 5,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'lightgrey',
      borderRadius: 3,
      borderWidth: 3,
      borderColor: theme.DARK_PINK,
      flexDirection: 'row'
  },
  nameTxt: {
    width: '43%',
    padding: 3,
    alignItems: "center",
    justifyContent: 'center',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: {
        width: 20, 
        height: 20
    }
  },
  addressTxt: {
    width: '33%',
    padding: 3,
    alignItems: "center",
    justifyContent: 'center'
  },
  autoCompBtnContainer: {
    padding: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: theme.LIGHT_PINK,
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
      backgroundColor: theme.DARK,
      maxHeight: 1000,
      padding: 5,
      borderWidth: 2,
      borderColor: 'lightgrey',
      width: '90%',
  }
  })