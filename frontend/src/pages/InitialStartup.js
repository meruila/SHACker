import React, { useState , useEffect } from "react";
import { Box, Link, Stack } from '@mui/material';
import Overlaybottom from '../assets/Overlay-bottom';
import Overlaytop from '../assets/Overlay-top';


/**
 * Component for Initial Start-up Page
 * The page is accessed when the app is first used
 * Links the user to the create admin page and login page
 */

const green = "#0D542F";
const maroon = "#8A1538";

function InitialStartup(){
    const [adminExists, setAdminExists] = useState();
    const [gotFetched, setgotFetched] = useState();

    useEffect(() => {
        fetch(process.env.REACT_APP_API_PATH +"/adminExists",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
            })
            .then(response => response.json())
            .then(body => {
              if (body.success) {
                setAdminExists(body.adminIsExisting)
                setgotFetched(true)
              }
            })
    }, [])

    if (gotFetched === undefined) { //while loading, return nothing
        return (
            <div></div>
        );
    }
    return <div>
        <Overlaytop />
            <Stack spacing={3}
                component="div"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: '19%'
                }}
            >   
                {/* Renders the SHACker Logo with Label */}
                <Box
                    component="img"
                    width="33%"
                    align="center"
                    src="/SHACKER-icon-with-label.png"
                />
                
                {/* Links to the Create admin user account*/}
                {!adminExists && (
                    <Link href="create-admin" color={maroon}>
                    {'SIGN UP HERE'}
                    </Link>
                )}
                {/* Links to the Login Page
                 * Used when admin account has been created
                 */}
                {adminExists && (
                    <Link href="login" underline="always" color={green}>
                    {'LOG IN HERE'}
                    </Link>
                )}

            </Stack>
        <Overlaybottom />
    </div>;
}

export default InitialStartup;