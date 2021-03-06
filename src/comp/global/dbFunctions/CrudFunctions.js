import '../../../config.js';

//1 Firebase config -----------------------------------------------------//
// * Firebase imports and init
//import { SettingsSystemDaydream, SystemSecurityUpdate } from "@mui/icons-material";

import { getFirestore, collection, doc, query, where, setDoc, addDoc, getDoc,
         getDocs, deleteDoc, updateDoc,  serverTimestamp} from 'firebase/firestore';

import { app } from '../../../firebase-config'


export const db = getFirestore(app);

// collections to be used in the functions
export const trades = collection(db, "trades");
const users = collection(db, "users");
export const courses = collection(db, "courses");
export const reviews = collection(db, "reviews");


// Adds given user to the user collection
export async function addUser (email, displayName, oAuthId, photoURL) {

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
  // const q = query(users, where("oAuthID", "==", oAuthId));
  // const existingUsers = await getDocs(q);
   
  //Add user to database if they are not already in it 
  // if (existingUsers.empty) {


  const userDoc = {
    email: email,
    firstName: firstName,
    lastName: lastName,
    oAuthID: oAuthId,
    displayName: displayName,
    photoURL : photoURL
  }

  const docRef = await setDoc(doc(db, "users", oAuthId), userDoc);
  return docRef;
  // }
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

// Get the course section with the given name
export async function getCoursesByCrn(crns) {

  const q = query(courses, where("crn", 'in', crns));
  const receivedCourse = await getDocs(q);

  let arr = [];
  receivedCourse.forEach((doc) => {arr.push(doc.data())});

  return arr;  
}


// Creates a trade with the creator wanting to drop and add certain courses
export async function createTrade(creatingUserId, dropCourseId, addCourseId) {


  let tradeDoc;
  let tradeRef;

  // Do not create the trade if it is for the same section
  if (dropCourseId == addCourseId) {
    return null;
  }

  //let updateTradeSnap;
  
  const q = query(trades, where("creatorID", "==", creatingUserId), where("addClassID", "==", addCourseId),
                          where("dropClassID", "==", dropCourseId));
  const receivedTrade = await getDocs(q);

  const addCourseQ = query(courses, where("crn", "==", addCourseId));
  const receivedAdd = await getDocs(addCourseQ);

  const dropCourseQ = query(courses, where("crn", "==", dropCourseId));
  const receivedDrop = await getDocs(dropCourseQ);

  if (receivedAdd.empty || receivedDrop.empty) {
    
    console.log("At least one of the input courses does not exist");
    return null;
  
  }
  
  // If the trade to be created does not already exist
  if (receivedTrade.empty) {
 
    // Get course data
    let addClassDoc = await getCourseByCrn(addCourseId);
    let addClass = "";
    addClassDoc.forEach((d) => {addClass = d.data()});

    let dropClassDoc = await getCourseByCrn(dropCourseId);
    let dropClass = "";
    dropClassDoc.forEach((d) => {dropClass = d.data()});
    console.log("here");
    // All attributes except tradeId which is automatically generated
    tradeDoc = {
      addClass: addClass,
      addClassID: addCourseId,
      createdAt: serverTimestamp(),
      creatorID: creatingUserId,
      dropClassID: dropCourseId,
      dropClass: dropClass,
      matchID: -1,
      status: "requested"
    }
 
  
    tradeRef = await addDoc(trades, tradeDoc);
    await updateDoc(tradeRef, {
      trade_id: tradeRef.id
    });
    
    return tradeRef;
  }

  else {
    console.log("Trade was already created");
    return null;
  }
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

  const tradeRef = doc(db, "trades", tradeId);
  
  let tradeSnap; 

  try {
    tradeSnap = await getDoc(tradeRef);
  }
  catch (e) {
    console.log(e.message);
    return null;
  }
  
  if (!tradeSnap.exists()) {
    console.log("Trade does not exist");
    return null;
  }

  return tradeSnap;
}



// Get trades with a specific section being dropped
export async function getTradesByDrop(dropCourseId) {

  const q = query(trades, where("dropClassID", "==", dropCourseId));


  const receivedTrades = await getDocs(q);
  
  if (!receivedTrades.empty) {
    return receivedTrades;
  }

  else {
    console.log("No trades with the given drop course ID exists");
    return null;
  }
}

// Get trades with a specific section being added
export async function getTradesByAdd(addCourseId) {

  const q = query(trades, where("addClassID", "==", addCourseId));

  const receivedTrades = await getDocs(q);
  
  if (!receivedTrades.empty) {
    return receivedTrades;
  }

  else {
    console.log("No trades with the given add course ID exists");
    return null;
  }
}


// Get trades with a specific section being dropped
// and a specific one being added
export async function getTrades(dropCourseId, addCourseId) {

  const q = query(trades, where("dropClassID", "==", dropCourseId),
                  where("addClassID", "==", addCourseId));
  const receivedTrades = await getDocs(q);

  
  if (!receivedTrades.empty) {
    return receivedTrades;
  }

  else {
    console.log("No trades with the given course IDs exist");
    return null;
  }
}

// Modifies the given trade with the given drop course and add course ids
export async function updateTrade(tradeId, newDropCourseId, newAddCourseId) {
   
  const tradeRef = doc(db, "trades", tradeId);

  // Get course data
  let addClassDoc = await getCourseByCrn(newAddCourseId);
  let addClass = "";
  addClassDoc.forEach((d) => {addClass = d.data()});

  let dropClassDoc = await getCourseByCrn(newDropCourseId);
  let dropClass = "";
  dropClassDoc.forEach((d) => {dropClass = d.data()});
  
  const updatedFields = {
    addClass: addClass,
    dropClass: dropClass,
    addClassID: newAddCourseId,
    dropClassID: newDropCourseId,
  }

  const tradeUpdateRef = await updateDoc(tradeRef, updatedFields);
  return tradeUpdateRef;
}

// Updates the given trade with the matched user id
export async function updateTradeMatch(tradeId, matchedUserId) {
  console.log(tradeId);
  console.log(matchedUserId);
  const tradeRef = doc(db, "trades", tradeId);

  let tradeSnap; 

  try {
    tradeSnap = await getDoc(tradeRef);
  }
  catch (e) {
    console.log(e.message);
    return null;
  }

  if (tradeSnap.get('status') === "requested" && matchedUserId !== tradeSnap.get('creatorID')) {
    
    const updatedFields = {
      matchID: matchedUserId,
      status: "matched"
    }

    const updateRef = await updateDoc(tradeRef, updatedFields);
    return updateRef;
  }

  else {
    return null
  }
}

// Updates the given trade with the new status
export async function updateTradeStatus(tradeId, tradeStatus) {
  const tradeRef = doc(db, "trades", tradeId);
  
  const updatedFields = {
    status: tradeStatus
  }

  const updateRef = await updateDoc(tradeRef, updatedFields);
  return updateRef;
}

// Deletes the trade with the given tradeId
export async function deleteTrade(tradeId) {


  const tradeRef = doc(db, "trades", tradeId);
  await deleteDoc(tradeRef);

}

export async function getTradeId(userId, dropCourseId, addCourseId) {

  const q = query(trades, where("creatorID", "==", userId), where("addClassID", "==", addCourseId),
                          where("dropClassID", "==", dropCourseId));
  const receivedTrade = await getDocs(q);

  let tradeId;

  if (!receivedTrade.empty) {
    receivedTrade.forEach((trade) => { 
      tradeId = trade.id
    });
  }

  else {
    console.log("Trade does not exist");
    return null
  }

  return tradeId;
}

export async function addReviews(userId, review, key, tradeSuccess, positiveExperience, reviewedId) {

  let reviewDoc
  let reviewRef

  reviewDoc = {
    reviewerID: userId,
    reviewedID: reviewedId,
    review: review,
    tradeID: key,
    tradeSuccess: tradeSuccess,
    positiveExperience: positiveExperience,
  }

  reviewRef = await addDoc(reviews, reviewDoc);
  return reviewRef;
}

export async function getReviews(reviewedID) {

  const q = query(reviews, where("reviewedID", "==", reviewedID));
  const receivedReviews = await getDocs(q);
    
  if (!receivedReviews.empty) {
    return receivedReviews;
  }

  else {
    console.log("No Review exist");
    return null;
  }
}

export async function getUserInfo(userId) {
  const q = query(users, where("oAuthID", "==", userId));
  const userInfo = await getDocs(q);

  if (!userInfo.empty) {
    return userInfo;
  }

  else {
    console.log("user doesn't exist");
    return null;
  }
}


export async function doesUserExist(userId) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if(userSnap.exists()){
    return true
  } else {
    return false
  }

}
