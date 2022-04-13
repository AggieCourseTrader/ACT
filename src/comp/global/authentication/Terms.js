import React, { useState, useEffect, useContext} from 'react';
import { addUser } from '../dbFunctions/CrudFunctions' 
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { auth, onAuthStateChanged} from "../../../firebase-config";
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import TermsContext from './TermsContext';

const useStyles = makeStyles({
    wrapper: {
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      textAlign: "center",
      marginTop: "2%"
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: "center",
      width: '100%',
      marginRight: "10%",
      marginLeft: "10%",
      flexWrap: 'wrap',
    }
  });

function TermsPage() {
    const navigate = useNavigate();
    const classes = useStyles();
    const [user, setUser] = useState(false);
    const [checked, setChecked] = useState(false);
    const [alert, setAlert] = useState(null);
    const {termContext,setTermContext} = useContext(TermsContext)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
           setUser(user);
          } else {
            navigate("/")
          }
         });
       
    }, /*removed dependency array*/)
     

    const handleCheck = () => {
        if(checked){
            setChecked(false)
        } else {
            setChecked(true)
        }
    }

    const handleSubmit = () => {
        if(checked) {
            addUser (user.email, user.displayName, user.uid, user.photoURL);
            setTermContext(true)
            navigate("/marketplace")
        } else {
            setAlert(<Alert severity="error">You must agree to our terms of service by checking the box</Alert>)
        }
    }

    return (
        <React.Fragment>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <Typography id="modal-modal-title" variant="h2">Terms of Service</Typography>
                </div>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <Typography id="modal-modal-title" variant="body1">
                        i AGree to not be a dick
                    </Typography>
                </div>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                <Checkbox
                    onChange={handleCheck}
                />
                <Typography id="modal-modal-title" variant="body1">By checking this box i agree to the terms of service above</Typography>
                </div>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                <Button
                        variant = 'contained'
                        onClick={handleSubmit}
                    >
                    Submit
                </Button>
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
export default TermsPage;