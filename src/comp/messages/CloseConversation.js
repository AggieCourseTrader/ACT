import '../../config.js';
import React, { useEffect } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {arrayRemove, updateDoc, doc, setDoc, arrayUnion} from "firebase/firestore";
import {addReviews, db, deleteTrade, updateTradeStatus} from "../global/dbFunctions/CrudFunctions";
import {Avatar} from "@chatscope/chat-ui-kit-react"
import {TextField} from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const flexBoxStyle = {
  display: 'flex',
  flexDirection: 'row',
}

const submitReview = async (user, setActiveConversation, setActiveConversationObj, activeConversation, activeConversationObj, open, handleClose, setExperience, setReviewText, setSuccess, setNext, experience, success, reviewText) => {
  await writeReview(reviewText, user, activeConversationObj, Boolean(success), Boolean(experience));

  await updateDoc(doc(db, "messageStatus", user.uid), {
    "activeConversations": arrayRemove(activeConversationObj)
    // [g] : increment(1)
  });

  if(activeConversationObj?.status === "active") {
    const data = {
      "id": user.uid,
      "fname": user.displayName.split(" ")[0],
      "lname": user.displayName.split(" ")[1],
      "photoURL": user.photoURL,
      "addClass": activeConversationObj.dropClass,
      "addClassSection": activeConversationObj.dropClassSection,
      "dropClass": activeConversationObj.addClass,
      "dropClassSection": activeConversationObj.addClassSection,
      "status" : activeConversationObj.status,
      "tradeId": activeConversationObj.tradeId,

    };

    if(activeConversationObj?.creatorId) {
      data["creatorId"] = activeConversationObj.creatorId;
    }

    await updateDoc(doc(db, "messageStatus", activeConversation), {
      "activeConversations": arrayRemove(data)
    });

    data.status = "closed";

    await updateDoc(doc(db, "messageStatus", activeConversation), {
      "activeConversations": arrayRemove(data)
    });
    
    await setDoc(doc(db, "messageStatus", activeConversation), {
      "activeConversations" : arrayUnion(data)
    }, {merge : true});

  }
}
const view1 = (user,setActiveConversation,setActiveConversationObj,activeConversation,activeConversationObj,open,handleClose, setExperience, setReviewText, setSuccess, setNext, experience, success, reviewText, relist, setRelist) => {
  return (
    <>
      <div>
        <span style={{
          ...flexBoxStyle,
          justifyContent: 'center',
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Close Conversation
          </Typography>
        </span>

        <span style={{
          ...flexBoxStyle,
          justifyContent: 'center',
          marginBottom: "2em"
        }}>
          <Typography id="modal-modal-description" sx={{mt: 2}}>
            Are you sure you want to finalize this trade and close off the conversation
            with {activeConversationObj.fname}?
          </Typography>
        </span>

        <span style={{
          ...flexBoxStyle,
          justifyContent: "space-between",

        }}>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" onClick={() => {
            setNext(1)
          }}>
            Next : Review
          </Button>
        </span>

      </div>
    </>
  )
}

