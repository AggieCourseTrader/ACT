import {React, useEffect, useRef, useState} from 'react';
import {IMessage, IConversation} from './MessagesHelper';
import Navbar from '../global/navbar/Navbar';
import Chip from '@mui/material/Chip';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseConversation from "./CloseConversation";
// import { arrayRemove, getFirestore, collection, getDocs, onSnapshot, query, doc, arrayUnion, serverTimestamp, where,  increment, setDoc, updateDoc, addDoc, orderBy} from 'firebase/firestore';

// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Sidebar,
  ConversationList,
  Conversation,
  Avatar,
  ConversationHeader
} from "@chatscope/chat-ui-kit-react";

//! Do not remove ------------------------------------>
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import notificationStyles from './notificationStyles.css';
// ---------------------------------------------------//

import {onAuthStateChanged, auth} from '../../firebase-config'
import {useNavigate} from 'react-router-dom'
// import {arrayRemove, updateDoc, doc} from "firebase/firestore";
// import {db} from "../global/dbFunctions/CrudFunctions";

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



function Messages() {
  const [messageArr, setMessageArr] = useState([]);
  const convHelper = useRef(false);
  const [conversationArr, setConversationArr] = useState([]);
  const [activeConversation, setActiveConversation] = useState('');
  const [activeConversationObj, setActiveConversationObj] = useState({
      fname : "",
      lname : "",
      photoURL : "",
  });


  const [user, setUser] = useState(false);
  console.log(user);
  const messageHelper = useRef(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  console.log(styles);
  let navigate = useNavigate();


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/")
      }
    });

  },)


  useEffect(() => {
    if (activeConversation) {
      messageHelper.current = new IMessage(user, activeConversation, setMessageArr);
      if (convHelper.current) {
        convHelper.current.clearUnread(activeConversation);
      }
    }
    else {
      setMessageArr([]);
      if(messageHelper.current)
        messageHelper.current.unSub();

      
    }

    return () => {
      if (messageHelper.current) {
        messageHelper.current.unSub();
      }
    }
  }, [activeConversation, user])

  useEffect(() => {
    if (user) {
      convHelper.current = new IConversation(user, setConversationArr);


      // convHelper.current.addAll();
    }

    return () => {
      if (convHelper.current) {
        convHelper.current.unSub();
      }
    }

  
  }, [user]);

  const sendTxt = (text) => {
    if (text !== "" && messageHelper.current) {
      console.log("Sending text : " + text);
      messageHelper.current.sendMessage(text);
    }
  }

  //! We have to update message list whenever user clicks on conversation or a new message is received.
  useEffect((() => {
    console.log(messageArr);
  }), [messageArr]);


  return (
      <>

      <CloseConversation user={user} setActiveConversation={setActiveConversation} setActiveConversationObj={setActiveConversationObj} open={open} handleClose={handleClose} activeConversation={activeConversation} activeConversationObj={activeConversationObj}/>
        <Navbar name="Messages" auth={auth} user={user}/>
        <div style={{flexGrow: 1, height: "90vh"}}>
          <MainContainer responsive>

            <Sidebar position="left" scrollable={false}>

              <ConversationList style={{minWidth: "300px"}}>

                {(conversationArr) ? ("activeConversations" in conversationArr) ?
                    conversationArr.activeConversations.map((d, index) =>
                        <Conversation
                            onClick={() => {setActiveConversation(d.id); setActiveConversationObj(d)}}
                            key={"conversation." + d.id + index}
                            unreadCnt={(activeConversation !== d.id) ? (conversationArr.unreadMessages) ? (d.id in conversationArr.unreadMessages) ? conversationArr.unreadMessages[d.id] : 0 : 0 : 0}
                            active={(activeConversation === d.id)}
                        >
                          <Avatar src={d.photoURL} name="Avatar"/>
                          <Conversation.Content>
                            {d.fname + " " + d.lname}
                            <span>
                            <Chip color="success" size="small" 
                                key={"chipadd." + d.id + index}
                                style={{verticalAlign:"middle", marginTop: "0.5em", backgroundColor:'#5b6236'}}
                                icon={<AddCircleOutlineIcon/>} 
                                label={[d.addClass  , <span style={{color: "#e0e0e0", verticalAlign: "middle", fontSize:"0.9em"}}>{"—" + d.addClassSection}</span>]}/>
                            <Chip size="small" color="primary" 
                                key={"chipdrop." + d.id + index}
                                icon={<RemoveCircleOutlineIcon/>} 
                                style={{verticalAlign:"middle", marginTop: "0.1em", marginBottom: "0.1em", backgroundColor:'#661429'}}
                                label={[d.dropClass  , <span style={{color: "#e0e0e0", verticalAlign: "middle", fontSize:"0.9em"}}>{"—" + d.dropClassSection}</span>]}/>
                            </span>
                          </Conversation.Content>
                          <Conversation.Operations onClick={() => {
                            console.log("Clicked on conversation operations");
                            handleOpen();
                          }}
                          />
                        </Conversation>
                    )
                    : false : false}
              </ConversationList>

            </Sidebar>
            <ChatContainer style={{backgroundColor: 'transparent'}}>
              <ConversationHeader>
                {(activeConversationObj.photoURL !== "") ? <Avatar src={activeConversationObj.photoURL} name="Avatar"/> : false}
                <ConversationHeader.Content userName={activeConversationObj.fname + " " + activeConversationObj.lname}/>
              </ConversationHeader>
              <MessageList style={{}}>
                {messageArr.map((m, index) =>
                    <Message
                        key={"mesageArr." + index}
                        stlye={{

                        }}
                        model={{
                          message: m.text,
                          direction: (user) ? ((m.sender === user.uid) ? "outgoing" : "incoming") : "outgoing",
                          position: determinePosition(m, index, messageArr)
                        }}/>
                )}
              {/* <Message
                model={{

                }}
              /> */}

              <Message className="notification" model={{message: "This chat was closed"}}/>

              </MessageList>
              <MessageInput attachButton={false}
                            placeholder="Type message here" onSend={(e, v, t) => {
                sendTxt(t)
              }}/>
            </ChatContainer>
          </MainContainer>

        </div>

      </>
  )
}


function determinePosition(m, index, messageArr) {
  // If last
  if (messageArr.length - 1 === index) {
    return "last";
  }
  // If first
  else if (index === 0) {
    return "first";
  }
  // If middle or single
  const prev = messageArr[index - 1];
  const next = messageArr[index + 1];

  if (prev.sender === next.sender) {
    if (prev.sender === m.sender) {
      return "normal";
    }
    return "single";
  } else if (prev.sender === m.sender) {
    return "last";
  } else if (next.sender === m.sender) {
    return "first";
  }
  return "single";

}

export default Messages;