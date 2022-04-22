import * as React from 'react';
import NifeApp from './src/components/Nife/Nife';
import {decode, encode} from 'base-64';
import {Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux'
import { LogBox } from 'react-native';
import {store} from "./src/store/store";
import {paperTheme} from "./src/styles/paperTheme";

// Ignore log notification by message
LogBox.ignoreAllLogs();

if (! global.btoa) {global.btoa = encode}
if (! global.atob) {global.atob = decode}

export default function App() {
  return(
    <PaperProvider
      theme={paperTheme}
    >
      <Provider store={store}>
        <NifeApp />
      </Provider>
    </PaperProvider>
  );
}

