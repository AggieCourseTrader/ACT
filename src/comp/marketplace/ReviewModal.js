import React from 'react';
import {updateTradeMatch} from '../global/dbFunctions/CrudFunctions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Chip from '@mui/material/Chip';
import { Link } from "react-router-dom";



const useStyles = makeStyles({
    wrapper: {
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      textAlign: "center",
      marginTop: "2%"
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: "center",
      width: '100%',
      marginRight: "10%",
      marginLeft: "10%",
      flexWrap: 'wrap',
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 60/2,
    },
    paper: {
        padding: "6px 16px",
    },
    reviews: {
        overflowY: "auto",
        height: "14em",
    }
  });

function ReviewModal(props) {
    console.log(props.experiencePercentage)
    const classes = useStyles();
    return (
        <Box sx={{   
            position: 'absolute',
            bgcolor: '#f6f6f6',
            border: '2px solid #000',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: "25em",
            height: "32em",
            boxShadow: 24,}}
            >
            {/* working here. Need to iterate through every review and display them here */}
            {/* additionally, also need to display user info like name */}
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <Typography sx = {{
                        fontSize : 30,
                        color : "#500000",
                        fontWeight: "lighter"
                    }}>
                        Meet the Trade Creator
                    </Typography>
                </div>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <img className={classes.circle} src={props.creatorInfo.photoURL} alt="avatar"/>
                </div>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <Typography id="modal-modal-title" variant="h6">
                        {props.creatorInfo.firstName} {props.creatorInfo.lastName}
                    </Typography>
                </div>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    {props.hasReviews
                        ?<Typography id="modal-modal-title" variant="subtitle2">{props.experiencePercentage}% positive trade experience</Typography>
                        :<Typography variant="subtitle2" sx={{color: "red"}}>No reviews left yet</Typography>
                    }
                </div>
            </div>
                {/* import array of info about each review: 
                    want reviewer's name, date reviewed */}
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <div className={classes.reviews}>
                        {props.reviews.map((review) => 
                            <>
                                { (review.review !== "")
                                    ?<Card 
                                        sx={{ 
                                            marginBottom: "2%" , maxWidth: "20em", overflowWrap: "anywhere", minWidth: "20em",
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="subtitle2" align="left" gutterBottom='true'>Review By {review.firstName} {review.lastName}</Typography> 
                                            <Typography variant="body2" align="left" gutterBottom='true'>
                                                {review.review}
                                            </Typography> 
                                        </CardContent>
                                    </Card>
                                    :<div></div>
                                }   
                            </>       
                        )}
                    </div>
                </div>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <Button
                        variant = 'outlined'
                        onClick={() => {
                            updateTradeMatch(props.tradeID, props.user.uid);
                        }}
                        component = {Link} to ="/my-trades"
                    >
                        Confirm Trade
                    </Button>
                </div>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <Chip size="small" color="primary" sx={{marginRight: '1%'}}
                        icon={<AddCircleOutlineIcon/>} 
                        style={{verticalAlign:"middle", backgroundColor:'#5b6236'}}
                        label={[props.addClass  , <span style={{color: "#e0e0e0", verticalAlign: "middle", fontSize:"0.9em"}}/>]}
                    />
                    <Chip size="small" color="primary" sx={{marginLeft: '1%'}}
                        icon={<RemoveCircleOutlineIcon/>} 
                        style={{verticalAlign:"middle", backgroundColor:'#661429'}}
                        label={[props.dropClass  , <span style={{color: "#e0e0e0", verticalAlign: "middle", fontSize:"0.9em"}}/>]}
                    />
                </div>
            </div>
          </Box>
    );
    
}
export default ReviewModal;