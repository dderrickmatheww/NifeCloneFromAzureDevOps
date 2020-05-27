import React from 'react';
import * as firebase from 'firebase';

async function FireBaseNifeLogin (signUpInfo, loginInfo, callBack) {
  let dataObj = {};
  // Listen for authentication state to change.
  if(signUpInfo) {
    try {
      let email = signUpInfo.email;
      let password = signUpInfo.password1
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            if(error) {
              var errorMessage = error.message;
              callBack(null, errorMessage)
            }
        });
        dataObj['data'] = null;
        dataObj['token'] = null;
        dataObj['user'] = firebase.auth().currentUser;
        callBack(dataObj);
    } catch ({ message }) {
        alert(`Nife Sign-up Error: ${message}`);
    }
  }
  else {
    try {
      let email = loginInfo.email;
      let password = loginInfo.password1
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            if(error) {
              var errorMessage = error.message;
              callBack(null, errorMessage)
            }
        });
        dataObj['data'] = null;
        dataObj['token'] = null;
        dataObj['user'] = firebase.auth().currentUser;
        callBack(dataObj);
    } catch ({ message }) {
        alert(`Nife Login Error: ${message}`);
    }
  }
}
export default FireBaseNifeLogin;