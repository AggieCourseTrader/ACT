import React, { useState } from 'react';
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

function Footer(props) {
  return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
  );
}

export default Footer;