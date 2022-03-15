import { getFirestore, collection, getDocs, onSnapshot, query, where, getDoc, doc, arrayUnion, serverTimestamp, increment, setDoc, updateDoc, addDoc, Firestore, orderBy} from 'firebase/firestore';
import { React } from 'react'
import { app } from '../../firebase-config'

//! Data: 
//* Unread Messages count : 'users' table --> groups collection 
//* Sent messages   : 'messages' table --> from (our oauth) and to (oauth of receiver)
//* Received messages : 'messages' table --> from (oauth of sender) and to (our of oauth)
//TODO: Typing indicator
//TODO: Restrictions to number of messages or size of messages

export class IMessage {

    constructor(oAuthId, receiver, setMessages) {
        this.db = getFirestore(app);
        this.oAuthId = oAuthId;
        this.messageId = (oAuthId.localeCompare(receiver)) ? oAuthId + receiver : receiver + oAuthId;

        // Document to notify receiver that we sent them a message
        this.receiverDoc= doc(this.db, "messageStatus", receiver);
        // Will contain messages from chat
        this.messageLoc = collection(this.db, "messages", this.messageId, "list");


        // We want to subscribe to the message stream from this user
        const newMessage = onSnapshot(query(this.messageLoc, orderBy("timestamp")), (snapshot) => {
            let arr = [];
            snapshot.forEach((d) => arr.push(d.data()));
            console.log("Here;");
            // setMessages(arr);
        });

    }


    async sendMessage(text) {
        // Add message to database
        await addDoc(this.messageLoc, {
            text : text, 
            timestamp : serverTimestamp(),
            sender : this.oAuthId
        });

        // Notify other user of text
        const g = "unreadmessages." + this.oAuthId;

        await updateDoc(this.receiverDoc, {
            [g] : increment(1)
        });
    }

}


// export class MessageHelper{
//     constructor(oAuthId) {
//         this.oAuthId = oAuthId;
//         this.db = getFirestore(app);

//         this.sendDocs = {}
//         this.receiveDocs = {}
//         this.replyCounter

//         if(oAuthId.length < 1) {
//             console.log("Not logged in");
//             return;
//         }

//         this.myDoc = doc(this.db, "users", oAuthId);
//         this.myGroups = [];

//         const checkNewMessages = onSnapshot(myDoc, (data) => {
//             this.myGroups = data.data().groups;
//             console.log(this.myGroups);

//         });   
//     }

//     readMessages(from, onNewMessage) {
//         0
//     }

//     sendMessage(text, to) {
//         // We need two references: 
//             // one to the other guys 'users' doc so that we can notify him of a unread message
//             // another to a document in 'messages' where we can write the message text
//         const otherDoc = doc(this.db, "users", to);

//         const sentMessagesDoc = this.db.collection('messages').doc(user_id + to).set({foo:'bar'}, {merge: true})
//     }
//   }


