import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDFdcdTdIQdPo93smcmuMwjwk_aNVGJ7jg",
    authDomain: "help-desk-ee58d.firebaseapp.com",
    projectId: "help-desk-ee58d",
    storageBucket: "help-desk-ee58d.appspot.com",
    messagingSenderId: "586325393377",
    appId: "1:586325393377:web:47833c94d0649aa7c59ca0",
    measurementId: "G-F8801EDWGR"
  };
  
  if(!firebase.apps.lengh){
    firebase.default.initializeApp(firebaseConfig);
  }

  export default firebase;