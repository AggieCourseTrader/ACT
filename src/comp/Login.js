import React, { useState } from 'react';
import SignInButton from './SignInButton';
import { auth, onAuthStateChanged, GoogleAuthProvider } from "../firebase-config";
// import { useNavigate } from "react-router-dom";

function Login() {
 // ALl javascript, functiosn, or fetchs to db will be up here

 const [loggedIn, setLogIn] = useState(false);
 const [user, setUser] = useState(false);
 // const navigate = useNavigate();

 onAuthStateChanged(auth, (user) => {
   if (user) {
     // User is signed in, see docs for a list of available properties
     // https://firebase.google.com/docs/reference/js/firebase.User
     // const uid = user.uid;
     setLogIn(true);
     setUser(user);
     //navigate("/marketplace")
   } else {
     // User is signed out
     setLogIn(false);
     setUser(false);
   }
 });

 var provider = new GoogleAuthProvider();
  provider.setCustomParameters({
  'hd': 'tamu.edu'
  });


  return (
    <div>
       <div>
        {loggedIn ? (
          <>
            Logged in as {user.email}
          </>
        ) : (
          <>
            Must sign in with TAMU email before able to use application
            <SignInButton auth={auth} provider={provider} />
          </>
        )}

      </div>
    </div>
  );
}
export default Login;