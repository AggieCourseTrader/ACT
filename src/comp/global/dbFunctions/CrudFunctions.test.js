/**
 * @jest-environment node
 */

import { createTrade, deleteTrade, getTrade, getUserInfo,
        updateTrade, updateTradeMatch, addUser, db } from "./CrudFunctions"

import { deleteDoc, doc } from 'firebase/firestore'

test ('Create trade, get trade, and delete trade', async () => {

    
    // Creating a trade
    let docReference = await createTrade("5NoA7gdIGUhHOM0pv7iM1btKvm23", 15977, 34157);

    let tradeId = docReference.id;

    let docSnapshot = await getTrade(tradeId);

    // Testing that created trade is in the database with correct data
    expect(docSnapshot.get('creatorID')).toBe("5NoA7gdIGUhHOM0pv7iM1btKvm23");
    expect(docSnapshot.get('dropClassID')).toBe(15977);
    expect(docSnapshot.get('addClassID')).toBe(34157);    
    

    // Making sure when user attempts to create the same trade,
    // the trade is not created
    expect(await createTrade("5NoA7gdIGUhHOM0pv7iM1btKvm23", 15977, 34157)).toBe(null);

    // Test to make sure to not add trade when add course and drop course are the same
    expect(await createTrade("5NoA7gdIGUhHOM0pv7iM1btKvm23", 15977, 15977)).toBe(null);

    // Making sure a trade with courses that do not exist cannot be createdAt
    expect(await createTrade("5NoA7gdIGUhHOM0pv7iM1btKvm23", 12345789, 34157)).toBe(null);
    expect(await createTrade("5NoA7gdIGUhHOM0pv7iM1btKvm23", 15977, 987654321)).toBe(null);
    expect(await createTrade("5NoA7gdIGUhHOM0pv7iM1btKvm23", 12345789, 987654321)).toBe(null);

    // Testing that trade is deleted properly
    await deleteTrade(tradeId);
    expect(await getTrade(tradeId)).toBe(null);
});

// Checking that function that updates trades works
test ('Testing trade update function', async () => {
    // Creating a trade
    let docReference = await createTrade("5NoA7gdIGUhHOM0pv7iM1btKvm23", 45144, 13290);

    let tradeId = docReference.id;

    let docSnapshot = await getTrade(tradeId);

    // Testing that created trade is in the database with correct data
    expect(docSnapshot.get('creatorID')).toBe("5NoA7gdIGUhHOM0pv7iM1btKvm23");
    expect(docSnapshot.get('dropClassID')).toBe(45144);
    expect(docSnapshot.get('addClassID')).toBe(13290);    

    // Update the courses in a trade
    await updateTrade(tradeId, 44924, 38728);

    // Get the updated trade
    docSnapshot = await getTrade(tradeId);



    // Testing that the trade is updated with the correct data
    expect(docSnapshot.get('creatorID')).toBe("5NoA7gdIGUhHOM0pv7iM1btKvm23");
    expect(docSnapshot.get('dropClassID')).toBe(44924);
    expect(docSnapshot.get('addClassID')).toBe(38728);    

    // Testing that trade is deleted properly
    await deleteTrade(tradeId);
    expect(await getTrade(tradeId)).toBe(null);
});

// Checking that function that update trade match works
test ('Testing trade match updating', async () => {


    // Creating a trade
    let docReference = await createTrade("5NoA7gdIGUhHOM0pv7iM1btKvm23", 13085, 44411);

    let tradeId = docReference.id;

    let docSnapshot = await getTrade(tradeId);

    // Testing that created trade is in the database with correct data
    expect(docSnapshot.get('creatorID')).toBe("5NoA7gdIGUhHOM0pv7iM1btKvm23");
    expect(docSnapshot.get('dropClassID')).toBe(13085);
    expect(docSnapshot.get('addClassID')).toBe(44411);    

    // Attempt to match with oneself
    let updateRef = await updateTradeMatch(tradeId, "5NoA7gdIGUhHOM0pv7iM1btKvm23");
    expect(updateRef).toBe(null);

    // Get trade to make sure it is not changed
    docSnapshot = await getTrade(tradeId);
    expect(docSnapshot.get('status')).toBe("requested");
    expect(docSnapshot.get('matchID')).toBe(-1);


 
    // Update trade match 
    updateRef = await updateTradeMatch(tradeId, "CTkhfMkwezTBSwYs0GDx0jYSLDM2");

    // Get updated trade
    docSnapshot = await getTrade(tradeId);
    expect(docSnapshot.get('status')).toBe("matched");
    expect(docSnapshot.get('matchID')).toBe("CTkhfMkwezTBSwYs0GDx0jYSLDM2");

    // Testing that trade is deleted properly
    await deleteTrade(tradeId);
    expect(await getTrade(tradeId)).toBe(null);
});


// Checking that functions for creating and retrieving users work
test ('Testing addUser', async () => {

    // Creating a trade
    let docReference = await addUser("fake@tamu.edu", "Fake Name", "12345",
     "https://lh3.googleusercontent.com/a/AATXAJzgKHKZBnYOhYe8QvAWf5Mn4EG4eZj7bWRWDa_I=s96-c");


    let querySnapshot = await getUserInfo("12345");

    let docSnapshot = querySnapshot.docs[0];


    // Testing that created user is in the database with correct data
    expect(docSnapshot.get('email')).toBe("fake@tamu.edu");
    expect(docSnapshot.get('firstName')).toBe("Fake");
    expect(docSnapshot.get('lastName')).toBe("Name");    
    expect(docSnapshot.get('oAuthID')).toBe("12345");    
    expect(docSnapshot.get('displayName')).toBe("Fake Name");   
    expect(docSnapshot.get('photoURL')).toBe(
        "https://lh3.googleusercontent.com/a/AATXAJzgKHKZBnYOhYe8QvAWf5Mn4EG4eZj7bWRWDa_I=s96-c");    

    await deleteDoc(doc(db, "users", "12345"));

    expect(await getUserInfo("12345")).toBe(null);

});


