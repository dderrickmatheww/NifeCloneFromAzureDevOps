import * as React from 'react';
import Navigator from './src/routes/drawer';
import {decode, encode} from 'base-64';
import * as firebase from 'firebase';
import Util from './src/scripts/Util';
import themeUtil from './Styles/theme'
import {DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

if (! global.btoa) {global.btoa = encode}
if (! global.atob) {global.atob = decode}

//Intialize Firebase Database
firebase.initializeApp(Util.dataCalls.Firebase.config);



const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: themeUtil.generalLayout.backgroundColor,
    accent: themeUtil.generalLayout.secondaryColor,
    background : themeUtil.generalLayout.backgroundColor,
    placeholder: themeUtil.generalLayout.textColor
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

