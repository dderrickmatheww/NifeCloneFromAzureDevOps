import * as React from 'react';
import * as Device from 'expo-device';
import { View, TextInput, Text, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
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

  handleBarSelect = (id) => {
    this.setState({
      showAutoComplete: false,
      searchData: [],
      loading: true
    })
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
                this.setState({
                  searchQuery: text
                });
              }}
              onSubmitEditing={() => { 
                this.showResults(this.state.searchQuery);
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
                            <Text
                              style={localStyles.nameTxt}
                            >
                              {item.name}:
                            </Text>
                            { 
                              item.location.address1 !== '' ?
                                  <Text
                                    style={localStyles.addressTxt}
                                  >
                                      {item.location.address1}, {"\n"}
                                      {item.location.city}
                                  </Text>
                              :
                                <Text
                                  style={localStyles.addressTxt}
                                >
                                  No address available!
                                </Text>
                            }
                          </TouchableOpacity>
                        )}
                        keyExtractor={item => item.id}
                      />
                    :
                    <ActivityIndicator 
                        style={localStyles.autoCompLoader}
                        size={'large'}
                        color={"#D4DE24"}
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
            style={this.props.styles}
            placeholder={this.props.placeHolderText}
            placeholderTextColor={this.props.color}
            returnKeyType={this.props.returnKey}
            secureTextEntry={this.props.secureText}
            keyboardType={this.props.keyboardType}
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
      justifyContent:"center"
  },
  searchBar: {
      borderBottomWidth: 3,
      borderBottomColor: 'lightgrey',
      width: '80%',
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
  autoCompBtn: {
      width: 350,
      marginTop: 10,
      marginBottom: 5,
      marginTop: 5,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'lightgrey',
      flexDirection: 'row'
  },
  nameTxt: {
    padding: 3,
    alignItems: "flex-start",
    justifyContent: 'flex-start'
  },
  addressTxt: {
    padding: 3,
    alignItems: "center",
    justifyContent: 'flex-start'
  },
  autoCompBtnContainer: {
    padding: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: theme.LIGHT_PINK,
    width: '100%',
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