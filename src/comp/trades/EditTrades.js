import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import {onAuthStateChanged, auth} from '../../firebase-config'
import CourseSearchBox  from '../global/courseSearchBox/CourseSearchBox'
import {createTrade, deleteTrade, db, getTradeId} from '../global/dbFunctions/CrudFunctions';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit'
import Alert from '@mui/material/Alert';
import { Box } from '@mui/system';


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



function EditTrades(props) {
  const [userId, setUserId] = useState(null);
  const [addClass, setAddClass] = useState (props.add);
  const [dropClass, setDropClass] = useState(props.drop);
  const [alert, setAlert] = useState(null)
  const [isUpdate, setIsUpdate] = useState(props.update)
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
        } else if (data.crn) {
          setAddClass({...addClass, section:data.section, crn:data.crn})
        } 
      } else {
        setAddClass({class:null, section: null, crn: null })
      }
    }
  }

  const selectionDropCallback = (data) => {
    if(data !== undefined){
      if(typeof data === 'object'){
        if(data.name){
          setDropClass({...dropClass, class:data.name})
        } else if (data.crn) {
          setDropClass({...dropClass, section:data.section, crn:data.crn})
        } 
      }
    } else {
      setDropClass({class:null, section:null, crn:null})
    }
  }


  const tradeAddUpdate = () => {
    if(dropClass.crn !== '' && addClass.crn !== '' && (addClass.crn !== dropClass.crn)) {
        (async () => {
          let resp = await createTrade(userId.uid, dropClass.crn, addClass.crn);
          console.log(resp)
          setAlert(<Alert severity="success">Congrats your trade was created</Alert>)
        })();
    } else {
      setAlert(<Alert severity="error">All dropdowns must be filled to create a trade</Alert>)
    }
  }

  const tradeDelete = () => {
    if(dropClass.crn !== '' && addClass.crn !== '' && (addClass.crn !== dropClass.crn)) {
      (async () => {
        let tradeId = await getTradeId(userId.uid, dropClass.crn, addClass.crn);
        let del = await deleteTrade(tradeId);
        console.log(del)
        setAlert(<Alert severity="success">Congrats your trade was deleted</Alert>);
      })();
    } else {
      setAlert(<Alert severity="error">No Trade was deleted, make sure all dropdowns are filled and have correct info</Alert>);
    }
  }

  return (
    <Box sx={{   
      position: 'absolute',
      bgcolor: '#f6f6f6',
      border: '2px solid #000',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 900,
      boxShadow: 24,}}>
      <div className={classes.wrapper}>
        <div className={classes.container}>
          <EditIcon/>
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.container}>
          <Typography sx = {{
                fontSize : "4vmin",
                color : "#500000",
                fontWeight: "lighter"
            }}>I want a spot in </Typography>  
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.containerDrop}>
            <CourseSearchBox db={db} selectionCallBack={selectionAddCallback} defaultData={addClass}/>
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.container}>
          <Typography sx = {{
                fontSize : "4vmin",
                color : "#500000",
                fontWeight: "lighter"
            }}>I can drop</Typography>   
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.containerDrop}>
            <CourseSearchBox db={db} selectionCallBack={selectionDropCallback} defaultData={dropClass} />
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.container}>
          <Button sx={{marginRight: "1%"}}variant="outlined" size="large" onClick={tradeDelete}>Delete Trade</Button>
          <Button variant="contained" size="large" onClick={tradeAddUpdate}>Submit Trade</Button>
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.container}>
          <div className="Alert">{alert}</div>
        </div>
      </div>
    </Box>
  );
}

export default EditTrades;