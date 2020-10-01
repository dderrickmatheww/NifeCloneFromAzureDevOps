import * as React from 'react';
import { View, TextInput, SafeAreaView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AutoComplete from '../Universal Components/AutoComplete';
import theme from '../../Styles/theme';

export default function InputWithIcon({ name, color, size, placeHolderText, returnKey, secureText, onChangeText, type, keyboardType, value, styles, onSubmit, autocomplete, autocompleteData, onCallback}) {
 
  return (
    autocomplete ?
      <AutoComplete autocompleteData={autocompleteData} onSubmit={(text) => { onSubmit(text) }} placeHolderText={placeHolderText} color={color} returnKey={returnKey} secureText={secureText} keyboardType={keyboardType}/>
    :
      <View style={{ width: '100%', height: 24, margin: 10 }}>
        <TextInput
          style={styles}
          placeholder={placeHolderText}
          placeholderTextColor={color}
          returnKeyType={returnKey}
          secureTextEntry={secureText}
          keyboardType={keyboardType}
          value={value}
          onChangeText={(text) => onChangeText(text, type)}
          onSubmitEditing={(text, eventCount, target) => onSubmit(text, eventCount, target)}
        />
      </View>
    );
  }

  const localStyles = StyleSheet.create({
    
  })