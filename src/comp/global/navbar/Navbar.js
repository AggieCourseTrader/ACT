import React from 'react';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link } from "react-router-dom";
import { signOut } from "../../../firebase-config";
import { useNavigate } from "react-router-dom";

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar(props) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
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
            sx={{ mr: 2, display: { xs: 'none', md: 'flex', color: '#500000' } }}
          >
            Aggie Course Trader
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu} sx={{color: 'primary'}} component = {Link} to = "/my-trades">
                <Typography textAlign="center" color="primary">My Trades</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu} sx={{color: 'primary'}} component = {Link} to = "/marketplace">
                <Typography textAlign="center" color="primary">Marketplace</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu} sx={{color: 'primary'}} component = {Link} to = "/messages">
                <Typography textAlign="center" color="primary">Messages</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, color: '#500000' }}
          >
            ACT
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button 
              key='Marketplace' 
              onClick={handleCloseNavMenu} 
              sx={{ my: 2, color: 'primary', display: 'block' }}
              component = {Link} to = "/marketplace"
            >
                Marketplace
            </Button>
            <Button 
              key='My Trades' 
              onClick={handleCloseNavMenu} 
              sx={{ my: 2, color: 'primary', display: 'block' }}
              component = {Link} to = "/my-trades"
            >
                My Trades
            </Button>
            <Button 
              key='Messages' 
              onClick={handleCloseNavMenu} 
              sx={{ my: 2, color: 'primary', display: 'block' }}
              component = {Link} to = "/messages"
            >
                Messages
            </Button>

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
                <Typography color = "primary">
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
