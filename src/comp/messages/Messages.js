import {React, useEffect, useRef, useState} from 'react';
import {IMessage, IConversation} from './MessagesHelper';
import Navbar from '../global/navbar/Navbar';

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Search,
  Sidebar,
  ConversationList,
  Conversation,
  Avatar,
  ConversationHeader,
  InfoButton
} from "@chatscope/chat-ui-kit-react";


//! Do not remove ------------------------------------>
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
// ---------------------------------------------------//

import {onAuthStateChanged, auth} from '../../firebase-config'
import {useNavigate} from 'react-router-dom'


console.log(styles);

function Messages() {
  const [messageArr, setMessageArr] = useState([]);
  const convHelper = useRef(false);
  const [conversationArr, setConversationArr] = useState([]);
  const [activeConversation, setActiveConversation] = useState('');
  const [user, setUser] = useState(false);

  const messageHelper = useRef(false);


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
  console.log(user)
  console.log(conversationArr)
  console.log(activeConversation)
  // console.log(conversationArr.find(obj => {
  //   obj.id === activeConversation;
  // }));

  // Get avatar of the user
  // const getAvatar = conversationArr.find(obj => {
  //   return obj.id === activeConversation;
  // });

  return (
      <>
        <Navbar name="Messages" auth={auth} user={user}/>
        <div style={{flexGrow: 1, height: "90vh", backgroundColor: '#600000'}}>
          <MainContainer responsive style={{backgroundColor: '#600000'}}>

            <Sidebar position="left" scrollable={false}>
              <Search style={{backgroundColor: '#600000'}} placeholder="Search..."/>
              <ConversationList>

                {(conversationArr) ? ("activeConversations" in conversationArr) ?
                    conversationArr.activeConversations.map((d) =>
                        <Conversation
                            onClick={() => setActiveConversation(d.id)}
                            key={"conversation." + d.id} name={d.fname + " " + d.lname}
                            unreadCnt={(activeConversation !== d.id) ? (conversationArr.unreadMessages) ? (d.id in conversationArr.unreadMessages) ? conversationArr.unreadMessages[d.id] : 0 : 0 : 0}
                            active={(activeConversation === d.id)}
                        >
                          <Avatar src={d.photoURL} name="Avatar" status="available"/>
                          <Conversation.Content>
                            <div>Custom content</div>
                          </Conversation.Content>
                          <Conversation.Operations />
                        </Conversation>
                    )
                    : false : false}
              </ConversationList>
            </Sidebar>
            <ChatContainer style={{backgroundColor: 'transparent'}}>
              <ConversationHeader>
                <Avatar src={""} name="Avatar"/>
                <ConversationHeader.Content userName={user.displayName} info="Active 10 mins ago"/>
                <ConversationHeader.Actions>
                  <InfoButton border />
                </ConversationHeader.Actions>
              </ConversationHeader>
              <MessageList style={{backgroundColor: 'rgba(255,255,255,0.5)'}}>
                {messageArr.map((m, index) =>
                    <Message
                        key={"mesageArr." + index}
                        model={{
                          message: m.text,
                          direction: (user) ? ((m.sender === user.uid) ? "outgoing" : "incoming") : "outgoing",
                          position: determinePosition(m, index, messageArr)
                        }}/>
                )}
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