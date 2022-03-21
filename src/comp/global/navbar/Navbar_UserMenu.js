import React, { useState } from 'react';
import { signOut } from "../../../firebase-config";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Typography } from '@mui/material';

export default function UserMenu(props) {
    const [anchorEl, setanchorEl] = useState(null);

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

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setanchorEl(event.currentTarget); 
    };

    const handleClose = () => {
        setanchorEl(null);
    };

    return (
        <div>
            <Button onClick = {handleClick} sx = {{pl: 10}}>
                <Typography color = "#500000">
                    {props.name}
                </Typography>
            </Button>
            <Menu
                anchorEl = {anchorEl}
                open = {open}
                anchorReference='anchorPosition'
                onClose = {handleClose}
                anchorPosition = {{top: 50, left: 1200}}
                anchorOrigin = {{vertical: "top", horizontal: "right"}}
                transformOrigin = {{vertical: "top", horizontol: "right"}}
            >
                <MenuItem onClick = {signOutFunction}>
                    <Typography color = "#500000">
                        Sign Out
                    </Typography>
                </MenuItem>
            </Menu>
        </div>
    );
}