import QuickAccessButtons from "./toolbar/QuickAccessButtons.js";
import AdminSidebar from "./toolbar/AdminSidebar"
import RegularSidebar from "./toolbar/RegularSidebar.js"

import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Shackerlogo from "../assets/ShackerLogo"

import { useState, useEffect } from 'react';

import LoadingToolbar from './LoadingToolbar'

/**
 * Custom  HOMEPAGE SHACker Toolbar component
 * Imports the following components
 *      Sidebar
 *      Logo
 *      QuickAccessButton
 */

function ShackerToolbar() {
    const [isAdmin, setIsAdmin] = useState()

    // FETCH Call for Checking if user is Admin
    useEffect(() => {
        fetch(
            process.env.REACT_APP_API_PATH + "/isAdmin",
            {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            })
            .then(response => response.json())
            .then(body => {
                setIsAdmin(body.isAdmin);

            })
            .catch(err => console.log(err));                
    },[]); 

    // Loading Icon
    if (isAdmin === undefined) {
        return (
            <LoadingToolbar/>
        );
    }

    return(
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static" color="inherit" elevation={1}
                sx={{
                    paddingTop: "15px",
                    paddingBottom: "15px"
                }}
            >
                <Grid container alignItems="center" columns={16} sx={{ px: 5 }}>
                    <Grid item xs={1}>
                        {isAdmin ? <AdminSidebar sx={{ flex: 1 }}/> : <RegularSidebar sx={{ flex: 1 }}/> }
                    </Grid>
                    <Grid item xs={1}>
                        <Shackerlogo />
                    </Grid>
                    <Grid item xs={11}></Grid>
                    <Grid item xs={3}>
                        <QuickAccessButtons justify="flex-end" />
                    </Grid>
                </Grid>
            </AppBar>
        </Box>
    );
}

export default ShackerToolbar;