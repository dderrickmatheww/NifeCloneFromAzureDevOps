import * as React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InputWithIcon({ name, color, size, placeHolderText, returnKey, secureText, onChangeText, type, keyboardType, value, styles, onSubmit }) {
    return (
      <View style={{ width: '100%', height: 24, margin: 10 }}>
        <TextInput
            style={styles}
            placeholder={placeHolderText}
            placeholderTextColor={'lightgrey'}
            returnKeyType={returnKey}
            secureTextEntry={secureText}
            keyboardType={keyboardType}
            inlineImageLeft={
                <Ionicons
                    name={name}
                    size={size}
                    color={color}
                />
            }
            value={value}
            onChangeText={(text) => onChangeText(text, type)}
            onSubmitEditing={(text, eventCount, target) => onSubmit(text, eventCount, target)}
        />
      </View>
    );
  }
