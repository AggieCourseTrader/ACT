
//1 Firebase config -----------------------------------------------------//
// * Firebase imports and init
import { SettingsSystemDaydream, SystemSecurityUpdate } from "@mui/icons-material";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, query, where, setDoc, addDoc, getDoc,
         getDocs, deleteDoc, updateDoc, Timestamp } from 'firebase/firestore';


// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyBSCaZ13T9nckWzjRKfVlmgsMq7-S4xRBY",
  authDomain: "act-dev-1.firebaseapp.com",
  databaseURL: "https://act-dev-1-default-rtdb.firebaseio.com",
  projectId: "act-dev-1",
  storageBucket: "act-dev-1.appspot.com",
  messagingSenderId: "729474256375",
  appId: "1:729474256375:web:c58ef58fff165b233832f2",
  measurementId: "G-T2S3H96TZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// collections to be used in the functions
const trades = collection(db, "trades");
const users = collection(db, "users");
const courses = collection(db, "courses");

// export {
//   app,
//   db,
//   trades,
//   users,
//   courses
// };

// Adds given user to the user collection
export async function addUser (email, displayName, oAuthId) {

  // Split displayName into first and last name
  let names;
  if (displayName) {
    names = displayName.split(" ");
  }

  else {
    return;
  }

  const firstName = names[0];
  const lastName = names[1];

  // Look for document to check if user exists
  const q = query(users, where("oAuthID", "==", oAuthId));
  const existingUsers = await getDocs(q);
   
  //Add user to database if they are not already in it 
  if (existingUsers.empty) {

    const userDoc = { 
      email: email,
      firstName: firstName,
      lastName: lastName,
      oAuthID: oAuthId
    }

    const docRef = await addDoc(users, userDoc);
    return docRef;
  } 
}

// Get all of the course sections with the given name
export async function getCoursesByName(courseName) {

  const q = query(courses, where("course", "==", courseName));
  const receivedCourses = await getDocs(q);
  return receivedCourses;  
}

// Get the course section with the given name
export async function getCourseByCrn(crn) {

  const q = query(courses, where("crn", "==", crn));
  const receivedCourses = await getDocs(q);
  return receivedCourses;
}

// Creates a trade for each section the user can add with the user wanting to drop a certain course
export async function createTrade(creatingUserId, dropCourseId, addCourseIds) {
  
  // Get current time and convert from milliseconds to seconds
  const date_ts = (new Date()).getTime() / 1000; 

  const db_timestamp = new Timestamp(date_ts, 0);

  let tradeDoc;
  let tradeRef;

  let tradeArray;
  for (let i = 0; i < addCourseIds.length; i++) {
  
    // All attributes except tradeId which is automatically generated
    tradeDoc = { 
      addClassID: addCourseIds[i],
      createdAt: db_timestamp,
      creatorID: creatingUserId,
      dropClassID: dropCourseId,
      matchID: -1,
      status: "requested"
    }
  
    tradeRef = await addDoc(trades, tradeDoc);
    await updateDoc(tradeRef, {
      trade_id: tradeRef.id
    });

    tradeArray.push(tradeRef);
  }  
  
  return tradeArray;
}

// Get all trades that a user created
export async function getCreatedTrades(userId) {

  const q = query(trades, where("creatorID", "==", userId));
  const receivedTrades = await getDocs(q);

  return receivedTrades;  
}

// Get all trades that a user matched with 
export async function getMatchedTrades(userId) {

  const q = query(trades, where("matchID", "==", userId));
  const receivedTrades = await getDocs(q);

  return receivedTrades;  
}

// Get the specific trade
export async function getTrade(tradeId) {

  const q = query(trades, where("trade_id", "==", tradeId));
  const receivedTrades = await getDocs(q);

  return receivedTrades;
}


// Modifies the given trade with a new dropCourseId, addDropCourseId, or both
export async function modifyTrade(tradeId, newDropCourseId, newAddCourseId) {
   
  const tradeRef = doc(db, "trades", tradeId);
  
  const updatedFields = {
    addClassID: newAddCourseId,
    dropClassID: newDropCourseId,
  }

  await updateDoc(tradeRef, updatedFields);
}

// Deletes the trade with the given tradeId
export async function deleteTrade(tradeId) {

  const tradeRef = doc(db, "trades", tradeId);
  await deleteDoc(tradeRef);

}


