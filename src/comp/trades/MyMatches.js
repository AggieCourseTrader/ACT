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


import { getCoursesByCrn, getCreatedTrades, getMatchedTrades } from '../global/dbFunctions/CrudFunctions';


export default function MyMatches({userId}) {
  const [trades, setTrades] = React.useState([]);

  // Init listener
  React.useEffect(() => {
    const f = async () => {
      if(userId !== undefined) {
        const myTrades = await getCreatedTrades(userId);
        const otherTrades = await getMatchedTrades(userId);
  
        let arr = [];
        myTrades.forEach((doc) => {
          arr.push(doc.data());
        });
  
        // Since we are not the creator of the trade the course being added or dropped is opposite for us
        otherTrades.forEach((doc) => {
          const data = doc.data();
          const t = data.dropClassID;
          data.dropClassID = data.addClassID;
          data.addClassID = t;
  
          arr.push(data);
        });
  
        let crns = arr.map((d) => d.addClassID);
        crns = crns.concat(arr.map((d) => d.dropClassID));
  
        let courseData = await getCoursesByCrn(crns);
        // Merge the course names with the trade requests
        arr = arr.map((x) => {
          let ele = courseData.find(ele => ele.crn === x.addClassID);
          x.addClass = ele;
          ele = courseData.find(ele => ele.crn === x.dropClassID);
          x.dropClass = ele;
          return x;
        })
  
        // Return
        setTrades(arr);
      }
    }

    f();
  }, [userId]);

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
                      <IconButton component={Link} to="/messages">
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