import * as React from 'react';

import Navigator from './routes/drawer';


function wrapme() {
// function CustomDrawerContent(props, { navigation }) {
//   return (
//     <DrawerContentScrollView {...props}>
//       <DrawerItemList {...props} />
//       <DrawerItem
//         label="Help"
//         onPress={() => navigation.jumpTo('Nerby', { owner: 'Satya' })}
//       />
//     </DrawerContentScrollView>
//   );
// }

// function Home({ navigation }) {
//   return (
//     <View style={styles.viewDark}>
//       <HomeScreen />
//     </View>
//   );
// }

// function Map({ navigation }) {
  
//   return (
//     <View style={styles.viewDark}>
//       <MapScreen></MapScreen>
//     </View>
//   );
// }

// function WhatsPoppinScreen({ navigation }) {
//   return (
//     <View style={styles.viewDark}>

//       <WhatsPoppinTab />
//     </View>
//   );
// }

// function IconWithBadge({ name, badgeCount, color, size }) {
//   return (
//     <View style={{ width: 24, height: 24, margin: 5 }}>
//       <Ionicons name={name} size={size} color={color} />
//       {badgeCount > 0 && (
//         <View
//           style={{
//             // On React Native < 0.57 overflow outside of parent will not work on Android, see https://git.io/fhLJ8
//             position: 'absolute',
//             right: -6,
//             top: -3,
//             backgroundColor: 'red',
//             borderRadius: 6,
//             width: 12,
//             height: 12,
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}
//         >
//           <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
//             {badgeCount}
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// }

// function HomeIconWithBadge(props) {
//   // Here we can pass in badge data to the home icon
//   return <IconWithBadge {...props} badgeCount={3} />;
// }

// function MapIconWithBadge(props) {
//   // Here we can pass in badge data to the map icon
//   return <IconWithBadge {...props} badgeCount={1} />;
// }

// function BeerIconWithBadge(props) {
//   // Here we can pass in badge data to the whatspoppin icon
//   return <IconWithBadge {...props} badgeCount={1} />;
// }


// const Drawer = createDrawerNavigator();

// export default function App() {
//   const[location, setLocation] = useState(null);
//   Location.requestPermissionsAsync()
//   return (
//     <NavigationContainer>
//       <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} initialRouteName="My Feed" drawerType={'back'} drawerStyle={{
//     backgroundColor: '#20232a', color: "white",
//     width: 180,
//   }}>    
//         <Drawer.Screen style={styles.viewDark} name="Nearby" component={ Map } />
//         <Drawer.Screen name="My Feed" component={ Home } />
//         <Drawer.Screen name="Whats Poppin'?" component={ WhatsPoppinScreen } />
//       </Drawer.Navigator>
//     </NavigationContainer>
//   );
// }

}

export default function App() {
  return(
    <Navigator/>
  );
}