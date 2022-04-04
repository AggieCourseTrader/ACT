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

import { collection, getDocs,  query,  arrayUnion, setDoc, where, doc } from 'firebase/firestore';

import {getCreatedTrades, getMatchedTrades, db } from '../global/dbFunctions/CrudFunctions';


export default function MyMatches({user}) {
  const [trades, setTrades] = React.useState([]);

  // Init listener
  React.useEffect(() => {
    const f = async () => {
      console.log(user);
      if(user !== undefined) {
        const myTrades = await getCreatedTrades(user.uid);
        const otherTrades = await getMatchedTrades(user.uid);
  
        let arr = [];
        myTrades.forEach((doc) => {
          if(doc.data().matchID !== -1){
            arr.push({...doc.data(), connectingUserId: doc.data().matchID});
          }
          
        });
        console.log(arr)
  
        // Since we are not the creator of the trade the course being added or dropped is opposite for us
        otherTrades.forEach((doc) => {
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
        setTrades(arr);
        
      }
    }

    f();
  }, [user]);

  React.useEffect(() => {
    console.log(trades);
  }, [trades]);

  return (
      <React.Fragment>
        <Title>My Matches</Title>
        <TableContainer>
          <Table size="small">
            <TableBody>
              {trades.map((row, index) => {
                if(!("addClass" in row)  || !("dropClass" in row)) {
                  return false
                }
                if(!(row.addClass) || !(row.dropClass)) {
                  return false
                }
                return (
                  <TableRow key={"my-listings-" + index} >
                  <TableCell>
                  
                  <span style= {{verticalAlign:"middle", fontSize : "1.1em", color : "#525252" }}> Drop </span>
                  
                  <Chip size="small" color="primary" 
                        icon={<RemoveCircleOutlineIcon/>} 
                        style={{verticalAlign:"middle", backgroundColor:'#661429'}}
                        label={[row.dropClass.course  , <span style={{color: "#e0e0e0", verticalAlign: "middle", fontSize:"0.9em"}}>{"—" + row.dropClass.section}</span>]}/> 
                  
                  <span style={{verticalAlign:"middle" ,fontSize: "1.1em" , color : "#525252" }}> for </span>
                  
                  <Chip color="success" size="small" 
                        style={{verticalAlign:"middle", backgroundColor:'#5b6236'}} 
                        icon={<AddCircleOutlineIcon/>} 
                        label={[row.addClass.course  , <span style={{color: "#e0e0e0", verticalAlign: "middle", fontSize:"0.9em"}}>{"—" + row.addClass.section}</span>]}/>
                  
                  </TableCell>
                  <TableCell align="right">
                      <IconButton onClick={async (e) => {
                        let q = query(collection(db, "users"), where("oAuthID", "==", row.connectingUserId));
                        let docs = await getDocs(q);
                        docs.forEach(async (d) => {
                            let data = d.data();
                            // Remember we started talking to them
                            await setDoc(doc(db, "messageStatus", user.uid), {
                                "activeConversations" : arrayUnion({
                                    'id' : data.oAuthID,
                                    'fname' : data.firstName,
                                    'lname' : data.lastName
                                })
                            }, {merge : true});

                            // Notify them that we are talking to them
                            await setDoc(doc(db, "messageStatus", row.connectingUserId), {
                              "activeConversations" : arrayUnion({
                                  'id' : user.uid,
                                  'fname' : user.firstName,
                                  'lname' : user.lastName
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
                      }}component={Link} to="/messages">
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