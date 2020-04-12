import React, { Component } from 'react';
import { styles } from '../Styles/style';
import { View } from 'react-native';
import FireBaseFacebookWindow from './Firebase/FacebookOAuth';

export default function ModalScreen() {
    return ( 
      <View>
        <FireBaseFacebookWindow/>
      </View>
    );
}