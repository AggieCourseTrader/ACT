import React, { useState} from 'react';
import CourseSearchBox  from '../global/courseSearchBox/CourseSearchBox'
import {createTrade, deleteTrade, db, updateTrade} from '../global/dbFunctions/CrudFunctions';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit'
import { useSnackbar } from 'notistack';
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
  const [addClass, setAddClass] = useState (props.add);
  const [dropClass, setDropClass] = useState(props.drop);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const classes = useStyles();

  const selectionAddCallback = (data) => {
    if(data !== undefined){
      if(typeof data === 'object') {
        if(data.name){
          setAddClass({...addClass, class:data.name})
        } else if (data.crn) {
          setAddClass({...addClass, section:data.section, crn:data.crn})
        } 
      } 
    } else {
      setAddClass(undefined)
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
      setDropClass(undefined)
    }
  }


  const tradeAddUpdate = () => {
    if(dropClass !== undefined && addClass !== undefined) {
        (async () => {
          if(props.tradeId !== undefined) {
            if(dropClass.crn && addClass.crn && (dropClass.crn !== addClass.crn)) {
              let resp = await updateTrade(props.tradeId, dropClass.crn, addClass.crn);
              console.log(resp)
              enqueueSnackbar('Trade Updated', {variant: 'success'});
              props.handleClose();
            } else {
              enqueueSnackbar('Please fill all dropdowns and make sure the drop and add courses are different', {variant: 'info'});
            }
          } else if(dropClass.crn && addClass.crn && (dropClass.crn !== addClass.crn)) {
            let resp = await createTrade(props.userId, dropClass.crn, addClass.crn);
            console.log(resp)
            enqueueSnackbar('Trade Created', {variant: 'success'});
            props.handleClose();
          } else {
            enqueueSnackbar('Please fill all dropdowns and make sure the drop and add courses are different', {variant: 'info'});
          }
        })();
    } else {
     enqueueSnackbar('Please fill all dropdowns and make sure the drop and add courses are different', {variant: 'info'});
    }
  }

  const tradeDelete = () => {
    if(props.tradeId) {
      (async () => {
          let del = await deleteTrade(props.tradeId);
          console.log(del)
          enqueueSnackbar('Trade Deleted', {variant: 'success'});
          props.handleClose();
      })();
    } else {
      enqueueSnackbar('Trade not found', {variant: 'error'});
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