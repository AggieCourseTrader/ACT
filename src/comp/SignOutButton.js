import { signOut } from "../firebase-config";
import React from 'react';
// import { useState } from 'react';


function SignOutButton(props) {
	// const [auth, setAuth] = useState(props.auth);


	const signOutFunction = () => {
		signOut(props.auth).then(() => {
		// Sign-out successful.
			console.log("Sign out successful");
		}).catch((error) => {
			// An error happened.
			console.log("Sign out failed");
		});
	}
	

  return (
	<button onClick={signOutFunction}>Sign Out</button>
  )
}

export default SignOutButton