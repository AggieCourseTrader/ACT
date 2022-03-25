import * as React from 'react';

import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import Chip from '@mui/material/Chip';
import { TableContainer } from "@mui/material";
// import { Link } from "react-router-dom";

import { collection, onSnapshot, query, where} from 'firebase/firestore';
import { db } from '../../firebase-config';
import { getCoursesByCrn } from '../global/dbFunctions/CrudFunctions';

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';



export default function MyListings({userId}) {
  const listener = React.useRef(null);
  const [trades, setTrades] = React.useState([]);

  // Init listener
  React.useEffect(() => {
    const f = async () => {
      if(listener.current === null && userId !== undefined) {
        listener.current = onSnapshot(query(collection(db, "trades"), where("creatorID", "==", userId)), async (snap) => {
  
          let arr = [];
          snap.forEach((doc) => {
            arr.push(doc.data());
          });
  
          // The trade requests only have a crn so we have to get the course names from the crns
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
        });
      }
    }

    f();

    return () => {
      if(listener.current !== null){
        listener.current();
      }
    }
  }, [userId]);

  React.useEffect(() => {
    console.log(trades);
  }, [trades]);

  return (
      <React.Fragment>
        <Title>My Listings</Title>
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
                  <TableRow key={"my-listings-" + index}>
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
                      {/* TODO: Modal logic here */}
                      <IconButton>
                        <EditIcon/>
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