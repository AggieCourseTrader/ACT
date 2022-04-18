import '../../config.js';
import React from 'react';
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { makeStyles } from '@mui/styles';
import Privacy from '../../assets/PrivacyPolicy.pdf'
import ToS from '../../assets/ToS.pdf'

const useStyles = makeStyles({
  footer: {
    display: 'block',
    justifyContent: 'center',
    alignItems: 'center',
    background: "#500000",
    height: '10vh',
    padding: '.5%'
  }
});

function Footer(props) {
  const classes = useStyles();
  return (
     <div className={classes.footer}>
      <Typography variant="body2" color='secondary' align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Aggie Course Trader
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
      <br></br>
      <Typography variant="body2" color='secondary' align="center" {...props}>
        View our full{' '} 
        <Link color="inherit" href={Privacy} target="_blank">
          Privacy Policy
        </Link>{' '}
        and
        {' '}<Link color="inherit" href={ToS} target="_blank">
          Terms of Service 
        </Link>
      </Typography>
     </div>
  );
}

export default Footer;