import '../../../config.js';
import { signInWithPopup } from "../../../firebase-config"
// import { GoogleAuthProvider } from "../firebase-config"
import Button from '@mui/material/Button';
import React, { useState } from 'react';

function SignInButton(props) {

	const [auth/*, setAuth*/] = useState(props.auth);
	const [provider/*, setProvider*/] = useState(props.provider);

	const signIn = () => {
		signInWithPopup(auth,provider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			// const credential = GoogleAuthProvider.credentialFromResult(result);
			// const token = credential.accessToken;
			// The signed-in user info.
			const user = result.user;
			// ...
		}).catch((error) => {
			// Handle Errors here.
			// const errorCode = error.code;
			// const errorMessage = error.message;
			// The email of the user's account used.
			// const email = error.email;
			// The AuthCredential type that was used.
			// const credential = GoogleAuthProvider.credentialFromError(error);
			console.error(error);
			// ...
		});

	}

	return (
		<Button variant="contained" size="large" onClick={signIn}
	  	sx={{height: "50px", width:"250px", background: "#FFFFFF", color: "#500000", "&.MuiButtonBase-root:hover": {
			bgcolor: "#d1d1d1"
		  }}}>
		  Get Trading
		</Button>
	)
}
export default SignInButton