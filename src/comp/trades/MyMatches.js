import * as React from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import IconButton from "@mui/material/IconButton";
import {TableContainer} from "@mui/material";
import {Link} from "react-router-dom";

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Chip from '@mui/material/Chip'

import { collection, getDocs,  query,  arrayUnion, setDoc, where, doc, onSnapshot } from 'firebase/firestore';

import { db } from '../global/dbFunctions/CrudFunctions';
import './myListings.css';
import { useResponsive } from '@farfetch/react-context-responsive';

const getSize = (lT) => {
  if(lT.sm) {
    return 'xs';
  }
  else if(lT.md) {
    return 'sm';
  }
  else if(lT.lg) {
    return 'md';
  }
  else if(lT.xl) {
    return 'lg';
  }
  else {
    return 'xl';
  }
}

export default function MyMatches({user}) {
  const [myTrades, setMyTrades] = React.useState([]);
  const [otherTrades, setOtherTrades] = React.useState([]);
  const listenerM = React.useRef(null);
  const listenerO = React.useRef(null);
  const { lessThan } = useResponsive();
  // Init listener
  React.useEffect(() => {
    const f = async () => {
      const userId = user?.uid;
      if(listenerO.current === null && userId !== undefined) {
        listenerO.current = onSnapshot(query(collection(db, "trades"), where("creatorID", "==", userId)), async (snap) => {
  
          let arr = [];
          snap.forEach((doc) => {
            if(doc.data().matchID !== -1){
              arr.push({...doc.data(), connectingUserId: doc.data().matchID});
            }
          });
  
          // Return
          setMyTrades(arr);
        });
      }
      if(listenerM.current === null && userId !== undefined) {
        listenerM.current = onSnapshot(query(collection(db, "trades"), where("matchID", "==", userId)), async (snap) => {
  
          let arr = [];
          snap.forEach((doc) => {
            const data = doc.data();
            let t = data.dropClassID;
            data.dropClassID = data.addClassID;
            data.addClassID = t;
            t = data.dropClass
            data.dropClass = data.addClass
            data.addClass = t
            data.connectingUserId = doc.data().creatorID
            arr.push(data);
          });
  
          // Return
          setOtherTrades(arr);
        });
      }
    }

    f();

    return () => {
      if(listenerO.current !== null){
        listenerO.current();
      }
      if(listenerM.current !== null){
        listenerM.current();
      }
    }
  }, [user]);



  return (
      <React.Fragment>
        <Title>My Matches</Title>
        <TableContainer>
          <Table size="small">
            <TableBody>
              {myTrades.concat(otherTrades).map((row, index) => {
                if(!("addClass" in row)  || !("dropClass" in row)) {
                  return false
                }
                if(!(row.addClass) || !(row.dropClass)) {
                  return false
                }
                return (
                  <TableRow key={"my-listings-" + index} >
                  <TableCell className={"tableCell " + getSize(lessThan)}>
                  
                  <span style= {{verticalAlign:"middle", fontSize : "1.1em", color : "#525252" }}> Drop </span>
                  
                  <Chip size="small" color="primary" 
                        icon={<RemoveCircleOutlineIcon/>} 
                        style={{verticalAlign:"middle", backgroundColor:'#661429'}}
                        label={[row.dropClass.course  , <span style={{color: "#e0e0e0", verticalAlign: "middle", fontSize:"0.9em"}}>{"???" + row.dropClass.section}</span>]}/> 
                  
                  <span style={{verticalAlign:"middle" ,fontSize: "1.1em" , color : "#525252" }}> for </span>
                  
                  <Chip color="success" size="small" 
                        style={{verticalAlign:"middle", backgroundColor:'#5b6236'}} 
                        icon={<AddCircleOutlineIcon/>} 
                        label={[row.addClass.course  , <span style={{color: "#e0e0e0", verticalAlign: "middle", fontSize:"0.9em"}}>{"???" + row.addClass.section}</span>]}/>
                  
                  </TableCell>
                  <TableCell className={"tableCell " + getSize(lessThan)} align="right">
                      <IconButton onClick={async (e) => {
                        let q = query(collection(db, "users"), where("oAuthID", "==", row.connectingUserId));
                        let docs = await getDocs(q);
                        docs.forEach(async (d) => {
                            let data = d.data();
                            // Remember we started talking to them
                            await setDoc(doc(db, "messageStatus", user.uid), {
                                "activeConversations" : arrayUnion({
                                  'id' : data.oAuthID,
                                  'addClass' : row.addClass.course,
                                  'addClassSection' : row.addClass.section,
                                  'dropClass' : row.dropClass.course,
                                  'dropClassSection' : row.dropClass.section,
                                  'fname' : data.firstName,
                                  'lname' : data.lastName,
                                  'photoURL' : data.photoURL,
                                  'tradeId' : row.trade_id,
                                  'status' : 'active',
                                  'creatorId' : row.creatorID,
                                })
                            }, {merge : true});

                            // Notify them that we are talking to them
                            console.log("here");
                            await setDoc(doc(db, "messageStatus", row.connectingUserId), {
                              "activeConversations" : arrayUnion({
                                'id' : user.uid,
                                'fname' : user.displayName.split(' ')[0],
                                'lname' : user.displayName.split(' ')[1],
                                'photoURL' : user.photoURL,
                                'dropClass' : row.addClass.course,
                                'dropClassSection' : row.addClass.section,
                                'addClass' : row.dropClass.course,
                                'addClassSection' : row.dropClass.section,
                                'tradeId' : row.trade_id,
                                'status' : 'active',
                                'creatorId' : row.creatorID,
                              })
                            }, {merge : true});
                            // const theirDoc = await getDoc(doc(db, "messageStatus", row.connectingUserId));
                            // if(theirDoc.exists) {
                            //   console.log("There doc exists");

                            // }
                            // else {
                            //   console.log("There doc does not exists");
                            // }

                        });
                      }}component={Link}
                      to = {"/messages"}
                      state = {{'tradeId' : row.trade_id}}
                      >

                        <ChatIcon/>
                      </IconButton>
                    </TableCell>
                  </TableRow>
              )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </React.Fragment>
  );
}