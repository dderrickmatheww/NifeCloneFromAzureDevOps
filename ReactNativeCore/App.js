import * as React from 'react';
import Navigator from './src/stacks/drawer';
import {decode, encode} from 'base-64';
import * as firebase from 'firebase';
import Util from './src/scripts/Util';
import themeUtil from './Styles/theme'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { createStore } from "redux";
import { Provider } from 'react-redux'

if (! global.btoa) {global.btoa = encode}
if (! global.atob) {global.atob = decode}

//Intialize Firebase Database
firebase.initializeApp(Util.dataCalls.Firebase.config);

console.disableYellowBox = true;
const initialState = {
  userData: null,
  friendData: null,
  friendRequests: null,
  businessData: null,
  yelpData: null,
  feedData: null
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'REFRESH':
      return {
        userData: ( 
          action.data ? 
            action.data 
          : 
            state.userData ?
              state.userData 
            :
              null
          ),
        friendData: ( 
          action.data ? 
            action.data.friendData ? 
              action.data.friendData.acceptedFriends 
            : 
            null 
          : 
          state.friendData ?
            state.friendData.acceptedFriends ?
                state.friendData.acceptedFriends
              :
                null
            :
            null 
        ),
        friendRequests: (
          action.data ? 
            action.data.friendData ?  
            action.data.friendData.requests ?
            action.data.friendData.requests
            :
            {}
          : 
          state.friendData ?
          state.friendData.requests ? 
                state.friendData.requests 
              : 
                {}
            : 
              {} 
          : 
          state.friendData.requests ? 
              state.friendData.requests 
            : 
              {}
        ),
        businessData: ( action.data ? action.data.businessData : state.businessData ? state.businessData : null ),
        feedData: action.feed ? action.feed : state.feedData
      }
    case 'YELPDATA':
      return {
        yelpData: action.data ? action.data : null
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

