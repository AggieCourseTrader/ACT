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
import Privacy from '../../../assets/PrivacyPolicy.pdf'
import ToS from '../../../assets/ToS.pdf'

const useStyles = makeStyles({
    wrapper: {
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      textAlign: "center",
      marginTop: "1%",
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
    containerList: {
        display: 'flex',
        justifyContent: 'start',
        textAlign: 'left',
        width: '100%',
        marginRight: "10%",
        marginLeft: "10%",
        flexWrap: 'wrap',
      },
    list: {
        listStyleType: 'lower-alpha'
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
           if(termContext) {
            navigate("/marketplace")
           }
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
                    <Typography id="modal-modal-title" variant="h3">General Guidelines</Typography>
                </div>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.containerList}>
                    <Typography id="modal-modal-title" variant="h6">
                     Course Trading 
                    </Typography>
                </div>
            </div><div className={classes.wrapper}>
                <div className={classes.containerList}>
                    <ol className={classes.list}>
                       <Typography id="modal-modal-title" variant="body1">
                            <li>Aggie Course Trader does not support actual course trading within the TAMU system.</li>
                            <li>This application only facilitates user interactions for them to do it on their own.</li>
                            <li>We are not responsible for any failing trade or for another party backing out or not going through with a agreed upon trade in our app.</li>
                            <li>Warning, some classes have waitlists or other advisor oversight that can lead to a failure of trade. We recommend you check the class on howdy before dropping or adding any class.</li>
                        </Typography>
                    </ol>
                </div>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.containerList}>
                    <Typography id="modal-modal-title" variant="h6">
                      Privacy
                    </Typography>
                </div>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.containerList}>
                    <ol className={classes.list}>
                       <Typography id="modal-modal-title" variant="body1">
                            <li>Select user TAMU information will be stored. The only info stored is first and last name, plus your tamu email address.</li>
                            <li>All reviews will use your first and last name and will not be anonymous, and there is no option to be anonymous.</li>
                        </Typography>
                    </ol>
                </div>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.containerList}>
                    <Typography id="modal-modal-title" variant="h6">
                     Honor Code
                    </Typography>
                </div>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.containerList}>
                       <Typography id="modal-modal-title" variant="body1">
                            An Aggie does not lie, cheat or steal or tolerate those who do.
                        </Typography>
                </div>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.containerList}>
                    <Typography id="modal-modal-title" variant="caption">
                        View our full <a href={Privacy} target="_blank">Privacy Policy</a> and <a href={ToS} target="_blank">Terms of Service</a>
                    </Typography>
                </div>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                <Checkbox
                    onChange={handleCheck}
                />
                <Typography id="modal-modal-title" variant="body1">By checking this box I agree to the above</Typography>
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