import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import {onAuthStateChanged, auth} from '../firebase-config'
import CourseSearchBox  from './CourseSearchBox'
import { updateTrade, createTrade, deleteTrade, db } from './CrudFunctions';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


const useStyles = makeStyles({
  wrapper: {
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    textAlign: "center",
    marginTop: "1%"
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: "center",
    width: '100%',
    marginRight: "10%",
    marginLeft: "10%",
    flexWrap: 'wrap',
  },
  containerDrop: {
    justifyContent: 'space-evenly',
    display: 'flex',
    alignItems: "center",
    width: '100%',
    marginRight: "10%",
    marginLeft: "10%",
    flexWrap: 'wrap',
  },
});



function EditTrades() {
  const [userId, setUserId] = useState(null);
  const [addClass, setAddClass] = useState (null);
  const[ dropClass, setDropClass] = useState(null);

  const classes = useStyles();
  let navigate = useNavigate();

 useEffect(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserId(user)
    } else {
      navigate("/")
    }
   });

  },/*removed dependency array*/)


  const tradeAddUpdate = () => {
    console.log("teAddUpSst");
  }

  const tradeDelete = () => {
    console.log("delete");
  }

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        <div className={classes.container}>
          <Typography component="h2" variant="h5" color="primary" gutterBottom>Edit Trades</Typography>  
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.container}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>Course to Add</Typography>  
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.containerDrop}>
            <CourseSearchBox db={db} />
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.container}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>Course to drop</Typography>  
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.containerDrop}>
            <CourseSearchBox db={db} />
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.container}>
        <Typography variant='h6' color="primary" gutterBottom>
          You have created a trade where you want class A and willing to drop class B.
        </Typography> 
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.container}>
          <Button sx={{marginRight: "1%"}}variant="outlined" size="large" onClick={tradeDelete}>Delete Trade</Button>
          <Button variant="contained" size="large" onClick={tradeAddUpdate}>Submit Trade</Button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default EditTrades;