const view2 = (user,setActiveConversation,setActiveConversationObj,activeConversation,activeConversationObj,open,handleClose, setExperience, setReviewText, setSuccess, setNext, experience, success, reviewText, relist, setRelist) => {
  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <span style={{
          ...flexBoxStyle,
          justifyContent: 'center',
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Leave Feedback
          </Typography>
        </span>

        <span style={{
          ...flexBoxStyle,
          alignItems: 'center',
        }}>
          <Avatar src={activeConversationObj.photoURL} size="sm"/>
        <h4 style={{
          marginLeft: "0.5em",
          fontWeight: "normal",
        }}>
          {activeConversationObj.fname + " " + activeConversationObj.lname}
        </h4>
        </span>

        <TextField
            onChange={(e) => {
              setReviewText(e.target.value)
            }}
            style={{textAlign: 'left', marginBottom: "1.5em"}}
            hintText="Message Field"
            floatingLabelText="MultiLine and FloatingLabel"
            multiline
            rows={3}
            
        />

        <FormControl>
          <FormLabel id="question-experience">Did you have a positive experience with {activeConversationObj.fname}?</FormLabel>
          <RadioGroup
              row
              onChange={(v) => {
                setExperience(v.target.value)
              }}
              defaultValue={1}
          >
            <FormControlLabel value={1} control={<Radio/>} label="Yes"/>
            <FormControlLabel value="" control={<Radio/>} label="No"/>
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel id="question-experience">Was the trade successful?</FormLabel>
          <RadioGroup
              row
              onChange={(v) => {
                setSuccess(v.target.value)
              }}
          >
            <FormControlLabel value={1} control={<Radio/>} label="Yes"/>
            <FormControlLabel value="" control={<Radio/>} label="No"/>
          </RadioGroup>
        </FormControl>
        <span style={{
          ...flexBoxStyle,
          justifyContent: "space-between",
          marginTop: "2em",
        }}>
        <Button variant="contained" color="primary" onClick={() => {
          setNext(0)
        }}>
          Back
        </Button>
        <Button variant="contained" color="secondary" onClick={async (e) => {

          if(activeConversationObj?.creatorId === user.uid) {
            setNext(2);
          }
          else {
            await submitReview(user, setActiveConversation, setActiveConversationObj, activeConversation, activeConversationObj, open, handleClose, setExperience, setReviewText, setSuccess, setNext, experience, success, reviewText);
            (activeConversationObj?.tradeId) ? await updateTradeStatus(activeConversationObj?.tradeId, "closed"): null;
            setActiveConversation("");
            setActiveConversationObj({
              fname: "",
              lname: "",
              photoURL: "",
            });
            handleClose();
          }

        }}>

        {(activeConversationObj?.creatorId === user.uid) ? "Next : Relisting" : "Submit"}
        </Button>

        </span>
        
      </div>
    </>
  )
}

const view3 = (user,setActiveConversation,setActiveConversationObj,activeConversation,activeConversationObj,open,handleClose, setExperience, setReviewText, setSuccess, setNext, experience, success, reviewText, relist, setRelist) => {
  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <span style={{
          ...flexBoxStyle,
          justifyContent: 'center',
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Relist
          </Typography>
        </span>

        <span style={{
          ...flexBoxStyle,
          justifyContent: 'flex-start',
          marginTop: "1em",
          marginBottom: "1em"
        }}>
          <FormControl>
            <FormLabel id="question-experience">Do you want to relist the trade?</FormLabel>
            <RadioGroup
                row
                onChange={(v) => {
                  setRelist(v.target.value)
                }}
                defaultValue={
                  (success === "1") ?  "0" : "1"
                }
            >
              <FormControlLabel value={1} control={<Radio/>} label="Yes"/>
              <FormControlLabel value={0} control={<Radio/>} label="No"/>
            </RadioGroup>
          </FormControl>
        </span>

        <span style={{
          ...flexBoxStyle,
          justifyContent: "space-between",

        }}>
          <Button variant="contained" color="primary" onClick={()=> {setNext(1)}}>
            Back
          </Button>


          <Button variant="contained" color="secondary" onClick={async () => {
            handleClose();
            setNext(0);
            if(activeConversationObj?.tradeId && relist === "1" && activeConversationObj?.creatorId === user.uid) {
              await setDoc(doc(db, "trades", activeConversationObj?.tradeId), {
                status : "requested",
                matchID : "-1"
              }, {merge: true})
            }
            else if(activeConversationObj?.tradeId && relist === "0") {
              deleteTrade(activeConversationObj?.tradeId);
            }

            
            if(activeConversationObj?.creatorId === user.uid) {
              await submitReview(user, setActiveConversation, setActiveConversationObj, activeConversation, activeConversationObj, open, handleClose, setExperience, setReviewText, setSuccess, setNext, experience, success, reviewText);
              setActiveConversation("");
              setActiveConversationObj({
                fname: "",
                lname: "",
                photoURL: "",
              });
            }
          }}>
            Submit
          </Button>
        </span>

      </div>
    </>
  )
}

const writeReview = async (text, user, activeConversationObj, tradeSuccess, positiveExperience) => {
  // We need to get the trade id from firestore
  if (!("tradeId" in activeConversationObj)) {
    return;
  }

  const f = await addReviews(user.uid, text, activeConversationObj.tradeId, tradeSuccess, positiveExperience, activeConversationObj.id);

  return f;
}
export default function CloseConversation({
                                            user,
                                            setActiveConversation,
                                            setActiveConversationObj,
                                            activeConversation,
                                            activeConversationObj,
                                            open,
                                            handleClose
                                          }) {

  const [next, setNext] = React.useState(0);

  const [reviewText, setReviewText] = React.useState("");
  const [experience, setExperience] = React.useState("1");
  const [success, setSuccess] = React.useState("");
  const [relist, setRelist] = React.useState("1");

  useEffect(() => {
    if(activeConversationObj?.status === "closed") {
      setNext(1);
    }
  }, [activeConversationObj]);
  return (
      <>
        <Modal
            open={open} 
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {
              (() => {
                switch(next) {
                  case 0:
                    return view1(user,setActiveConversation,setActiveConversationObj,activeConversation,activeConversationObj,open,handleClose, setExperience, setReviewText, setSuccess, setNext, experience, success, reviewText, relist, setRelist);
                  case 1:
                    return view2(user,setActiveConversation,setActiveConversationObj,activeConversation,activeConversationObj,open,handleClose, setExperience, setReviewText, setSuccess, setNext, experience, success, reviewText, relist, setRelist);
                  case 2:
                    return view3(user,setActiveConversation,setActiveConversationObj,activeConversation,activeConversationObj,open,handleClose, setExperience, setReviewText, setSuccess, setNext, experience, success, reviewText, relist, setRelist);
                }
              })()
            }

          </Box>
        </Modal>
      </>
  );
}