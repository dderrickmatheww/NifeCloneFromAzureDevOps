import * as React from 'react';
import { Text, View } from 'react-native';
import MapTab  from '../../MapTab';

export default function MapScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <MapTab />
    </View>
  );
}