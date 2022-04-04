import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import {onAuthStateChanged, auth} from '../../firebase-config'
import CourseSearchBox  from '../global/courseSearchBox/CourseSearchBox'
import { db } from '../global/dbFunctions/CrudFunctions'
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Navbar from '../global/navbar/Navbar';
import Footer from "../global/Footer";
import { updateTradeMatch, createTrade,/* getReviews*/} from "../global/dbFunctions/CrudFunctions"
import Chip from '@mui/material/Chip';

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


import { onSnapshot, query, collection, where, limit} from 'firebase/firestore';
function Marketplace() {
  // Declare a new state variable, which we'll call "count"
  let navigate = useNavigate();
  const [user, setUser] = useState(false);
  const [addClass, setAddClass] = useState ({class:'', section: '', crn: ''});
  const [dropClass, setDropClass] = useState({class:'', section: '', crn: ''});

  const [rows, setRows] = useState([]);
  const tradesListener = useRef(null);

  const [myTradeRows, setMyTradeRows] = useState([]);
  //const [reviews, setReviews] = useState([]);
  const myTrades = useRef(null);

  useEffect(() => {
   onAuthStateChanged(auth, (user) => {
     if (user) {
      setUser(user);
     } else {
       navigate("/")
     }
    });
  
   }, /*removed dependency array*/)

  // const selectionDropCallback = (data) => {
  //   if(data !== undefined){
  //     if(typeof data === 'object'){
  //       if(data.name){
  //         setDropClass({...dropClass, class:data.name})
  //       } else if (data.crn) {
  //         setDropClass({...dropClass, section:data.section, crn:data.crn})
  //       } 
  //     }
  //   } else {
  //     setDropClass({class:'', section: '', crn: '' })
  //   }
  // }

  // where both addClass and dropClass are filled
  // let rows = [];

  //! ----------------------------------------------//
  // addclass and dropclass

  // get my trades

  // get other trader

  // q = query where "addClass.course" === addClass.class
  //           where "addClass.section" === addClass.section
  //           where "dropClass.course" === dropClass.class
  //           where "dropClass.section" === dropClass.section


  //! ----------------------------------------------//


  useEffect(() => {
    if(!user.uid) {
      return;
    }
    //* Get trades listed by others
    let conditions = [where("creatorID", "!=", user.uid), where("status", "==", "requested")]
    if(dropClass.class !== "") conditions.push(where("addClass.course", "==", dropClass.class))
    if(dropClass.section !== "") conditions.push(where("addClass.section", "==", dropClass.section))
    if(addClass.class !== "") conditions.push(where("dropClass.course", "==", addClass.class))
    if(addClass.section !== "") conditions.push(where("dropClass.section", "==", addClass.section))
    console.log(conditions)
    tradesListener.current = onSnapshot(query(collection(db, "trades"), ...conditions, limit(50)), 
      (snap) => {
        let arr = [];
        snap.forEach((doc) => {
          const data = doc.data();
          arr.push({
            id: doc.id,
            add: data.dropClass,
            drop: data.addClass
          });
        });
        console.log("here");
        setRows(arr);
      });
           
    //* Get trades listed by me
    console.log(user.uid);
    conditions = [where("creatorID", "==", user.uid), where("status", "==", "requested")]
    if(addClass.class !== "") conditions.push(where("addClass.course", "==", addClass.class))
    if(addClass.section !== "") conditions.push(where("addClass.section", "==", addClass.section))
    if(dropClass.class !== "") conditions.push(where("dropClass.course", "==", dropClass.class))
    if(dropClass.section !== "") conditions.push(where("dropClass.section", "==", dropClass.section))
    console.log(conditions);
    myTrades.current = onSnapshot(query(collection(db, "trades"), ...conditions, limit(50)), 
      (snap) => {
        let arr = [];
        snap.forEach((doc) => {
          const data = doc.data();

          arr.push({
            id: doc.id,
            add: data.addClass,
            drop: data.dropClass
          });
          
        });
        console.log("here");
        setMyTradeRows(arr);
      });

    //* Remove any event listeners
    return () => {
      if(tradesListener.current !== null) {
        tradesListener.current();
      }
      if(myTrades.current !== null) {
        myTrades.current();
      }
    }
  }, [addClass, dropClass, user]);


    
  // where only addClass is filled
  const columns = [
  // { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'add',
    headerName: 'Class I want to Add',
    flex: 1,
    editable: true,
    sortable: false,
    renderCell: (params) => (
      <Chip color="success" size="small" 
      style={{verticalAlign:"middle", backgroundColor:'#5b6236'}} 
      icon={<AddCircleOutlineIcon/>} 
      label={[params.value.course  , <span style={{color: "#e0e0e0", verticalAlign: "middle", fontSize:"0.9em"}}>{"—" + params.value.section}</span>]}/>
    )
  },
  {
    field: 'drop',
    headerName: 'Class I can Drop',
    flex: 1,
    editable: true,
    sortable: false,
    renderCell: (params) => (
      <Chip size="small" color="primary" 
        icon={<RemoveCircleOutlineIcon/>} 
        style={{verticalAlign:"middle", backgroundColor:'#661429'}}
        label={[params.value.course  , <span style={{color: "#e0e0e0", verticalAlign: "middle", fontSize:"0.9em"}}>{"—" + params.value.section}</span>]}
      /> 
    )
  },
  {
    field: 'action',
    headerName: 'I want to Match',
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <strong>
        <Button
          variant = 'outlined'
          onClick={() => {
            updateTradeMatch(params.id, user.uid);
            alert('match successful');
          }}
        >
          Trade
        </Button>
      </strong>
    )
  },
];

