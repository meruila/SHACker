import React, { useState , useEffect } from 'react';
import { Link } from "react-router-dom";
import { Alert, Box, Button, Grid, IconButton, TextField, Typography, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import ShackerToolbar from "../components/ShackerToolbar";
import LoadingPage from '../components/LoadingPage'

import titleCase from '../custom-utility-functions/titleCase';

/**
 * Component Edit Profile Page.
 * A user can change their first name and/or last name. The email is only set for display and unchangable.
 * @returns React component for Edit Profile Page.
 */

function EditProfilePage() {
    const [canEdit, setCanEdit] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gotFetched, setgotFetched] = useState();
    const [email, setEmail] = useState("");
    const [errorName, setErrorName ] = useState("");

    // FETCH call for viewProfile
    useEffect(() => {
        fetch(
            process.env.REACT_APP_API_PATH +"/viewProfile",
            {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            })
            .then(response => response.json())
            .then(body => {
            if (body.success) {
                // If successful
                setFirstName(body.profile.firstName);
                setLastName(body.profile.lastName);
                setEmail(body.profile.email);
                setgotFetched(true);
            }
            else{
                setgotFetched(true);
            }
            })
            .catch(err => console.log(err)); 
    }, [])

     // Handles the changes in login credentials (username, password) textfields
    const handleOnChange = (evt) => {
        const { name, value } = evt.target;
    
        switch (name) {
            case 'firstName':
                setFirstName(titleCase(value));
                break;
            case 'lastName':
                setLastName(titleCase(value));
                break;
            default:
                break;
        }

    }

    // FETCH Call for Edit Profile
    const handleSubmit = (evt) => {
        evt.preventDefault();
        
        // Error Validation 
        if (firstName === "" || lastName === ""){
            setErrorName("All fields must be filled.")
        } else {
            setErrorName("");

            // To be sent to API
            const name={
                firstName: firstName,
                lastName: lastName
            }

            fetch(
                process.env.REACT_APP_API_PATH +"/editProfile",
                {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(name)
                })
                .then(response => response.json())
                .then(body => {
                if (body.success) {
                    // If successful changing of profile
                    window.location.reload(true)
                }
                else{
                    console.log(body.note);
                }
                })
                .catch(err => console.log(err));
        }

        
    }

    const setFieldsEditable = (evt) => {
        evt.preventDefault();
        if (canEdit) { setCanEdit(false) }
        else { setCanEdit(true) }
    }

    // Renders a loading icon 
    // while waiting for data to get fetched
    if (gotFetched === undefined) {
        return (
            <LoadingPage />
        );
    }
        
    return (
        <div>
            <ShackerToolbar />
            <Typography variant="h1" component="div" gutterBottom sx={{ 
                px: 18, 
                pt: 5,
                fontWeight: 'bold',
                fontSize: 52,
                mb: 6,
                mt: 3
            }}>
                Edit Profile
                <Tooltip title="Enable fields">
                    <IconButton onClick={setFieldsEditable}>
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
            </Typography>
            
            
            <Grid container columnSpacing={8} rowSpacing={2} sx={{ px: 18 }}>
                <Grid item xs={7}>
                    <TextField 
                    name="firstName"
                    label="First Name" 
                    variant="outlined" 
                    fullWidth size="small" 
                    onChange={handleOnChange}
                    value={firstName}
                    disabled={canEdit}
                    />
                </Grid>
                <Grid item xs={7}>
                    <TextField 
                    name="lastName"
                    label="Last Name" 
                    variant="outlined" 
                    fullWidth size="small" 
                    onChange={handleOnChange}
                    value={lastName}
                    disabled={canEdit}
                    />
                </Grid>
                {/* Email is not changeable, display only.*/}
                <Grid item xs={7}>
                    <TextField 
                    label="Email" variant="outlined" 
                    fullWidth size="small" 
                    value={email} 
                    disabled />
                </Grid>
            </Grid>
            <Box sx={{ 
                px: 18, 
                mt: 5,
                mb: 4 
            }}>
                { errorName.length !== 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errorName}
                </Alert>    
                ) }
            </Box>
            <Box sx={{ 
                px: 18, 
                mt: 5,
                mb: 4 
            }}>
                <Grid container spacing={2}>
                    <Grid item xs={4.35}>
                            <Link to="/change-password" style={{ textDecoration: 'none' }}>  
                                <Button 
                                variant="contained" 
                                sx={{ 
                                    mr: 2, 
                                backgroundColor: '#0D542F', 
                                '&:hover': {
                                backgroundColor: '#093005'
                                }
                                }}>
                                Change Password
                                </Button>
                            </Link>
                    </Grid>
                    <Grid item xs={1.4}>
                        <Link to="/home" style={{ textDecoration: 'none' }}>  
                            <Button 
                            variant="contained" 
                            sx={{
                                mr: 2,
                                backgroundColor: '#E9E9E9',
                                color: '#434343',
                                '&:hover': {  
                                    backgroundColor: '#B3B3B3',
                                    color: '#434343',
                                }  
                            }}>
                            Cancel
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item xs={1}>
                        <Button 
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{ 
                            mr: 2, 
                            backgroundColor: '#8A1538', 
                            '&:hover': {
                            backgroundColor: '#570E24'
                            }
                        }}>
                            Save
                        </Button>
                    </Grid>
                </Grid>

            </Box>
                                                                                                                            
        </div>
    );
}

export default EditProfilePage;