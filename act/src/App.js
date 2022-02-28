import './App.css';
import Navbar from './comp/Navbar';
import EditTrades from'./comp/EditTrades';
import MyTrades from  './comp/MyTrades';
import Marketplace from './comp/Marketplace';
import Login from './comp/Login';
import Footer from './comp/Footer';
import { BrowserRouter, Routes, Route,} from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AccessAlarm, ThreeDRotation } from '@mui/icons-material';
import React, { useState } from 'react';


//1 Firebase config -----------------------------------------------------//
// * Firebase imports and init
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, onAuthStateChanged} from "firebase/auth";
import SignInButton from './comp/SignInButton';
import SignOutButton from './comp/SignOutButton';

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
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


var provider = new GoogleAuthProvider();
const auth = getAuth(app);
provider.setCustomParameters({
  'hd': 'tamu.edu'
});
//1 ---------------------------------------------------------------------//

function App() {
  const [loggedIn, setLogIn] = useState(false);
  const [user, setUser] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      setLogIn(true);
      setUser(user);
      // ...
    } else {
      // User is signed out
      setLogIn(false);
      setUser(false);
    }
  });

  return (
    <BrowserRouter>

      <Navbar/>

      <Routes>
        <Route exact path="/" element={<Marketplace />}/>
        <Route exact path="/my-trades" element={<MyTrades />}/>
        <Route exact path="/edit-trades" element={<EditTrades />}/>
        <Route exact path="/login" element={<Login />}/>
      </Routes>

      <div className="App">
        {loggedIn ? (
          <>
            Logged in as {user.displayName}
            <SignOutButton auth={auth} />
          </>
        ) : (
          <>
            Not logged in
            <SignInButton auth={auth} provider={provider} />
          </>
        )}

      </div>
      <Footer/>
    </BrowserRouter>

  );
}

export default App;
