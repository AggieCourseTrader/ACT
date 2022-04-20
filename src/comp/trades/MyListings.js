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
import Modal from '@mui/material/Modal';
import EditTrades from './EditTrades'
import Button from '@mui/material/Button';
import { collection, onSnapshot, query, where} from 'firebase/firestore';
import { db } from '../../firebase-config';
import {getTradeId} from '../global/dbFunctions/CrudFunctions';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import './editTrades.css';
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

export default function MyListings({userId}) {
  const { lessThan } = useResponsive();
  const listener = React.useRef(null);
  const [trades, setTrades] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [addClass, setAddClass] = React.useState (null);
  const [dropClass, setDropClass] = React.useState(null);
  const [tradeId, setTradeId] = React.useState(null);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  function handleOpen (add,drop) {
    (async () => {
      let tradeId = await getTradeId(userId, drop.crn, add.crn);
      setTradeId(tradeId)
    })();
    setAddClass(add)
    setDropClass(drop)
    setOpen(true);
  } 
  const handleClose = () => setOpen(false);

  // Init listener
  React.useEffect(() => {
    const f = async () => {
      if(listener.current === null && userId !== undefined) {
        listener.current = onSnapshot(query(collection(db, "trades"), where("creatorID", "==", userId)), async (snap) => {
  
          let arr = [];
          snap.forEach((doc) => {
            arr.push(doc.data());
          });
  
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

  return (
      <React.Fragment>
        <div style={{display:'flex', position:'relative'}}>
          <Title>My Listings</Title>
              <Modal
                className={"modalParent " + getSize(lessThan)}
                open={openAdd}
                onClose={handleCloseAdd}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"> 
                <EditTrades handleClose={handleCloseAdd} add={undefined} drop={undefined} tradeId={undefined} userId={userId}/>
              </Modal>
              <Button variant="contained" size="small" sx={{right:'10px', position:'absolute'}} onClick={handleOpenAdd}>Add</Button>
          </div>
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
                    <TableCell className={"tableCell " + getSize(lessThan)}>
                    
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
                    <TableCell className={"tableCell " + getSize(lessThan)} align="right">
                      <IconButton>
                        <EditIcon onClick={() => handleOpen({class: row.addClass.course, section: row.addClass.section, crn: row.addClass.crn},
                           {class:row.dropClass.course, section:row.dropClass.section, crn:row.dropClass.crn})}/>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal
            className={"modalParent " + getSize(lessThan)}
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"> 
            <EditTrades handleClose={handleClose} add={addClass} drop={dropClass} tradeId={tradeId}  userId={userId}/>
        </Modal>
      </React.Fragment>
  );
}