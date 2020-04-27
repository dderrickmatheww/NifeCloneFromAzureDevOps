import * as React from 'react';
import { Text, View } from 'react-native';
import HomeTab from '../../HomeTab';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <HomeTab />
    </View>
  );
}