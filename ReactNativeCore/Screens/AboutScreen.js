import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../Styles/style';
import DrawerButton from '../Screens/Universal Components/DrawerButton';


AboutScreen = ({navigation}) =>
<View style={styles.viewDark}>
    <DrawerButton drawerButtonColor="#eca6c4" onPress={() => navigation.openDrawer()} ></DrawerButton>
    <Text style={styles.titleVice}>About Nife</Text>
</View>
  


export default AboutScreen;