import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../Styles/style';
import DrawerButton from '../Screens/Universal Components/DrawerButton';



HomeTab = ({navigation}) =>

<View style={styles.viewDark}>
    <DrawerButton drawerButtonColor="#eca6c4" onPress={() => navigation.openDrawer()} ></DrawerButton>
    <Text style={styles.titleVice}>My Feed</Text>
</View>
  


export default HomeTab;