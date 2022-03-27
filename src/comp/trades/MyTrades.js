import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged, auth } from '../../firebase-config'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MyListings from './MyListings';
import MyMatches from './MyMatches';
import Navbar from "../global/navbar/Navbar";
import Footer from "../global/Footer";

function MyTrades() {

  let navigate = useNavigate();
  const [user, setUser] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
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
                        sx={{
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          height: {
                            xs: 300,
                            sm: 500,
                          },
                        }}
                    >
                      <MyListings userId={user.uid}/>
                    </Paper>
                  </Grid>
                  {/* My Matches */}
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Paper
                        sx={{
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          height: {
                            xs: 300,
                            sm: 500,
                          },
                        }}
                    >
                      <MyMatches userId={user.uid}/>
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