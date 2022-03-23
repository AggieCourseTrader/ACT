import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import {onAuthStateChanged, auth} from '../../firebase-config'
import CourseSearchBox  from '../global/courseSearchBox/CourseSearchBox'
import { updateTrade, createTrade, deleteTrade, db } from '../global/dbFunctions/CrudFunctions';
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
    justifyContent: 'center',
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
  const [addClass, setAddClass] = useState ({class:'', section: '', crn: ''});
  const [dropClass, setDropClass] = useState({class:'', section: '', crn: ''});

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

  const selectionAddCallback = (data) => {
    if(data !== undefined){
      if(typeof data === 'object') {
        if(data.name){
          setAddClass({...addClass, class:data.name})
        } else if (data.section) {
          setAddClass({...addClass, section:data.section, crn:data.crn})
        } 
      }
    }
  }

  const selectionDropCallback = (data) => {
    if(data !== undefined){
      if(typeof data === 'object'){
        if(data.name){
          setDropClass({...dropClass, class:data.name})
        } else if (data.section) {
          setDropClass({...dropClass, section:data.section, crn:data.crn})
        } 
      }
    } 
  }


  const tradeAddUpdate = () => {
    //console.log(userId.uid)
    //console.log(addClass.crn)
   // console.log(dropClass.crn)
    (async () => {
      let resp = await createTrade(userId.uid, dropClass.crn, addClass.crn);
      console.log(resp)
    })();
  }

  const tradeDelete = () => {
    (async () => {
      let resp = await deleteTrade(userId.uid, dropClass.crn, addClass.crn);
    })();
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
          <Typography component="h2" variant="h6" color="primary" gutterBottom>I want a spot in</Typography>  
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.containerDrop}>
            <CourseSearchBox db={db} selectionCallBack={selectionAddCallback}/>
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.container}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>I can drop</Typography>  
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.containerDrop}>
            <CourseSearchBox db={db} selectionCallBack={selectionDropCallback} />
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