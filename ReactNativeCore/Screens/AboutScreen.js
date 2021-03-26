import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme  from '../Styles/theme';
import DrawerButton from '../Screens/Universal Components/DrawerButton';


AboutScreen = ({navigation}) =>
<View style={styles.viewDark}>
    <DrawerButton drawerButtonColor={theme.generalLayout.secondaryColor} onPress={() => navigation.openDrawer()} ></DrawerButton>
    <Text style={styles.titleVice}>About Nife</Text>
</View>
  
  const localStyles = StyleSheet.create({ 
    titleVice: {
        fontSize: 36,
        marginBottom: 16,
        color: theme.generalLayout.textColor,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: theme.generalLayout.font
    },
  })

export default AboutScreen;