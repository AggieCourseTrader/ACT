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
  const [alert, setAlert] = useState(null)
  //const [isUpdate, setIsUpdate] = useState(false)

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
        setAddClass({class:'', section: '', crn: '' })
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
      setDropClass({class:'', section: '', crn: '' })
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
    <React.Fragment>
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
            <CourseSearchBox db={db} selectionCallBack={selectionAddCallback} />
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
            <CourseSearchBox db={db} selectionCallBack={selectionDropCallback} />
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
    </React.Fragment>
  );
}

export default EditTrades;