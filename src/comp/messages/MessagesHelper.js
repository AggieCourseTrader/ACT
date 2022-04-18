import '../../config.js';
import { getFirestore, collection, getDocs, onSnapshot, query, doc, arrayUnion, serverTimestamp, where,  increment, setDoc, updateDoc, addDoc, orderBy} from 'firebase/firestore';
import { app } from '../../firebase-config'

var validator = require('validator');

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

    async addId(connectingUserId) {
        let q = query(collection(this.db, "users"), where("oAuthID", "==", connectingUserId));
        let docs = await getDocs(q);
        docs.forEach(async (d) => {
            let data = d.data();
            if(data.oAuthID !== this.oAuthId) {
                await setDoc(this.myDoc, {
                    "activeConversations" : arrayUnion({
                        'id' : data.oAuthID,
                        'fname' : data.firstName,
                        'lname' : data.lastName,
                        'photoURL' : data.photoURL
                    })
                }, {merge : true});
            }
        });
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
                        'fname' : data.firstName,
                        'lname' : data.lastName,
                        'photoURL' : data.photoURL
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

        var escaped_text = validator.escape(text);

        // Add message to database
        await addDoc(this.messageLoc, {
            text : escaped_text,
            timestamp : serverTimestamp(),
            sender : this.oAuthId
        });
        console.log(escaped_text);

        // // Notify other user of text
        // const exists = await getDoc(this.receiverDoc);
        
        // const g = "unreadMessages." + this.oAuthId;
        await setDoc(this.receiverDoc, {
            "unreadMessages" : {
                [this.oAuthId] : increment(1)
            }
            // [g] : increment(1)
        }, {merge : true});
    }

    unSub() {
        this.newMessage();
        console.log("Unsubbed");
    }

}
