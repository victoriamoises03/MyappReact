import app from "firebase/app";

import firebase from 'firebase';



const firebaseConfig = {
  apiKey: "AIzaSyA5O-LnUcNz8mWj2p1OYZ1KC87Qs5f3iMc",
  authDomain: "proyectofinalp3-aa4fb.firebaseapp.com",
  projectId: "proyectofinalp3-aa4fb",
  storageBucket: "proyectofinalp3-aa4fb.appspot.com",
  messagingSenderId: "817599454772",
  appId: "1:817599454772:web:cdb806be4c398fa19af461"
};


app.initializeApp(firebaseConfig);

export const auth =firebase.auth();
export const storage = app.storage();
export const db = app.firestore();








