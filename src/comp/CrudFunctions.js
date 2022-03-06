
//1 Firebase config -----------------------------------------------------//
// * Firebase imports and init
//import { SettingsSystemDaydream, SystemSecurityUpdate } from "@mui/icons-material";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, query, where, setDoc, addDoc,
         getDocs, deleteDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { firebaseConfig } from '../firebase-config';



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// collections to be used in the functions
const trades = collection(db, "trades");
const users = collection(db, "users");
const courses = collection(db, "courses");



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

    const docRef = await setDoc(doc(db, "users", oAuthId), userDoc);
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
  const receivedCourse = await getDocs(q);

  return receivedCourse;  
}

// Creates a trade for each section the user can add with the user wanting to drop a certain course
// Returns array of trade document references
export async function createTrade(creatingUserId, dropCourseId, addCourseIds) {
  
  // Get current time and convert from milliseconds to seconds
  const date_ts = (new Date()).getTime() / 1000; 

  const db_timestamp = new Timestamp(date_ts, 0);

  let tradeDoc;
  let tradeRef;

  let tradeArray = [];
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

  let tradeRef; 

  if (!receivedTrades.empty) {
    receivedTrades.forEach((doc) => {
      tradeRef = doc;
    });

    return tradeRef;
  }

  else {
    console.log("No trade with the given ID");
    return null;
  }
}

// Get trades with a specific section being dropped
export async function getTrades(dropCourseId) {

  const q = query(trades, where("dropClassID", "==", dropCourseId));
  const receivedTrades = await getDocs(q);

  return receivedTrades;
}

// Modifies the given trade with a new dropCourseId, addDropCourseId, or both
export async function updateTrade(tradeId, newDropCourseId, newAddCourseId) {
   
  const tradeRef = doc(db, "trades", tradeId);
  
  const updatedFields = {
    addClassID: newAddCourseId,
    dropClassID: newDropCourseId,
  }

  const tradeUpdateRef = await updateDoc(tradeRef, updatedFields);
  return tradeUpdateRef;
}

// Updates the given trade with the matched user id
export async function updateTradeMatch(tradeId, matchedUserId) {
   
  const tradeRef = doc(db, "trades", tradeId);
  
  const updatedFields = {
    matchID: matchedUserId,
    status: "matched"
  }

  const updateRef = await updateDoc(tradeRef, updatedFields);
  return updateRef;

}

// Deletes the trade with the given tradeId
export async function deleteTrade(tradeId) {

  const tradeRef = doc(db, "trades", tradeId);
  await deleteDoc(tradeRef);
}


