// import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from "react-router-dom";
import { Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function PageMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget); 
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button onClick = {handleClick}>
                <Typography color = "#500000">
                    {props.name}
                </Typography>
                <ArrowDropDownIcon sx={{ color: "#500000"}}/>
            </Button>
            <Menu
                anchorEl = {anchorEl}
                open = {open}
                anchorReference='anchorPosition'
                onClose = {handleClose}
                anchorPosition = {{top: 50, left: 0}}
                anchorOrigin = {{vertical: "top", horizontal: "left"}}
                transformOrigin = {{vertical: "top", horizontol: "left"}}
            >
                <MenuItem onClick = {handleClose} component = {Link} to = "/my-trades">
                    <Typography color = "#500000">
                        Trades
                    </Typography>
                </MenuItem>
                <MenuItem onClick = {handleClose} component = {Link} to = "/marketplace">
                    <Typography color = "#500000">
                        Marketplace
                    </Typography>
                </MenuItem>
                <MenuItem onClick = {handleClose}>
                    <Typography color = "#500000">
                        Messages
                    </Typography>
                </MenuItem>
            </Menu>
        </div>
    );
}