import '../../config.js';
import React from 'react';
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  footer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: "#500000",
    height: '10vh'
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
     </div>
  );
}

export default Footer;