import React from 'react';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link } from "react-router-dom";
import { signOut } from "../../../firebase-config";
import { useNavigate } from "react-router-dom";

function ResponsiveAppBar(props) {
  // const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // const handleOpenNavMenu = (event) => {
  //   setAnchorElNav(event.currentTarget);
  // };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  // const handleCloseNavMenu = () => {
  //   setAnchorElNav(null);
  // };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [auth/*, setAuth*/] = useState(props.auth);
  const navigate = useNavigate();
  const signOutFunction = () => {
    signOut(auth).then(() => {
    // Sign-out successful.
        console.log("Sign out successful");
        navigate("/");
    }).catch((error) => {
        // An error happened.
        console.log("Sign out failed");
    });
  }

  return (
    <AppBar position="static" style={{background: '#FFFFFF'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex', color: '#500000'} }}
          >
            Aggie Course Trader
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <div>
              <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{ my: 2, color: '#500000'}}
              >
                {props.name}
                <ArrowDropDownIcon/>
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={handleClose} sx={{color: '#500000'}} component = {Link} to = "/my-trades">My Trades</MenuItem>
                <MenuItem onClick={handleClose} sx={{color: '#500000'}} component = {Link} to = "/marketplace">Marketplace</MenuItem>
                <MenuItem onClick={handleClose} sx={{color: '#500000'}} component = {Link} to = "/messages">Messages</MenuItem>
              </Menu>
            </div>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
              <Button onClick={handleOpenUserMenu} sx={{ p: 0 , color: '#500000'}}>
                {props.user.displayName}
              </Button>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                <MenuItem onClick = {signOutFunction}>
                  <Typography color = "#500000">
                      Sign Out
                  </Typography>
                </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
