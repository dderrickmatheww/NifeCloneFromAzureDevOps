import * as React from 'react';
import Navigator from './routes/drawer';
import {decode, encode} from 'base-64';
import * as firebase from 'firebase';
import Util from './scripts/Util';
import themeUtil from './Styles/theme'
import {DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

if (! global.btoa) {global.btoa = encode}
if (! global.atob) {global.atob = decode}

//Intialize Firebase Database
firebase.initializeApp(Util.dataCalls.Firebase.config);

console.disableYellowBox = true;

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: themeUtil.DARK,
    accent: themeUtil.LIGHT_PINK,
    background : themeUtil.DARK,
    placeholder: themeUtil.LIGHT_PINK_OPAC
  },
};


export default function App() {
  return(
    <PaperProvider
      theme={theme}
    >
      <Navigator />
    </PaperProvider>
      
  );
}

