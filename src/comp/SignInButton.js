import { signInWithPopup, GoogleAuthProvider } from "../firebase-config"
import React, { useState } from 'react';

function SignInButton(props) {

	const [auth, setAuth] = useState(props.auth);
	const [provider, setProvider] = useState(props.provider);

	const signIn = () => {
		signInWithPopup(auth,provider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			// The signed-in user info.
			const user = result.user;
	
			console.log("Logged in as " + user.email);
			// ...
		}).catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
			console.log("Login failed");
			// ...
		});

	}

	return (
	  <button onClick={signIn}>Sign In</button>
	)
}
export default SignInButton