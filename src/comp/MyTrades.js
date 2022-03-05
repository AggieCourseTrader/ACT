import React, {useEffect} from 'react';
// import { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import {onAuthStateChanged, auth} from '../firebase-config'
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
// import { mainListItems, secondaryListItems } from './listItems';
// import Chart from './Chart';
import MyListings from './MyListings';
import MyMatches from './MyMatches';
import Navbar from "./Navbar";
import Footer from "./Footer";

const mdTheme = createTheme();

function MyTrades() {

  // const [count, setCount] = useState(0);

  let navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // const uid = user.uid;
      } else {
        navigate("/")
      }
    });

  }, /*removed dependency array*/)

  return (
      <div>
        <Navbar/>
        <ThemeProvider theme={mdTheme}>
          <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <Box
                component="main"
                sx={{
                  backgroundColor: (theme) =>
                      theme.palette.mode === 'light'
                          ? theme.palette.grey[100]
                          : theme.palette.grey[900],
                  flexGrow: 1,
                  height: '80vh',
                  overflow: 'auto',
                }}
            >
              <Container maxWidth="lg" sx={{mt: 5, mb: 5}}>
                <Grid container spacing={3}>
                  {/* My Listings */}
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Paper
                        sx={{
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          height: 400,
                        }}
                    >
                      <MyListings/>
                    </Paper>
                  </Grid>
                  {/* My Matches */}
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Paper
                        sx={{
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          height: 400,
                        }}
                    >
                      <MyMatches/>
                    </Paper>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          </Box>
        </ThemeProvider>
        <Footer/>
      </div>
  );
}

export default MyTrades;