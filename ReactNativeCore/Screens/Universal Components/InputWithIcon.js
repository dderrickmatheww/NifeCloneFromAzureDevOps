import * as React from 'react';
import { View, TextInput, SafeAreaView } from 'react-native';
import { Autocomplete } from 'react-native-dropdown-autocomplete';
import { Ionicons } from '@expo/vector-icons';

export default function InputWithIcon({ name, color, size, placeHolderText, returnKey, secureText, onChangeText, type, keyboardType, value, styles, onSubmit, autocomplete, autocompleteData, onCallback}) {
    return (
      <View style={{ width: '100%', height: 24, margin: 10 }}>
       
        {
          autocomplete ? 
            <SafeAreaView style={styles}>
              <Autocomplete
                data={autocompleteData}
                handleSelectItem={(item, id) => onCallback(item, id)}
              />
            </SafeAreaView>
          :
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
        }
      </View>
    );
  }

  