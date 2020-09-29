import * as React from 'react';
import { View, TextInput } from 'react-native';
import { Autocomplete } from 'react-native-dropdown-autocomplete';
import { Ionicons } from '@expo/vector-icons';

export default function InputWithIcon({ name, color, size, placeHolderText, returnKey, secureText, onChangeText, type, keyboardType, value, styles, onSubmit, autocomplete, autocompleteData}) {
    return (
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
        {
          autocomplete ? 
          <View> 
            <Autocomplete
              data={autocompleteData}
              handleSelectItem={(item, id) => this.handleSelectItem(item, id)}
            />
          </View>
          :
          null
        }
      </View>
    );
  }