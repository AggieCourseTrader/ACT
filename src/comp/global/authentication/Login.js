import '../../../config.js';
import React, { useState, useEffect, useContext} from 'react';
import SignInButton from './SignInButton';
import { auth, onAuthStateChanged, GoogleAuthProvider } from "../../../firebase-config";
import { doesUserExist } from '../dbFunctions/CrudFunctions' 
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useNavigate } from "react-router-dom";
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TermsContext from './TermsContext'

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
 
 const {termContext,setTermContext} = useContext(TermsContext)
 const navigate = useNavigate();
 const classes = useStyles();

useEffect(() => {
  onAuthStateChanged(auth, (user) => {
    if(user) {
      (async () => {
        let doesUser = await doesUserExist(user.uid);
        console.log(doesUser)
        if(doesUser) {
          setTermContext(true)
          navigate("/marketplace")
        } else {
          navigate("/terms")
        }
      })(); 
    }
  });
},)

 var provider = new GoogleAuthProvider();
  // provider.setCustomParameters({
  //   'hd': 'tamu.edu'
  // });

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
      <Grid container sx={{ height: '100vh' }}>
          <Grid item xs={12} sm={5} md={4} lg={4}
          sx={{background: "#500000"}}>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                  <Typography component="h1" variant="h6" color="#FFFFFF" align="center" marginBottom="3%">Sign in with your TAMU account</Typography>
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
                  <Typography component="h1" variant="h2" align="left" marginBottom="3%">Welcome to Aggie Course Trader</Typography>
                  <Card sx={{ minWidth: 400, marginRight: '10%', marginBottom: '2%' }}>
                    <CardContent>
                      <Typography variant="h6" align="left" marginBottom='2%'>An app built for TAMU students</Typography>
                      <Typography variant="body1" align="left" marginBottom='2%'>Meet the app tailored for TAMU students to help ease the stress of course registration.</Typography>
                    </CardContent>
                  </Card>
                  <Card sx={{ minWidth: 400, marginRight: '10%', marginBottom: '2%' }}>
                    <CardContent>
                      <Typography variant="h6" align="left" marginBottom='2%'>Search for and add trades to the marketplace</Typography>
                      <Typography variant="body1" align="left" marginBottom='2%'>In 3 easy steps, you can search for trades on the markeplace hub, create your own trades, and match with other peoples trades.</Typography>
                    </CardContent>
                  </Card>
                  <Card sx={{ minWidth: 400, marginRight: '10%', marginBottom: '2%' }}>
                    <CardContent>
                      <Typography variant="h6" align="left" marginBottom='2%'>Built in Chat System</Typography>
                      <Typography variant="body1" align="left" marginBottom='2%'>Once you find a match, you can use the built-in private and secure chat system to work out trade details with other students.</Typography>
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