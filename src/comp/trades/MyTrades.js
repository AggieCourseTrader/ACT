import React, { useEffect, useContext } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged, auth } from '../../firebase-config'
import {doesUserExist} from "../global/dbFunctions/CrudFunctions"
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MyListings from './MyListings';
import MyMatches from './MyMatches';
import Navbar from "../global/navbar/Navbar";
import Footer from "../global/Footer";
import TermsContext from '../global/authentication/TermsContext'

import { useResponsive } from '@farfetch/react-context-responsive';
import './myTrades.css';
const getSize = (lT) => {
  if(lT.sm) {
    return 'xs';
  }
  else if(lT.md) {
    return 'sm';
  }
  else if(lT.lg) {
    return 'md';
  }
  else if(lT.xl) {
    return 'lg';
  }
  else {
    return 'xl';
  }
}


function MyTrades() {
  const { lessThan } = useResponsive();
  let navigate = useNavigate();
  const [user, setUser] = useState(false);
  const {termContext,setTermContext} = useContext(TermsContext)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user) {
        if(termContext) {
         setUser(user);
        } else {
          (async () => {
            let doesUser = await doesUserExist(user.uid);
            if(doesUser) {
              setTermContext(true)
            } else {
              navigate("/terms")
            }
          })(); 
        }
      } else {
        navigate("/")
      }
     });
    }, /*removed dependency array*/)

  // 
  return (
      <React.Fragment>
        <Navbar name="My Trades" auth={auth} user={user}/>
          <Box sx={{display: 'flex', height:'80vh', background: "#f6f6f6"}}>
            <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  overflow: 'auto',
                }}
            >
              <Container maxWidth="lg" sx={{mt: 5, mb: 5}}>
                <Grid container spacing={3}>
                  {/* My Listings */}
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Paper
                      className={"paper " + getSize(lessThan)}
                        // sx={{
                        //   p: 2,
                        //   height: {
                        //     xs: 300,
                        //     sm: 500,
                        //   },
                        // }}
                    >
                      <MyListings userId={user.uid}/>
                    </Paper>
                  </Grid>
                  {/* My Matches */}
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Paper
                      className={"paper " + getSize(lessThan)}
                    >
                      <MyMatches user={user}/>
                    </Paper>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          </Box>
        <Footer/>
      </React.Fragment>
  );
}

export default MyTrades;