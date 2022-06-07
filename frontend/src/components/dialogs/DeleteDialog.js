import * as React from 'react';

import { TextField, Button } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import LoadingToolbar from '../LoadingToolbar';

function DeleteDialog() {
  const [open, setOpen] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [statusDialogText, setStatusDialogText] = React.useState("");
  const [isAdmin, setIsAdmin] = React.useState();
  const [gotFetched, setGotFetched] = React.useState();
  const [passwordHelperText, setPasswordHelperText] = React.useState("Confirm password.");
  const [password, setPassword] = React.useState("");


  // FETCH Call for checking if user is admin

  React.useEffect(() => {
      fetch(
          process.env.REACT_APP_API_PATH +"/isAdmin",
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
              setGotFetched(true);
          })
          .catch(err => console.log(err));                
  },[]); 

  // Handles the changes in credentials (password) textfield
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    
    switch (name) {
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

  const deleteAllRecords = (event) => {
    event.preventDefault();

    //Credentials be sent to the backend
    const passWord = {
            password: password
    }

    // FETCH Call for deleting all Records
    fetch(
        process.env.REACT_APP_API_PATH +"/deleteAllRecords",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(passWord)         
        })
        .then(response => response.json())
        .then(body => {
            setStatusDialogText(body.note);
            handleClose();
        })
        .catch(err => console.log(err));
  }
  
  // Handles Opening of Delete Dialog Box
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Handles Closing of Delete Dialog Box
  const handleClose = () => {
    setOpen(false);
  };

  const DeleteDialog = (
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
        {"Delete all student records?"}
        </DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
            This will delete all student records in the database.
        </DialogContentText>
        <TextField
              type='password'
              margin="normal"
              label="password"
              name="password"
              helperText={passwordHelperText}
              onChange={handleOnChange}
              fullWidth required autoFocus
        />
        </DialogContent>
        <DialogActions>
        <Button onClick={()=> {handleClose()}}>Disagree</Button>
        <Button onClick={(event) => {deleteAllRecords(event); handleClickOpenStatus()}} disabled={!password} autoFocus>
            Agree
        </Button>
        </DialogActions>
    </Dialog>
  );

  // Handles Opening of Status Dialog Box
  const handleClickOpenStatus = () => {
    setOpenStatus(true);
  };

  // Handles Closing of Status Dialog Box
  const handleCloseStatus = () => {
    setOpenStatus(false);
    window.location.reload(true)
  };

  const StatusDialog = (
    <React.Fragment>
      <Dialog
        open={openStatus}
        onClose={handleCloseStatus}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
        {"Delete Status"}
        </DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
            {statusDialogText}
        </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => {handleCloseStatus()}}>Okay</Button>
        </DialogActions>
    </Dialog>
    </React.Fragment>
  );


  // While fetching data for page, render loading page
  if (gotFetched === undefined) {
    return (
        <LoadingToolbar />
    );
  }else{
      if(isAdmin === true){
        return (
          <div>
            <Button variant="contained"
                startIcon={<DeleteIcon />}
                color="error"
                onClick={handleClickOpen}
                sx={{ px: 2 }}>
                Delete All
            </Button>
      
            {DeleteDialog}
            {StatusDialog}
        </div>
        )
      }else{
        return (<div></div>)
      }
    }
  }

export default DeleteDialog;