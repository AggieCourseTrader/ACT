import { getFirestore, collection, getDocs, onSnapshot, query, doc, arrayUnion, serverTimestamp,  increment, setDoc, updateDoc, addDoc, orderBy} from 'firebase/firestore';
import { app } from '../../firebase-config'

//! Data: 
//* Unread Messages count : 'users' table --> groups collection 
//* Sent messages   : 'messages' table --> from (our oauth) and to (oauth of receiver)
//* Received messages : 'messages' table --> from (oauth of sender) and to (our of oauth)
//TODO: Typing indicator
//TODO: Restrictions to number of messages or size of messages


export class IConversation {
    constructor(user, setConversations) {
        this.user = user;
        this.oAuthId = user.uid;
        this.db = getFirestore(app);


        this.myDoc = doc(this.db, "messageStatus", this.oAuthId);

        this.newConversation = onSnapshot(this.myDoc, (data) => {
            console.log("Active conversations");
            console.log(data.data());
            setConversations(data.data());
        });
    }
    async clearUnread(id) {
        const g = "unreadMessages." + id;
        await updateDoc(this.myDoc, {
            [g] : 0
        });
    }
    unSub() {
        this.newConversation();
    }

    async addAll() {
        let q = query(collection(this.db, "users"));
        let docs = await getDocs(q);
        docs.forEach(async (d) => {
            let data = d.data();
            if(data.oAuthID !== this.oAuthId) {
                await setDoc(this.myDoc, {
                    "activeConversations" : arrayUnion({
                        'id' : data.oAuthID,
                        'fname' : data.firstName
                    })
                }, {merge : true});
            }
        });
    }
}
export class IMessage {

    constructor(user, receiver, setMessages) {
        let oAuthId = user.uid;
        this.user = user;
        console.log("Listening for messages from : " + receiver);
        this.db = getFirestore(app);
        this.oAuthId = oAuthId;
        this.receiver = receiver;
        this.messageId = [oAuthId, receiver].sort().join('');

        // Document to notify receiver that we sent them a message
        this.receiverDoc= doc(this.db, "messageStatus", receiver);
        // Will contain messages from chat
        this.messageLoc = collection(this.db, "messages", this.messageId, "list");

        this.called = 0;

        // We want to subscribe to the message stream from this user
        this.newMessage = onSnapshot(query(this.messageLoc, orderBy("timestamp")), (snapshot) => {
            this.called += 1;
            let arr = [];
            snapshot.forEach((d) => arr.push(d.data()));
            setMessages(arr);
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
        const g = "unreadMessages." + this.oAuthId;
        await setDoc(this.receiverDoc, {
            [g] : increment(1)
        }, {merge : true});
    }

    unSub() {
        this.newMessage();
        console.log("Unsubbed");
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

