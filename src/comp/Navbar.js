import React from 'react';
// import { useState } from 'react';
import PageMenu from './Navbar_PageMenu'
import UserMenu from './Navbar_UserMenu'
import { AppBar, Toolbar, Typography } from '@mui/material';
import {makeStyles} from '@mui/styles';

const useStyles = makeStyles(() => ({
  header: {
      backgroundColor: "#FFFFFF !important",
      // marginBottom: "3%",
  },
  logo: {
      color: "#500000",
      fontWeight: "bold",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

export default function Navbar(props) {
    const {header, logo,toolbar} = useStyles();

    const displayDesktop = () => {
      return (
        <div>
          <Toolbar className = {toolbar}>
            <PageMenu name = {props.name} justifyContent = "flex-start"/>
            {courseTraderLogo}
            <UserMenu name = {props.user.displayName} auth = {props.auth}/>
          </Toolbar>
        </div>
        );
    };

    const courseTraderLogo = (
        <Typography variant = "h4" align = "center" className = {logo}>
            Aggie Course Trader
        </Typography>
    )

    return (
      <header>
        <AppBar className = {header}>{displayDesktop()}</AppBar>
      </header>
    );
  }
