import * as React from 'react';
import Navigator from './routes/drawer';
import {decode, encode} from 'base-64';
import * as firebase from 'firebase';
import Util from './scripts/Util';
import theme from './Styles/theme'
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
    primary: theme.generalLayout.backgroundColor,
    accent: theme.generalLayout.secondaryColor,
    background : theme.generalLayout.backgroundColor,
    placeholder: theme.generalLayout.textColor
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

