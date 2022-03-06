import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import {onAuthStateChanged, auth} from '../firebase-config'
import CourseSearchBox  from './CourseSearchBox'
import { db } from './CrudFunctions'

import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Card, CardActions, CardContent, Button } from '@mui/material';
import Navbar from './Navbar';
import AddClassSelect from './AddClassSelect';
import DropClassSelect from './DropClassSelect';
import AddCourseSelect from './AddCourseSelect';
import DropCourseSelect from './DropCourseSelect';
function Marketplace() {
  // Declare a new state variable, which we'll call "count"
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

  return (
    <div>
      < Navbar name = "Trade Markteplace" auth={auth} user={user}/>
      <div style = {{marginTop: 80, marginLeft: 10, marginRight: 10}}>
        <Box>
            <Box sx = {{display: "flex", justifyContent: "space-evenly", m: 2}}>
              <AddClassSelect/>
              <DropClassSelect/>
            </Box>
            <Box sx = {{display: "flex", justifyContent: "space-evenly", m: 2}}>
              <AddCourseSelect/>
              <DropCourseSelect/>
            </Box>
            <Box sx = {{
              border: 2,
              borderRadius: 2,
              marginLeft: 25,
              marginRight: 25
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
      </div>
    </div>
  );
}

export default Marketplace;