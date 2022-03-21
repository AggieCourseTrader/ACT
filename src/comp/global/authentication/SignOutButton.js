import { signOut } from "../../../firebase-config";
import React, { useState } from 'react';
import Button from '@mui/material/Button';
// import { useState } from 'react';


function SignOutButton(props) {

	const [auth/*, setAuth*/] = useState(props.auth);

	const signOutFunction = () => {
		signOut(auth).then(() => {
		// Sign-out successful.
			console.log("Sign out successful");
		}).catch((error) => {
			// An error happened.
			console.log("Sign out failed");
		});
	}
	
  return (
	<Button variant="contained" size="large" onClick={signOutFunction}
	  	sx={{height: "50px", width:"250px", background: "#FFFFFF", color: "#500000", "&.MuiButtonBase-root:hover": {
			bgcolor: "#d1d1d1"
		  }}}>
		  Sign Out
		</Button>
  )
}

export default SignOutButton