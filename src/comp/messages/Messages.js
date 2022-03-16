import {React, useEffect, useRef, useState} from 'react';
import { IMessage} from './MessagesHelper';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";


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
import { previews } from 'firebase-tools/lib/previews';
import { NextPlan } from '@mui/icons-material';

function Messages({userId}) {
    const [messageArr, setMessageArr] = useState([]);
    const [text, setText]  = useState('');

    const messageHelper = useRef(false);

    useEffect(() => {
        messageHelper.current = new IMessage(userId, "NIwuHQlzkBbRSAFmqjsz1T3GUxm2", setMessageArr)
        return () => {
            messageHelper.current.unSub();
        }
    }, [userId]);

    useEffect(() => {
        if(text === "") {
            return;
        }
        console.log("Sending text : " + text);
        messageHelper.current.sendMessage(text);
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
            <ConversationList onClick={(e,v) => {console.log(e); console.log(v);}}>                                                     
            <Conversation name="Lilly" lastSenderName="Lilly" info="Yes i can do it for you">
                {/* <Avatar src={lillyIco} name="Lilly" status="available" /> */}
            </Conversation>
            
            <Conversation name="Joe" lastSenderName="Joe" info="Yes i can do it for you">
                {/* <Avatar src={joeIco} name="Joe" status="dnd" /> */}
            </Conversation>
            
            <Conversation name="Emily" lastSenderName="Emily" info="Yes i can do it for you" unreadCnt={3}>
                {/* <Avatar src={emilyIco} name="Emily" status="available" /> */}
            </Conversation>
            
            <Conversation name="Kai" lastSenderName="Kai" info="Yes i can do it for you" unreadDot>
                {/* <Avatar src={kaiIco} name="Kai" status="unavailable" /> */}
            </Conversation>
                        
            <Conversation name="Akane" lastSenderName="Akane" info="Yes i can do it for you">
                {/* <Avatar src={akaneIco} name="Akane" status="eager" /> */}
            </Conversation>
                                
            <Conversation name="Eliot" lastSenderName="Eliot" info="Yes i can do it for you">
                {/* <Avatar src={eliotIco} name="Eliot" status="away" /> */}
            </Conversation>
                                                
            <Conversation name="Zoe" lastSenderName="Zoe" info="Yes i can do it for you" active>
                {/* <Avatar src={zoeIco} name="Zoe" status="dnd" /> */}
            </Conversation>
            
            <Conversation name="Patrik" lastSenderName="Patrik" info="Yes i can do it for you">
                {/* <Avatar src={patrikIco} name="Patrik" status="invisible" /> */}
            </Conversation>
                                                                        
            </ConversationList>
            </Sidebar>
            <ChatContainer>
            <MessageList>
                {messageArr.map((m, index) => 
                    <Message model={{
                        message : m.text,
                        direction : (m.sender == userId) ? "outgoing" : "incoming"
                        // position : determinePosition(m, index, messageArr)
                    }}/>
                )}
                <Message
                model={{
                    message: "Hello my friend",
                    sentTime: "just now",
                    sender: "Joe",
                }}
                />
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={(e, v) => {setText(v)}}/>
            </ChatContainer>
        </MainContainer>
    </div>
    )
}


// function determinePosition(m, index, messageArr) {
//     // If last
//     if(messageArr.length - 1 === index) {
//         return "last";
//     }
//     // If first
//     else if(index === 0) {
//         return "first";
//     }
//     // If middle or single
//     const prev = messageArr[index - 1];
//     const next = messageArr[index + 1];
    
//     if(prev.sender == next.sender) {
//         if(prev.sender == m.sender) {
//             return "normal";
//         }
//         return "single";
//     }
//     else if(prev.sender == m.sender) {
//         return "last";
//     }
//     else if(next.sender == m.sender) {
//         return "first";
//     }
//     return "single";
    
// }

export default Messages;