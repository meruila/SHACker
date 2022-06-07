import React, { useState , useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import { Button, Box, Container, Grid, Link, Paper, TextField } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import Overlaybottom from '../assets/Overlay-bottom';
import Overlaytop from '../assets/Overlay-top';
import SHACKERicon from '../assets/SHACKericon';
import { UserContext } from '../contexts/UserContext';

/**
 * Component for Login Page
 * If successful login, user is redirected to home page 
 * or previous page they were trying to access
 * If no user is logged in, user is restricted to the login page.
 */

// NOTE: Convert alert to dialog for both success and failed to log in

/* UP Colors Hex Values */
const maroon = "#8A1538";
//const green = "0D542F";

export default function SignIn() {

    const [emailHelperText, setEmailHelperText] = useState("Input email");
    const [passwordHelperText, setPasswordHelperText] = useState("Input password");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);
    const [dialogText, setDialogText] = useState("Dialog");

    const Navigate = useNavigate()
    const { setUser } = useContext(UserContext);

    // Handles Opening of Dialog Box
    const handleDialogOpen = () => {
        setOpen(true);
    };

    // Handles Closing of Dialog Box
    // If login was successful, when dialog closes, navigates to home page
    const handleClose = () => {
        setOpen(false);

        if (dialogText === "Successfully logged in") {
            Navigate("/home")
        }
    };

    // Login Dialog Box Component
    const loginDialog = (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Login status"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={ () => {handleClose()} }>Okay!</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )

    useEffect(() => {
        const isLoggedin = localStorage.getItem('isAuthenticated')
        if (isLoggedin){
            Navigate("/home");
        }
    },[]); 

    const handleSubmitCredentials = (event) => {
        event.preventDefault();

        // Credentials be sent to the backend
        const credentials = {
            email: email,
            password: password
        }

        // FETCH Code Block for Login
        fetch(
            process.env.REACT_APP_API_PATH +"/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(credentials)
            })
            .then(response => response.json())
            .then(body => {
              if (!body.success) {
                  setDialogText("Login attempt failed.");
                  handleDialogOpen();
              }
              else {
                // Successful log in. Store the token as a cookie
                // Stored in localStorage and then redirected to /home page

                const cookies = new Cookies();
                cookies.set(
                  "authToken",
                  body.token,
                  {
                    path: "/",
                    age: 60*60,
                    sameSite: "lax"
                  });
                
                // Store user email and isAuthenticated (boolean) to local Storage
                setUser(email);
                localStorage.setItem('user', email);
                localStorage.setItem('isAuthenticated', true);
                
                // Renders the Dialog Box
                setDialogText("Successfully logged in");
                handleDialogOpen();
              }
        })
    };

    // Handles the changes in login credentials (username, password) textfields
    const handleOnChange = (e) => {
        const { name, value } = e.target;
    
        switch (name) {
            case 'email':
                setEmail(value);
                if (!value) {
                    setEmailHelperText("Must not be empty")
                }else {
                    setEmailHelperText("")
                }
                break;

            case 'password':
                setPassword(value);
                if (!value) {
                    setPasswordHelperText("Must not be empty")
                }else {
                    setPasswordHelperText("")
                }
                break;

            default:
                break;
        }
    }
    
    return (
        <div>
            <Container component="main" maxWidth="xs" >
                <Paper 
                    elevation={3}
                    sx={{ padding: 6, borderRadius: 8, marginTop: '40%' }}
                >
                    <Box
                        sx={{
                            marginTop: '5%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box noValidate 
                            sx={{ mt: 1 }}
                        >
                            {/*  Email Field  */}
                            <TextField
                                type='email'
                                margin="normal"
                                defaultValue={email}
                                label="Email"
                                name="email"
                                helperText={emailHelperText}
                                onChange={handleOnChange}
                                fullWidth required autoFocus
                            />

                            {/* Password Field */}
                            <TextField
                                name="password"
                                margin="normal"
                                defaultValue={password}
                                label="Password"
                                type="password"
                                helperText={passwordHelperText}
                                onChange={handleOnChange}
                                required fullWidth
                            />

                            {/* Sign In Button */}
                            <Button type="submit" fullWidth variant="contained" size="large" disabled={!email || !password}
                                sx={{ 
                                    mt: 2, mb: 2, borderRadius: 8, 
                                    backgroundColor: maroon,
                                }}
                                onClick={handleSubmitCredentials}
                            >
                                Sign In
                            </Button>
                            
                            {/* Login Dialog Box */}
                            {loginDialog}
                            
                            
                            <Grid container direction="column" alignItems="center">
                                <Box component="img"
                                    sx={{ height: '50%', width: '50%', alignItems: "center" }}
                                    src="/UPLB-icon.png"
                                />
                                <Box variant="body2" sx={{color:maroon, fontSize: 12, marginY: 2}}>
                                    Don't have an account yet?
                                    <Link href="#" sx={{color:maroon}}>
                                        {" Contact your administrator."}
                                    </Link>
                                </Box>
                            </Grid>
                            
                        </Box>
                    </Box>
                </Paper>
            </Container>
            <Overlaybottom />
            <Overlaytop />
            <SHACKERicon />
        </div>
    );
}