import React, { useState, useEffect, useRef, useContext } from 'react';
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
import { getTrade, createTrade, getReviews, getUserInfo} from "../global/dbFunctions/CrudFunctions"
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Modal from '@mui/material/Modal';
import ReviewModal from '../marketplace/ReviewModal';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useResponsive } from '@farfetch/react-context-responsive';

import { useSnackbar } from 'notistack';

import './marketplace.css';

import { onSnapshot, query, collection, where, limit} from 'firebase/firestore';
function Marketplace() {
  // Declare a new state variable, which we'll call "count"
  const { lessThan } = useResponsive();
  let navigate = useNavigate();
  const [user, setUser] = useState(false);
  const [addClass, setAddClass] = useState ({class:'', section: '', crn: ''});
  const [dropClass, setDropClass] = useState({class:'', section: '', crn: ''});
  const [tradeID, setTradeID] = useState([]);
  const [modalDropClass, setModalDropClass] = useState([]);
  const [modalAddClass, setModalAddClass] = useState([]);

  const [rows, setRows] = useState([]);
  const tradesListener = useRef(null);

  const [myTradeRows, setMyTradeRows] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [creatorInfo, setCreatorInfo] = useState([]);
  const myTrades = useRef(null);
  const [experiencePercentage, setExperiencePercentage] = useState(-1);
  const [hasReviews, setHasReviews] = useState(false);

  const [alert, setAlert] = useState(null)
  // below is for modal
  const [open, setOpen] = React.useState(false);



  const { enqueueSnackbar, closeSnackbar } = useSnackbar();


  const handleClose = () => {
    setOpen(false);
    setHasReviews(false)
    setReviews([])
    setCreatorInfo([])
    setTradeID([])
    setModalDropClass([])
    setModalAddClass([])
    setExperiencePercentage(-1)
  }

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
    tradesListener.current = onSnapshot(query(collection(db, "trades"), ...conditions, limit(50)), 
      (snap) => {
        let arr = [];
        snap.forEach((doc) => {
          const data = doc.data();
          arr.push({
            id: doc.id,
            add: data.dropClass,
            drop: data.addClass,
            creatorId: data?.creatorID,
          });
        });
        setRows(arr);
      });
           
    //* Get trades listed by me
    conditions = [where("creatorID", "==", user.uid), where("status", "==", "requested")]
    if(addClass.class !== "") conditions.push(where("addClass.course", "==", addClass.class))
    if(addClass.section !== "") conditions.push(where("addClass.section", "==", addClass.section))
    if(dropClass.class !== "") conditions.push(where("dropClass.course", "==", dropClass.class))
    if(dropClass.section !== "") conditions.push(where("dropClass.section", "==", dropClass.section))
    myTrades.current = onSnapshot(query(collection(db, "trades"), ...conditions, limit(50)), 
      (snap) => {
        let arr = [];
        snap.forEach((doc) => {
          const data = doc.data();

          arr.push({
            id: doc.id,
            add: data.addClass,
            drop: data.dropClass,
            creatorId: data?.creatorID,
          });
          
        });
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
    editable: false,
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
    editable: false,
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
    // flex: 1,
    flex: 0.6,
    sortable: false,
    // working here, change this button so that it brings up a modal that has a button that has trading functionality
    renderCell: (params) => (
      <strong>
        <Button
          sx={(params.row?.creatorId === user?.uid) ? 
            {
              opacity: 0.5,
              backgroundColor: '#DCDCDC',
              cursor: 'not-allowed',
          } : false}
          variant = 'outlined'
          onClick={() =>  {
            console.log(params);
            if(params.row?.creatorId === user?.uid){
              enqueueSnackbar("You can't trade with yourself!", {variant: 'error'});
            }
            else {
              getBio(params.id);
            }
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



  function getBio(id) {
    (async () => {
      let trade = await getTrade(id);
      setModalDropClass(trade.data().dropClass.course + "-" + trade.data().dropClass.section);
      setModalAddClass(trade.data().addClass.course + "—" + trade.data().addClass.section);
      let creatorID = trade.data().creatorID
      let arr = []
      let reviews = await getReviews(creatorID);
      let sumTotal = 0
      let sumGood = 0
      if(reviews !== null) {
        setHasReviews(true)
        reviews.forEach(async (doc) => {
          let creatorID = doc.data().reviewerID
          let creatorInfo = await getUserInfo(creatorID)
          let firstName, lastName;
          creatorInfo.forEach((info) => {
            firstName = info.data().firstName
            lastName = info.data().lastName
          })
          if(doc.data().positiveExperience) {
            sumGood = sumGood+1
          }
          sumTotal = sumTotal+1
          setExperiencePercentage(Math.round(sumGood/sumTotal*100))
          arr.push({firstName: firstName, lastName: lastName, review: doc.data().review})
        });
      }
      setReviews(arr)

      let info = await getUserInfo(creatorID);
      info.forEach((doc) => {
        setCreatorInfo(doc.data());
      });
      setTradeID(id);
    })();
    setOpen(true)
  } 

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

  return (
    <>
      
      <Navbar name = "Trade Marketplace" auth={auth} user={user}/>
      <Box className={"outBox " + getSize(lessThan)}>
        <Box className={"inBox " + getSize(lessThan)}>
          <Box className={"csb " + getSize(lessThan)}>
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
          <Box className={"csb " + getSize(lessThan)}>

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
        <Box className={"tableBox " + getSize(lessThan)}>   
          {/* table section */}
          <DataGrid
            rows={rows.concat(myTradeRows)}
            columns={columns}
            pageSize={(lessThan.sm) ? 4 : 5}
            rowsPerPageOptions={[5]}
            rowHeight={38}
            disableSelectionOnClick
            disableColumnMenu
          />
        </Box>
        <Box sx = {{textAlign: "center", m: 2}}>
            <Button variant = "outlined" justifyContent = "center"
              onClick={ async () => {
                if (addClass.class !== '' && addClass.section !== '' && dropClass.class !== '' && dropClass.section !== '') {
                  const val = await createTrade(user.uid, dropClass.crn, addClass.crn);
                  if(val !== null) {
                    // this doesnt show up. look into mui alerts to figure how this works
                    enqueueSnackbar('Trade Created', { variant: 'success' });
                    // setAlert(
                    // <Alert severity="success">
                    //   <AlertTitle>Success</AlertTitle>
                    //   trade request created
                    // </Alert>
                    // );
                    // alert('trade request created \nadd ' + addClass.class + ': ' + addClass.section + ' and drop ' + dropClass.class + ': ' + dropClass.section);
                  }
                  else { 
                    enqueueSnackbar('Trade already exists', { variant: 'error' });
                    // setAlert(
                    //   <Alert severity="error">
                    //     <AlertTitle>Failure</AlertTitle>
                    //     trade already exists
                    //   </Alert>
                    //   );
                  }
                }
              }}
            >
              Create Trade
            </Button>
            <div className="Alert">{alert}</div>
        </Box>
        <Footer/>
          
        </Box>
      <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
          <ReviewModal hasReviews={hasReviews} reviews={reviews} creatorInfo={creatorInfo} tradeID={tradeID} user={user} addClass={modalDropClass} dropClass={modalAddClass} experiencePercentage={experiencePercentage}/>
        </Modal>
    </>
  );
}

export default Marketplace;