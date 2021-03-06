import '../../config.js';
import React, {useEffect, useRef, useState, useContext} from 'react';
import {IMessage, IConversation} from './MessagesHelper';
import Navbar from '../global/navbar/Navbar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseConversation from "./CloseConversation";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {doesUserExist} from "../global/dbFunctions/CrudFunctions"
import { useLocation } from 'react-router-dom'
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
  ConversationHeader,
  MessageSeparator,
  InfoButton
} from "@chatscope/chat-ui-kit-react";
//! Do not remove ------------------------------------>

import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import notificationStyles from './notificationStyles.css';
// ---------------------------------------------------//
import {onAuthStateChanged, auth} from '../../firebase-config'

import {useNavigate} from 'react-router-dom'
import TermsContext from '../global/authentication/TermsContext'
import Footer from "../global/Footer";

var validator = require('validator');


function Messages() {
  const [messageArr, setMessageArr] = useState([]);
  const convHelper = useRef(false);
  const {termContext, setTermContext} = useContext(TermsContext)
  const [conversationArr, setConversationArr] = useState([]);
  const [activeConversation, setActiveConversation] = useState('');
  const [activeConversationObj, setActiveConversationObj] = useState({
    fname: "",
    lname: "",
    photoURL: "",
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

  const location = useLocation();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (termContext) {
          setUser(user);
        } else {
          (async () => {
            let doesUser = await doesUserExist(user.uid);
            if (doesUser) {
              setTermContext(true)
            } else {
              navigate("/terms")
            }
          })();
        }
      } else {
        navigate("/")
      }
    });
  }, /*removed dependency array*/)

  useEffect(() => {
    if (conversationArr !== [] && activeConversation === '' && conversationArr?.activeConversations) {
      try {

        if(location?.state?.tradeId) {
          setActiveConversation(conversationArr.activeConversations.find(conversation => conversation.tradeId === location?.state?.tradeId).id);
          setActiveConversationObj(conversationArr.activeConversations.find(conversation => conversation.tradeId === location?.state?.tradeId));
        }
        else {
          setActiveConversation(conversationArr?.activeConversations[0].id);
          setActiveConversationObj(conversationArr?.activeConversations[0]);
        }
      } catch (e) {
        console.log(e);
      }
      // setActiveConversation(conversationArr.activeConversations[0].id);
      // setActiveConversationObj(conversationArr.activeConversations[0]);
    }
  }, [conversationArr]);

  useEffect(() => {
    if (activeConversation) {
      messageHelper.current = new IMessage(user, activeConversation, setMessageArr);
      if (convHelper.current) {
        convHelper.current.clearUnread(activeConversation);
      }
    } else {
      setMessageArr([]);
      if (messageHelper.current)
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
      <React.Fragment>

        <CloseConversation user={user} setActiveConversation={setActiveConversation}
                           setActiveConversationObj={setActiveConversationObj} open={open} handleClose={handleClose}
                           activeConversation={activeConversation} activeConversationObj={activeConversationObj}/>
        <Navbar name="Messages" auth={auth} user={user}/>
        <div style={{flexGrow: 1, height: "80vh"}}>
          <MainContainer responsive>

            <Sidebar position="left" scrollable={false}>

              <ConversationList className="aggieTheme">

                {(conversationArr) ? ("activeConversations" in conversationArr) ?
                    conversationArr.activeConversations.map((d, index) =>
                        <Conversation
                            onClick={() => {
                              setActiveConversation(d.id);
                              setActiveConversationObj(d)
                            }}
                            key={"conversation." + d.id + index}
                            unreadCnt={(activeConversation !== d.id) ? (conversationArr.unreadMessages) ? (d.id in conversationArr.unreadMessages) ? conversationArr.unreadMessages[d.id] : 0 : 0 : 0}
                            active={(activeConversation === d.id)}
                        >
                          <Avatar src={d.photoURL} name="Avatar" status={(d?.status === "closed") ? "dnd" : false}/>
                          <Conversation.Content>
                            {d.fname + " " + d.lname}
                            <span>
                            <Chip color="success" size="small"
                                  key={"chipadd." + d.id + index}
                                  style={{verticalAlign: "middle", marginTop: "0.5em", backgroundColor: '#5b6236'}}
                                  icon={<AddCircleOutlineIcon/>}
                                  label={[d.addClass, <span style={{
                                    color: "#e0e0e0",
                                    verticalAlign: "middle",
                                    fontSize: "0.9em"
                                  }}>{"???" + d.addClassSection}</span>]}/>
                            <Chip size="small" color="primary"
                                  key={"chipdrop." + d.id + index}
                                  icon={<RemoveCircleOutlineIcon/>}
                                  style={{
                                    verticalAlign: "middle",
                                    marginTop: "0.1em",
                                    marginBottom: "0.1em",
                                    backgroundColor: '#661429'
                                  }}
                                  label={[d.dropClass, <span style={{
                                    color: "#e0e0e0",
                                    verticalAlign: "middle",
                                    fontSize: "0.9em"
                                  }}>{"???" + d.dropClassSection}</span>]}/>
                            </span>
                          </Conversation.Content>
                          <Conversation.Operations>
                            <div as="InfoButton" onClick={handleOpen}><HighlightOffIcon fontSize="small"/> </div>
                          </Conversation.Operations>
                          {/* <Conversation.Operations onClick={() => {
                            handleOpen();
                          }} 
                          // /> */}
                        </Conversation>
                    )
                    : false : false}
              </ConversationList>

            </Sidebar>
            <ChatContainer className="aggieTheme">
              <ConversationHeader>
                {(activeConversationObj.photoURL !== "") ?
                    <Avatar src={activeConversationObj.photoURL} name="Avatar"/> : false}
                {(activeConversation !== "") ? <ConversationHeader.Content
                        userName={activeConversationObj.fname + " " + activeConversationObj.lname}/>
                    : <ConversationHeader.Content userName="Match with others on the Marketplace to begin chatting!"/>}
                <ConversationHeader.Actions>
                  {(activeConversation !== "") ?
                      <div as="VideoCallButton" title="Show info" onClick={() => {
                        handleOpen();
                      }}>
                        <Button onClick={handleOpen} variant="outlined">End trade</Button>
                      </div>
                      : false}
                </ConversationHeader.Actions>
              </ConversationHeader>
              <MessageList style={{}}>
                {messageArr.map((m, index) =>

                    <Message
                        key={"mesageArr." + index}
                        className={(user) ? ((m.sender === user.uid) ? "outg" : "inc") : "outg"}
                        model={{

                          // message: validator.escape(m.text),
                          message: m.text,
                          direction: (user) ? ((m.sender === user.uid) ? "outgoing" : "incoming") : "outgoing",
                          position: determinePosition(m, index, messageArr)
                        }}/>
                )}

                {
                  (activeConversationObj?.status === "closed") ?
                      displayClosedConv()
                      :
                      false
                }

              </MessageList>

              {(activeConversation !== "") ?
                  <MessageInput
                      disabled={(activeConversationObj?.status === "closed" || activeConversation === "") ? true : false}
                      attachButton={false}
                      placeholder="Type message here"
                      onSend={(e, v, t) => {
                        sendTxt(t)
                      }}/>
                  : false}


            </ChatContainer>
          </MainContainer>

        </div>
        <Footer/>
      </React.Fragment>
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

function displayClosedConv() {
  return (
      <MessageSeparator className="closed" content="This conversation was closed" as="h2"/>
  )
}

export default Messages;