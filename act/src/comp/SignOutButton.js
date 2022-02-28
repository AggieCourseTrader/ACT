import { signOut } from "firebase/auth";

function signOutFunction (auth) {
	signOut(auth).then(() => {
	  // Sign-out successful.
	  console.log("Sign out successful");
	}).catch((error) => {
	  // An error happened.
	  console.log("Sign out failed");
	});
}

function SignOutButton({ auth }) {
  return (
	<button onClick={() => {signOutFunction(auth)}}>Sign Out</button>
  )
}

export default SignOutButton