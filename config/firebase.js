import *as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyAOzTbfBF-OKBvpVeF1836lCT4oZ6c-GVg",
    authDomain: "family-gps-tracker-13265.firebaseapp.com",
    databaseURL: "https://family-gps-tracker-13265.firebaseio.com",
    projectId: "family-gps-tracker-13265",
    storageBucket: "family-gps-tracker-13265.appspot.com",
    messagingSenderId: "788976380343"
  };
  firebase.initializeApp(config);

  export default firebase;
