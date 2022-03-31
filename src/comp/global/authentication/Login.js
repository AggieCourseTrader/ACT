import React from 'react';
import SignInButton from './SignInButton';
import { auth, onAuthStateChanged, GoogleAuthProvider } from "../../../firebase-config";
import { addUser } from '../dbFunctions/CrudFunctions' 


// import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useNavigate } from "react-router-dom";
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const useStyles = makeStyles({
  wrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    color: '#500000',
    justifyContent: 'center',
    alignItems: "center",
    marginBottom: "2%",
    marginTop: "1%",
    width: '100%',
  },
  containerBlock: {
    display: 'block',
    color: '#500000',
    marginRight: "10%",
    marginLeft: "15%",
    width: '100%',
  },
});

function Login() {
 // ALl javascript, functiosn, or fetchs to db will be up here

// const [loggedIn, setLogIn] = useState(false);
 //const [user, setUser] = useState(false);
 const navigate = useNavigate();
 const classes = useStyles();

 onAuthStateChanged(auth, (user) => {
   if (user) {
     // User is signed in, see docs for a list of available properties
     // https://firebase.google.com/docs/reference/js/firebase.User
     // const uid = user.uid;
    // setLogIn(true);
     //setUser(user);
     addUser (user.email, user.displayName, user.uid, user.photoURL);
     navigate("/marketplace")
   } else {
     // User is signed out
     //setLogIn(false);
     //setUser(false);
     console.log("fail");
   }
 });

 var provider = new GoogleAuthProvider();
 // TODO - reinstate this
  // provider.setCustomParameters({
  // 'hd': 'tamu.edu'
  // });

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
      <Grid container sx={{ height: '100vh' }}>
          <Grid item xs={12} sm={5} md={4} lg={4}
          sx={{background: "#500000"}}>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                  <Typography component="h1" variant="h6" color="#FFFFFF" align="center" gutterBottom='true'>Sign In with your tamu account</Typography>  
                </div>
                <div className={classes.container}>
                  <SignInButton auth={auth} provider={provider} />
                </div>
              </div>
          </Grid>
          <Grid item xs={12} sm={7} md={8} lg={8}
           sx={{background: "#f6f6f6"}}>
              <div className={classes.wrapper}>
                <div className={classes.containerBlock}>
                  <Typography component="h1" variant="h2" align="left" gutterBottom='true'>Welcome to Aggie Course Trader</Typography>  
                  <Card sx={{ minWidth: 400, marginRight: '10%', marginBottom: '3%' }}>
                    <CardContent>
                      <Typography variant="h6" align="left" gutterBottom='true'>An app built for students</Typography> 
                      <Typography variant="body1" align="left" gutterBottom='true'>Future details on the app and pictures to showcase to the user</Typography> 
                    </CardContent>
                  </Card>
                  <Card sx={{ minWidth: 400, marginRight: '10%', marginBottom: '3%' }}>
                    <CardContent>
                      <Typography variant="h6" align="left" gutterBottom='true'>Search and add trades to the marketplace</Typography> 
                      <Typography variant="body1" align="left" gutterBottom='true'>Future details on the app and pictures to showcase to the user</Typography> 
                    </CardContent>
                  </Card>
                  <Card sx={{ minWidth: 400, marginRight: '10%', marginBottom: '3%' }}>
                    <CardContent>
                      <Typography variant="h6" align="left" gutterBottom='true'>Built in Chat System</Typography> 
                      <Typography variant="body1" align="left" gutterBottom='true'>Future details on the app and pictures to showcase to the user</Typography> 
                    </CardContent>
                  </Card>
                </div>
              </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
export default Login;