import BackButton from "./toolbar/BackButton";
import QuickAccessButtons from "./toolbar/QuickAccessButtons.js";
import AdminSidebar from "./toolbar/AdminSidebar"
import RegularSidebar from "./toolbar/RegularSidebar.js"

import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"

import { useState , useEffect} from 'react';
import Loading from './LoadingToolbar'

/**
 * Custom SHACker Toolbar component
 * Imports the following components
 *      BackButton
 *      Sidebar
 *      QuickAccessButton
 */

function ShackerToolbar() {
    const [isAdmin, setIsAdmin] = useState()


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

    if (isAdmin === undefined) {
        return (
            <Loading />
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
                <Grid container alignItems="center" columns={32} sx={{ px: 5 }}>
                    <Grid item xs={1}>
                        <BackButton edge="start" sx={{ mr: 2 }} />
                    </Grid>
                    <Grid item xs={1}>
                        {isAdmin ? <AdminSidebar sx={{ flex: 1 }}/> : <RegularSidebar sx={{ flex: 1 }}/> }
                    </Grid>
                    <Grid item xs={24}>
                    </Grid>
                    <Grid item xs={5}>
                        <QuickAccessButtons justify="flex-wrap" />
                    </Grid>
                </Grid>
            </AppBar>
        </Box>
    );
}

export default ShackerToolbar;