import '../../config.js';
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
import { getTrade, createTrade, getReviews, getUserInfo, doesUserExist} from "../global/dbFunctions/CrudFunctions"
import Chip from '@mui/material/Chip';
import TermsContext from '../global/authentication/TermsContext'
import CircularProgress from '@mui/material/CircularProgress';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
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

  const {termContext,setTermContext} = useContext(TermsContext)
  const [alert, setAlert] = useState(false);
  // below is for modal
  const [open, setOpen] = React.useState(false);



  const { enqueueSnackbar } = useSnackbar();


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
      if(user) {
        if(termContext) {
         setUser(user);
        } else {
          (async () => {
            let doesUser = await doesUserExist(user.uid);
            if(doesUser) {
              setTermContext(true)
            } else {
              navigate("/terms")
            }
          })(); 
        }
      } else {
        navigate("/")
      }
     });
    }, /*removed dependency array*/)



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
        <Box className={"createTradeBox"}>
            <Button variant = "outlined" justifyContent = "center"
              className={(alert) ? "createTradeButton loading" : "createTradeButton"}
              onClick={ async () => {
                if(alert == true) {
                  return;
                }
                if (addClass.class !== '' && addClass.section !== '' && dropClass.class !== '' && dropClass.section !== '') {
                  setAlert(true);
                  const val = await createTrade(user.uid, dropClass.crn, addClass.crn);
                  setAlert(false);
                  if(val !== null) {
                    enqueueSnackbar('Trade Created', { variant: 'success' }); }
                  else { 
                    enqueueSnackbar('Trade already exists', { variant: 'error' });
                  }
                }

                else {
                  enqueueSnackbar('Please fill out all fields', { variant: 'info' });
                }
              }}
            >
              Create Trade
            </Button>
            {alert && (
              <CircularProgress
                className="buttonProgress"
                size={24}
              />
            )}

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