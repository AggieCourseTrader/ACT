import React, { useState } from 'react';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';
import { auth, onAuthStateChanged, GoogleAuthProvider } from "../firebase-config";
import { addUser } from './CrudFunctions' 


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
  
  if (loggedIn) {
    addUser (user.email, user.displayName, user.uid);
  }


  return (
    <div>
       <div>
        {loggedIn ? (
          <>
            Logged in as {user.email}
            <SignOutButton auth={auth} />
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