import React from 'react';
// import { useState } from 'react';
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import SignOutButton from './SignOutButton'
import {auth} from "../firebase-config";

function Footer(props) {
  return (
     <div>
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
     </div>
  );
}

export default Footer;