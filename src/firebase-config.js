import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, 
    signInWithPopup, signOut } from "firebase/auth";

import{  getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
    apiKey: "AIzaSyBSCaZ13T9nckWzjRKfVlmgsMq7-S4xRBY",
    authDomain: "act-dev-1.firebaseapp.com",
    databaseURL: "https://act-dev-1-default-rtdb.firebaseio.com",
    projectId: "act-dev-1",
    storageBucket: "act-dev-1.appspot.com",
    messagingSenderId: "729474256375",
    appId: "1:729474256375:web:c58ef58fff165b233832f2",
    measurementId: "G-T2S3H96TZN"
  };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {
    auth,
    app,
    signInWithPopup,
    analytics,
    onAuthStateChanged,
    GoogleAuthProvider,
    signOut,
    db
};