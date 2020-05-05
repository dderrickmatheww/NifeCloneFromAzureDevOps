import * as React from 'react';
import { Text, View } from 'react-native';
import WhatsPoppinTab from '../../WhatsPoppinTab';

export default function WhatsPoppinScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <WhatsPoppinTab />
      </View>
    );
}