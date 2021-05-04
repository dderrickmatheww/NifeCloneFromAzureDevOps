import * as React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import theme from '../../../Styles/theme';

export default function IconWithBadge({ name, badgeCount, color, size, type , isDrawer}) {
  
    return (
      <View style={{ width: 30, height: size, marginLeft:isDrawer?12:0}}>
        {
          type == 'Ionicons' ?
            <Ionicons name={name} size={size} color={color} />
          : type == 'FontAwesome5' ?
            <FontAwesome5 name={name} size={size} color={color} />
          : type == 'FontAwesome' ?
            <FontAwesome name={name} size={size} color={color} />
          :
            <AntDesign name={name} size={size} color={color}/>
        }
        {badgeCount > 0 && (
          <View
            style={{
              // On React Native < 0.57 overflow outside of parent will not work on Android, see https://git.io/fhLJ8
              position: 'absolute',
              right:3,
              top: 0,
              backgroundColor: 'red',
              borderRadius: 6,
              width: 12,
              height: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.font, fontSize: 10, fontWeight: 'bold' }}>
              {badgeCount}
            </Text>
          </View>
        )}
      </View>
    );
  }