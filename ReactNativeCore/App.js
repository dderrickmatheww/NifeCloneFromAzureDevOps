import * as React from 'react';
import Navigator from './routes/drawer';
import {decode, encode} from 'base-64';
import * as firebase from 'firebase';
import Util from './scripts/Util';
import Loading from './Screens/AppLoading';
import { Provider as PaperProvider } from 'react-native-paper';

//Intialize Firebase Database
firebase.initializeApp(Util.dataCalls.Firebase.config);

if (! global.btoa) {global.btoa = encode}

if (! global.atob) {global.atob = decode}
var loadingDone = false;

// const theme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: 'tomato',
//     accent: 'yellow',
//   },
// };


export default function App() {

  return(
    <PaperProvider
      // theme={theme}
    >
      <Navigator />
    </PaperProvider>
      
  );
}