// const rows = [
//   { id: 1, add: 'CSCE 110: 401', drop: 'CSCE 121: 503'},
//   { id: 2, add: 'CSCE 210: 302', drop: 'CSCE 221: 503'},
//   { id: 3, add: 'CSCE 310: 501', drop: 'CSCE 321: 503'},
//   { id: 4, add: 'CSCE 410: 411', drop: 'CSCE 421: 503'},
//   { id: 5, add: 'CSCE 421: 212', drop: 'CSCE 411: 503'},
//   { id: 6, add: 'CSCE 489: 301', drop: 'CSCE 222: 503'},
//   { id: 7, add: 'CSCE 482: 402', drop: 'CSCE 310: 503'},
//   { id: 8, add: 'CSCE 315: 305', drop: 'CSCE 470: 503'},
//   { id: 9, add: 'CSCE 312: 207', drop: 'CSCE 420: 503'},
// ];

  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };


/*
  function getBio(id) {
    (async () => {
      let arr = []
      let reviews = await getReviews(id);
      if(reviews !== null) {
        reviews.forEach((doc) => {
          arr.push(doc.data().review)
        });
      }
      setReviews(arr)
    })();
  } 
  */

   const selectionAddCallback = (data) => {
    if(data !== undefined){
      if(typeof data === 'object') {
        if(data.name){
          setAddClass({...addClass, class:data.name})
        } else if (data.crn) {
          setAddClass({...addClass, section:data.section, crn:data.crn})
        } 
      } else {
        setAddClass({class:'', section: '', crn: '' })
      }
    }
    else {
      setAddClass({class:'', section: '', crn: '' })
    }
  }

  const selectionDropCallback = (data) => {
    if(data !== undefined){
      if(typeof data === 'object'){
        if(data.name){
          setDropClass({...dropClass, class:data.name})
        } else if (data.crn) {
          setDropClass({...dropClass, section:data.section, crn:data.crn})
        } 
      }
      else {
        setDropClass({class:'', section: '', crn: '' })
      }
    } else {
      setDropClass({class:'', section: '', crn: '' })
    }

  }

  console.log(addClass)
  console.log(dropClass)

  return (
    <div>
      <Navbar name = "Trade Marketplace" auth={auth} user={user}/>
      <Box sx={{ flexGrow: 1, height: '80vh', background: '#f6f6f6'}}>
        <Box sx={{ flexGrow: 1}}>
            <Box sx = {{display: "flex", justifyContent: "center", flexWrap : "wrap", m: 2}}>

              <Typography sx = {{
                fontSize : "4vmin",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                color : "#500000",
                fontWeight: "lighter"
              }}>I want a spot in </Typography>

              <CourseSearchBox db={db} selectionCallBack={selectionAddCallback} />

            </Box>
            <Box sx = {{display: "flex", justifyContent: "center", m: 2}}>

            <Typography sx = {{
                fontSize : "4vmin",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                color : "#500000",
                fontWeight: "lighter"
              }}>I can drop </Typography>

              <CourseSearchBox db={db} selectionCallBack={selectionDropCallback} />
            </Box>
          </Box>
          <Box sx = {{
            // border: 2,
            // borderRadius: 2,
            marginLeft: "15%",
            marginRight: '15%',
            height: 300
          }}>   
            {/* table section */}
            <DataGrid
              rows={rows.concat(myTradeRows)}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              rowHeight={38}
              disableSelectionOnClick
              disableColumnMenu
            />
            </Box>
            <Box sx = {{textAlign: "center", m: 2}}>
              <Button variant = "outlined" justifyContent = "center"
                onClick={() => {
                  if (addClass.class !== '' && addClass.section !== '' && dropClass.class !== '' && dropClass.section !== '') {
                    createTrade(user.uid, dropClass.crn, addClass.crn);
                    alert('trade request created \nadd ' + addClass.class + ': ' + addClass.section + ' and drop ' + dropClass.class + ': ' + dropClass.section);
                  }
                }}
              >
                Create Trade
              </Button>
            </Box>
        </Box>
      <Footer/>
    </div>
  );
}

export default Marketplace;