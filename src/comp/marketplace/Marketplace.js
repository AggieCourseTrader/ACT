import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import {onAuthStateChanged, auth} from '../../firebase-config'
import CourseSearchBox  from '../global/courseSearchBox/CourseSearchBox'
import { db } from '../global/dbFunctions/CrudFunctions'
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Card, CardActions, CardContent, Button } from '@mui/material';
import Navbar from '../global/navbar/Navbar';
import Footer from "../global/Footer";
function Marketplace({setUserId}) {
  // Declare a new state variable, which we'll call "count"
  let navigate = useNavigate();
  const [user, setUser] = useState(false);

  useEffect(() => {
   onAuthStateChanged(auth, (user) => {
     if (user) {
      setUser(user);
      setUserId(user.uid);
     } else {
       navigate("/")
     }
    });

   }, /*removed dependency array*/)

  return (
    <div>
      <Navbar name = "Trade Markteplace" auth={auth} user={user}/>
      <Box sx={{ flexGrow: 1, height: '80vh', background: '#f6f6f6'}}>
        <Box sx={{ flexGrow: 1}}>
            <Box sx = {{display: "flex", justifyContent: "center", flexWrap : "wrap", m: 2}}>

              <Typography sx = {{
                fontSize : "4vmin",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                color : "#525252"
              }}>I want a spot in </Typography>

              <CourseSearchBox db={db} />

            </Box>
            <Box sx = {{display: "flex", justifyContent: "center", m: 2}}>

            <Typography sx = {{
                fontSize : "4vmin",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                color : "#525252"
              }}>I can drop </Typography>

              <CourseSearchBox db={db} />
            </Box>
          </Box>
          <Box sx = {{
            border: 2,
            borderRadius: 2,
            marginLeft: "15%",
            marginRight: '15%'
          }}>              
            <Card sx = {{border: 1, display: "flex", borderColor: "#D3D3D3"}}>
                <CardContent sx={{flexGrow:1}}>
                  <Typography sx = {{fontSize: 20}}>
                    CSCE 482: 501 for CSCE 421: 203
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant = "outlined">
                    Trade
                  </Button>
                </CardActions>
              </Card>
              <Card sx = {{border: 1, display: "flex", borderColor: "#D3D3D3"}}>
                <CardContent sx={{flexGrow:1}}>
                  <Typography sx = {{fontSize: 20}}>
                    MATH 152: 203 for MATH 152: 201
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant = "outlined">
                    Trade
                  </Button>
                </CardActions>
              </Card>
              <Card sx = {{border: 1, display: "flex", borderColor: "#D3D3D3"}}>
                <CardContent sx={{flexGrow:1}}>
                  <Typography sx = {{fontSize: 20}}>
                    CSCE 411: 201 for CSCE 421: 203
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant = "outlined">
                    Trade
                  </Button>
                </CardActions>
              </Card>
              <Card sx = {{border: 1, display: "flex", borderColor: "#D3D3D3"}}>
                <CardContent sx={{flexGrow:1}}>
                  <Typography sx = {{fontSize: 20}}>
                    ENGR 102: 200 for CHEM 107: 211
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant = "outlined">
                    Trade
                  </Button>
                </CardActions>
              </Card>
              <Card sx = {{border: 1, display: "flex", borderColor: "#D3D3D3"}}>
                <CardContent sx={{flexGrow:1}}>
                  <Typography sx = {{fontSize: 20}}>
                    CSCE 222: 206 for CSCE 221: 208
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant = "outlined">
                    Trade
                  </Button>
                </CardActions>
              </Card>
            </Box>
            <Box sx = {{textAlign: "center", m: 2}}>
              <Button variant = "outlined" justifyContent = "center">
                Create Trade
              </Button>
            </Box>
        </Box>
      <Footer/>
    </div>
  );
}

export default Marketplace;