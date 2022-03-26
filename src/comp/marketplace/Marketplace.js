import React, { useState, useEffect } from 'react';
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
import {getTrades} from "../global/dbFunctions/CrudFunctions"
function Marketplace() {
  // Declare a new state variable, which we'll call "count"
  let navigate = useNavigate();
  const [user, setUser] = useState(false);
  const [addClass, setAddClass] = useState ({class:'', section: '', crn: ''});
  const [dropClass, setDropClass] = useState({class:'', section: '', crn: ''});

  useEffect(() => {
   onAuthStateChanged(auth, (user) => {
     if (user) {
      setUser(user);
     } else {
       navigate("/")
     }
    });
  
   }, /*removed dependency array*/)
  
  const matchButton = (params) => {
    return (
      <Button>
        Match
      </Button>
    )
  }

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
  let rows = [];
  const f = () => {
    if (addClass.class !== '' && addClass.section !== '' && dropClass.class !== '' && dropClass.section !== '') {
      let trades;
      (async () => {
      rows = [];
      trades = await getTrades(addClass.crn, dropClass.crn);
      // let trades;
      // tradeSnap.then((data) => {
      //   trades = data;
      // });
      console.log(trades);
      })();
      if (trades !== null) {
        console.log(trades);
        let counter = 0;
        trades.forEach((doc) => {
          // ensure trade isnt already matched
          if (doc.get('matchID') === -1) {
            // not matched, add to rows var
            counter++;
            let addClassString = addClass.class + ": " + addClass.section;
            let dropClassString = dropClass.class + ": " + dropClass.section;
            rows.push({id: counter, add: addClassString, drop: dropClassString});
          }
        })
      }
    }
  };
  f();
    
  // where only addClass is filled
  const columns = [
  // { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'add',
    headerName: 'Class I want to Add',
    flex: 1,
    editable: true,
    sortable: false,
  },
  {
    field: 'drop',
    headerName: 'Class I can Drop',
    flex: 1,
    editable: true,
    sortable: false,
  },
  {
    field: 'action',
    headerName: 'I want to Match',
    flex: 1,
    sortable: false,
    renderCell: matchButton,
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
            border: 2,
            borderRadius: 2,
            marginLeft: "15%",
            marginRight: '15%',
            height: 300
          }}>   
            {/* table section */}
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              rowHeight={38}
              disableSelectionOnClick
              disableColumnMenu
            />
            </Box>
            <Box sx = {{textAlign: "center", m: 2}}>
              <Button variant = "outlined" justifyContent = "center">
                Create Trade
              </Button>
            </Box>
        </Box>
      <Footer/>
    </div>
  );
}

export default Marketplace;