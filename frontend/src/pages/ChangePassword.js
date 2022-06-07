import React, { useState  } from 'react';
import { Box, Typography, Grid, TextField, Button, Alert } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Link } from "react-router-dom";
import ShackerToolbar from "../components/ShackerToolbar";

/**
 * Component Change Password Page.
 * A user can change their password by retyping their old password and replacing it with a new one.
 * @returns React component for Change Password Page.
 */

function ChangePasswordPage() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [errorPassword, setErrorPassword ] = useState("");
    const [dialogText, setDialogText] = useState("Dialog");
    const [open, setOpen] = useState(false);

    const passwordConstruct = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$"
      );
     // Handles the changes in the oldPassword, newPassword, and retypePassword textfields
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        
        setErrorPassword("");
        switch (name) {
            case 'oldPassword':
                setOldPassword(value);
                break;
            case 'newPassword':
                setNewPassword(value);
                
                break;
            case 'retypePassword':
                setRetypePassword(value);
                break;
            default:
                break;
        }
    }

    // Handles Opening of Dialog Box
    const handleDialogOpen = () => {
        setOpen(true);
    };

    // Handles Closing of Dialog Box
    const handleClose = () => {
        setOpen(false);

        if (dialogText === "Change password successful!") {
            window.location.reload(true);
        }
    };

    // Login Dialog Box Component
    const changePasswordDialog = (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Change Password status"}
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

    // Handles on Submit Password
    const handleSubmit = (evt) => {
        evt.preventDefault();

        // Error Validation 
        if (oldPassword === "" || newPassword === "" || retypePassword === ""){
            setErrorPassword("All fields must be filled.")
        } else if (newPassword !== retypePassword){
            setErrorPassword("Retyped password must match with new password")
        } else if ( oldPassword === newPassword ) {
            setErrorPassword("New password must not be the same.")
        } else if (!passwordConstruct.test(newPassword)) {
            setErrorPassword("Password must have at least 8 characters including 1 uppercase letter, 1 lowercase letter, and 1 digit.");
        } else {
            setErrorPassword("")

            const password={
                oldPassword: oldPassword,
                newPassword: newPassword 
            }

            // FETCH Call for Change Password
            fetch(
                process.env.REACT_APP_API_PATH + "/changePassword",
                {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(password)
                })
                .then(response => response.json())
                .then(body => {
                if (body.success) {
                    // If successful changing of password
                    setDialogText("Change password successful!")
                    handleDialogOpen();
                }
                else{
                    setDialogText("Change password failed. Reason: ", body.note);
                    handleDialogOpen();
                }
                })
                .catch(err => console.log(err));
        }
        
        // To be sent to API

    }

    return(
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
                Change Password
            </Typography>
            <Grid container columnSpacing={8} rowSpacing={2} sx={{ px: 18 }}>
                {/* Old Password  Textfield*/}
                <Grid item xs={7}>
                    <TextField 
                    name="oldPassword"  
                    label="Old Password" 
                    variant="outlined" 
                    fullWidth size="small" 
                    onChange={handleOnChange}
                    defaultValue={oldPassword}
                    type="password"
                    />
                </Grid>
                {/* New Password Textfield*/}
                <Grid item xs={7}>
                    <TextField 
                    name="newPassword"
                    label="New Password" 
                    variant="outlined" 
                    fullWidth size="small" 
                    onChange={handleOnChange}
                    defaultValue={newPassword}
                    type="password"
                    />
                </Grid>
                {/* Retype Password Textfield*/}
                <Grid item xs={7}>
                    <TextField 
                    name="retypePassword"
                    label="Retype Password" 
                    variant="outlined" 
                    fullWidth size="small"
                    defaultValue={retypePassword}
                    onChange={handleOnChange}
                    type="password"
                    />
                </Grid>
            </Grid>

            <Box sx={{ 
                px: 18, 
                mt: 5,
                mb: 4 
            }}>
                {/* Cancel Button */}
                <Link to="/edit-profile" style={{ textDecoration: 'none' }}>  
                    <Button variant="contained" sx={{
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
                  {/* Save Button */}
                <Button variant="contained"
                    // disabled={enableSubmit}
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
            </Box>
            {changePasswordDialog}
            <Box sx={{ 
                px: 18, 
                mt: 5,
                mb: 4 
            }}>
                 { errorPassword.length !== 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errorPassword}
                </Alert>    
                ) }
            </Box>
            
            
            
        </div>
    );
}

export default ChangePasswordPage;
