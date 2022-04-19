import React, {useState, useEffect, useContext} from 'react';
import {addUser} from '../dbFunctions/CrudFunctions'
import Checkbox from '@mui/material/Checkbox';
import {useNavigate} from "react-router-dom";
import Typography from '@mui/material/Typography';
import {makeStyles} from '@mui/styles';
import {auth, onAuthStateChanged} from "../../../firebase-config";
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
    // flexWrap: 'wrap',
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
  const {termContext, setTermContext} = useContext(TermsContext)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        if (termContext) {
          navigate("/marketplace")
        }
      } else {
        navigate("/")
      }
    });

  },)


  const handleCheck = () => {
    if (checked) {
      setChecked(false)
    } else {
      setChecked(true)
    }
  }

  const handleSubmit = () => {
    if (checked) {
      addUser(user.email, user.displayName, user.uid, user.photoURL);
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
        </div>
        <div className={classes.wrapper}>
          <div className={classes.containerList}>
            <ol className={classes.list}>
              <Typography id="modal-modal-title" variant="body1">
                <li>Aggie Course Trader is not affiliated with the TAMU System.</li>
                <li>Aggie Course Trader does not support actual course trading/registration on "Howdy".</li>
                <li>This platform is solely a tool to facilitate student interaction for the purpose of course
                  trading.
                </li>
                <li>No party (including TAMU System and Aggie Course Trader developers) can be held responsible for any
                  actions taken by any users on this platform, including (but not limited to):
                </li>
                <ol>
                  <li>
                    Incomplete trades due to...
                  </li>
                  <ol>
                    <li>
                      Course registration time conflicts for either student.
                    </li>
                    <li>
                      Course registration timeslot open/close for either student.
                    </li>
                    <li>
                      Malicious actions by either student.
                    </li>
                    <li>
                      Attempting to trade a "waitlisted" course.
                    </li>
                  </ol>
                  <li>
                    Communication between students.
                  </li>
                  <li>
                    Incidents that may occur due to the fact that profiles are public and not anonymous.
                  </li>
                </ol>

                <li>
                  Trading, messaging, and all other activity on this platform is at your own risk. It is highly
                  recommended that you verify information (by requesting links to screenshots to prove course
                  registration, timeslots,
                  etc...) before trading with another student.
                </li>
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
                <li>
                  We store only the bare necessary information from your Google profile (name, email and avatar) to
                  facilitate course trading. We do not share your information for any purposes (including
                  advertisement).
                </li>
                <li>
                  There is no expectation of privacy on this platform. All actions taken on this platform are logged for
                  accountability purposes. Trades, reviews, and messages between users are stored on servers
                  indefinitely.
                </li>
                <li>
                  Every effort has been made to introduce transparency to the platform. Only TAMU students with a
                  current TAMU email account are able to interact on this platform. Users can expect trades, reviews
                  and messages between other users to be legitimate.
                </li>
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
              "An Aggie does not lie, cheat or steal or tolerate those who do."
            </Typography>
          </div>
          <br/>
          <div className={classes.containerList}>
            <Typography id="modal-modal-title" variant="body1">
              Be advised that malicious action is not tolerated on this platform and may be subject to subsequent action
              by the Aggie Honor System.
            </Typography>
          </div>
          <br/>
        </div>
        <div className={classes.wrapper}>
          <div className={classes.containerList}>
            <Typography id="modal-modal-title" variant="h6">
              Full Privacy Policy and Terms of Service
            </Typography>
          </div>
        </div>
        <div className={classes.wrapper}>
          <div className={classes.containerList}>
            <Typography id="modal-modal-title" variant="caption">
              Available here: <a href={Privacy} target="_blank">Privacy Policy</a> – <a href={ToS} target="_blank">Terms
              of Service</a>
            </Typography>
          </div>
        </div>
        <div className={classes.wrapper}>
          <br/>
          <div className={classes.container}>
            <Checkbox
                onChange={handleCheck}
            />
            <Typography id="modal-modal-title" variant="body1">By clicking here, I agree to the conditions as stated
              above, in the Privacy Policy, and Terms of Service.</Typography>
          </div>
          <br/>
        </div>
        <div className={classes.wrapper}>
          <div className={classes.container}>
            <Button
                variant='contained'
                onClick={handleSubmit}
            >
              Let's trade
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