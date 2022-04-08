import React from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {arrayRemove, updateDoc, doc} from "firebase/firestore";
import {db} from "../global/dbFunctions/CrudFunctions";
import {Avatar} from "@chatscope/chat-ui-kit-react"

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

export default function CloseConversation({user, setActiveConversation, setActiveConversationObj, activeConversation, activeConversationObj, open, handleClose}) {

  return (
      <>

        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Close Conversation
            </Typography>
            <Avatar src={activeConversationObj.photoURL}/>
            <Typography id="modal-modal-description" sx={{mt: 2}}>
              Are you sure you want to finalize this trade and close off the conversation
              with {activeConversationObj.fname}?
            </Typography>
            <Button variant="contained" color="primary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="secondary" onClick={async (e) => {

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
              Close
            </Button>
          </Box>
        </Modal>
      </>
  );
}