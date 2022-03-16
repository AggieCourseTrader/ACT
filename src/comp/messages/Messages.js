import {React, useEffect, useRef, useState} from 'react';
import { IMessage, IConversation} from './MessagesHelper';


import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Search,
  Sidebar,
  ConversationList,
  Avatar,
  Conversation
} from "@chatscope/chat-ui-kit-react";

//! Do not remove ------------------------------------>
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
// ---------------------------------------------------//

import {onAuthStateChanged, auth} from '../../firebase-config'
import { useNavigate } from 'react-router-dom'

function Messages({userId}) {
    const [messageArr, setMessageArr] = useState([]);
    const [conversationArr, setConversationArr] = useState([]);
    const [text, setText]  = useState('');
    const [user, setUser] = useState(false);
    const messageHelper = useRef(false);
    const convHelper = useRef(false);

    let navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(user);
          } else {
            navigate("/")
          }
         });
     
    }, /*removed dependency array*/)

    useEffect(() => {
        if(user) {
            console.log(user.uid);
            messageHelper.current = new IMessage(user, "NIwuHQlzkBbRSAFmqjsz1T3GUxm2", setMessageArr);
            convHelper.current = new IConversation(user, setConversationArr);
        }
        return () => {
            if(messageHelper.current) {
                messageHelper.current.unSub();
            }
            if(convHelper.current) {
                convHelper.current.unSub();
            }
        }
    }, [user]);

    useEffect(() => {
        if(text != "") {
            console.log("Sending text : " + text);
            messageHelper.current.sendMessage(text);
        }
    }, [text]);


    //! We have to update message list whenever user clicks on conversation or a new message is received.
    useEffect((() => {
        console.log(messageArr);
    }), [messageArr]);

    return (
    <div style={{ position: "relative", height: "100vh" }}>
        <MainContainer>

            <Sidebar position="left" scrollable={false}>
                <Search placeholder="Search..." />
                <ConversationList >   
                    {(conversationArr.activeConversations) ? 
                        conversationArr.activeConversations.map((d) => 
                            <Conversation key={"conversation." + d.id} name={d.fname} info="Yolo" unreadCnt={(conversationArr.unreadMessages) ? (d.id in conversationArr.unreadMessages) ? conversationArr.unreadMessages[d.id] : 0 : 0}/>
                        )
                    : false}                                                                                          
                </ConversationList>
            </Sidebar>
            <ChatContainer>
                <MessageList>
                    {messageArr.map((m, index) => 
                        <Message 
                        key={"mesageArr." + index}
                        model={{
                            message : m.text,
                            direction : (user) ? ((m.sender == user.uid) ? "outgoing" : "incoming") : "outgoing",
                            position : determinePosition(m, index, messageArr)
                        }}/>
                    )}
                </MessageList>
                <MessageInput  attachButton={false} placeholder="Type message here" onSend={(e, v, t) => {setText(t)}}/>
            </ChatContainer>
        </MainContainer>

    </div>
    )
}

function handleSend(text) {
    console.log(text);
}

function determinePosition(m, index, messageArr) {
    // If last
    if(messageArr.length - 1 === index) {
        return "last";
    }
    // If first
    else if(index === 0) {
        return "first";
    }
    // If middle or single
    const prev = messageArr[index - 1];
    const next = messageArr[index + 1];
    
    if(prev.sender == next.sender) {
        if(prev.sender == m.sender) {
            return "normal";
        }
        return "single";
    }
    else if(prev.sender == m.sender) {
        return "last";
    }
    else if(next.sender == m.sender) {
        return "first";
    }
    return "single";
    
}

export default Messages;