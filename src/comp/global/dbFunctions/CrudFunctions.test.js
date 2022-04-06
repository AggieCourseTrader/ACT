/**
 * @jest-environment node
 */

import { doc, getDoc } from "firebase/firestore";
import { db, trades, createTrade, deleteTrade, getTrade } from "./CrudFunctions"



/*
test('Create Trade', () => {
    return createTrade("5NoA7gdIGUhHOM0pv7iM1btKvm23", 15977, 34157).then((docReference) => {
    
        docReference.get().then((docSnapshot) => {
            expect(docSnapshot.get('creatorID')).toBe("5NoA7gdIGUhHOM0pv7iM1btKvm23");
            expect(docSnapshot.get('dropClassID')).toBe(15977);
            expect(docSnapshot.get('addClassID')).toBe(34157);
        });  

    });
});
*/
/*
describe('Async test', () => {
    async function fetchData() {
        return 'peanut butter';
    }

    test('the data is peanut butter', async () => {
        const data = await fetchData();
        expect(data).toBe('peanut butter');
    });
}); 
*/
 
let tradeId;

test ('Create trade, get trade, and delete trade', async () => {

    let docReference = await createTrade("5NoA7gdIGUhHOM0pv7iM1btKvm23", 15977, 34157);

    tradeId = docReference.id;

    let docSnapshot = await getTrade(tradeId);

    // Testing that created trade is in the database with correct data
    expect(docSnapshot.get('creatorID')).toBe("5NoA7gdIGUhHOM0pv7iM1btKvm23");
    expect(docSnapshot.get('dropClassID')).toBe(15977);
    expect(docSnapshot.get('addClassID')).toBe(34157);    

    // Making sure when user attempts to create the same trade,
    // the trade is not created
    expect(await createTrade("5NoA7gdIGUhHOM0pv7iM1btKvm23", 15977, 34157)).toBe(null);

    // Making sure a trade with courses that do not exist cannot be createdAt
    expect(await createTrade("5NoA7gdIGUhHOM0pv7iM1btKvm23", 12345789, 34157)).toBe(null);
    expect(await createTrade("5NoA7gdIGUhHOM0pv7iM1btKvm23", 15977, 987654321)).toBe(null);
    expect(await createTrade("5NoA7gdIGUhHOM0pv7iM1btKvm23", 12345789, 987654321)).toBe(null);

    // Testing that trade is deleted properly
    await deleteTrade(tradeId);
    expect(await getTrade(tradeId)).toBe(null);
});



//tradeId = ;

//deleteTrade();

//test('deleteTrade: Trade is deleted', () => {
//    expect(getTrade(tradeId)).toBe(null);
//});

//let existingTradeSnap = await createTrade();

//let nonExistingCoursesTrade = await createTrade();





