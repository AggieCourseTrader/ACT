import React from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {arrayRemove, updateDoc, doc} from "firebase/firestore";
import {addReviews, db, getTradeId} from "../global/dbFunctions/CrudFunctions";
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
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const writeReview = async (text, user, activeConversationObj, tradeSuccess, positiveExperience) => {
  // We need to get the trade id from firestore
  if(!("tradeId" in activeConversationObj)) {
    return;
  }

  const f = await addReviews(user.uid, text, activeConversationObj.trade_id, tradeSuccess, positiveExperience);

  return f;
}
export default function CloseConversation({user, setActiveConversation, setActiveConversationObj, activeConversation, activeConversationObj, open, handleClose}) {

  const [next, setNext] = React.useState(false);

  const [reviewText, setReviewText] = React.useState("");
  const [experience, setExperience] = React.useState("");
  const [success, setSuccess] = React.useState("");

  return (
      <>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {(next === false) ?
                <div>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Close Conversation
                  </Typography>
                  <Typography id="modal-modal-description" sx={{mt: 2}}>
                    Are you sure you want to finalize this trade and close off the conversation
                    with {activeConversationObj.fname}?
                  </Typography>
                  <br></br>
                  <Button variant="contained" color="primary" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => {
                    setNext(true)
                  }}>
                    Next
                  </Button>
                </div>
              :
                <div>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Leave Feedback
                  </Typography>
                  <Avatar src={activeConversationObj.photoURL}/>
                  {activeConversationObj.fname + " " + activeConversationObj.lname}
                  <br></br>
                  <TextField
                      onChange={(e) => {
                        setReviewText(e.target.value)
                      }}
                      style={{textAlign: 'left'}}
                      hintText="Message Field"
                      floatingLabelText="MultiLine and FloatingLabel"
                      multiline
                      rows={3}
                  />
                  <br></br>
                  <FormControl>
                    <FormLabel id="question-experience">Did you have a positive experience?</FormLabel>
                      <RadioGroup
                          row
                          onChange={(v) => {
                            setExperience(v)
                          }}
                      >
                        <FormControlLabel value="yes" control={<Radio/>} label="Yes"/>
                        <FormControlLabel value="no" control={<Radio/>} label="No"/>
                      </RadioGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel id="question-experience">Was the trade successful?</FormLabel>
                    <RadioGroup
                        row
                        onChange={(v) => {
                          setSuccess(v)
                        }}
                    >
                      <FormControlLabel value="yes" control={<Radio/>} label="Yes"/>
                      <FormControlLabel value="no" control={<Radio/>} label="No"/>
                    </RadioGroup>
                  </FormControl>
                  <br></br>
                  <Button variant="contained" color="primary" onClick={() => {
                    setNext(false)
                  }}>
                    Back
                  </Button>
                  <Button variant="contained" color="secondary" onClick={async (e) => {

                    writeReview(reviewText, user, activeConversationObj, success, experience);

                    await updateDoc(doc(db, "messageStatus", user.uid), {
                      "activeConversations": arrayRemove(activeConversationObj)
                      // [g] : increment(1)
                    });

                    const data = {
                      "id": user.uid,
                      "fname": user.displayName.split(" ")[0],
                      "lname": user.displayName.split(" ")[1],
                      "photoURL": user.photoURL,
                      "addClass": activeConversationObj.dropClass,
                      "addClassSection": activeConversationObj.dropClassSection,
                      "dropClass": activeConversationObj.addClass,
                      "dropClassSection": activeConversationObj.addClassSection,
                    };

                    await updateDoc(doc(db, "messageStatus", activeConversation), {
                      "activeConversations": arrayRemove(data)
                    });

                    handleClose();
                    setActiveConversation("");
                    setActiveConversationObj({
                      fname : "",
                      lname : "",
                      photoURL : "",
                    });
                  }}>
                    Submit
                  </Button>
                </div>
            }
          </Box>
        </Modal>
      </>
  );
}