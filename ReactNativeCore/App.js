import * as React from 'react';
import Navigator from './src/routes/drawer';
import {decode, encode} from 'base-64';
import * as firebase from 'firebase';
import Util from './src/scripts/Util';
import themeUtil from './Styles/theme'
import {DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import {createStore} from "redux";
import {Provider} from 'react-redux'

if (! global.btoa) {global.btoa = encode}
if (! global.atob) {global.atob = decode}

//Intialize Firebase Database
firebase.initializeApp(Util.dataCalls.Firebase.config);

//TODO wrap with redux

const  initialState = {
  userData: null,
  friendData:null,
  friendRequests: null,
  businessData: null,
}

const reducer = (state = initialState, action) => {
  switch(action.type){
    case 'REFRESH':
      return {
        userData: action.data,
        friendData: action.data.friendData.acceptedFriends,
        friendRequests: action.data.friendData.requests,
        businessData: action.data.businessData,
      }
  }
    return state;
}

const store = createStore(reducer);


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
      <Provider store={store}>
        <Navigator />
      </Provider>
    </PaperProvider>
  );
}

