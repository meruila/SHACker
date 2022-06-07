import * as React from 'react';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingToolbar from '../LoadingToolbar';

function DeleteLogDialog() {
  const [open, setOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState();
  const [gotFetched, setGotFetched] = React.useState();
  const [passwordHelperText, setPasswordHelperText] = React.useState("Confirm password.");
  const [password, setPassword] = React.useState("");


  // FETCH Call for checking if user is admin

  React.useEffect(() => {
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

    console.log(value);
    
}

  const deleteAllLogs = (event) => {
    event.preventDefault();
    console.log(password);

    //Credentials be sent to the backend
    const passWord = {
            password: password
    }

    fetch(
        process.env.REACT_APP_API_PATH + "/deleteAllLogs",
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
            console.log(body);
            alert(body.note);
            handleClose();
            window.location.reload(true)
        })
        .catch(err => console.log(err));
  }
  
  // Handles Opening of Dialog Box
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Handles Closing of Dialog Box
  const handleClose = () => {
    setOpen(false);
  };

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
      
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Delete all logs?"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    This will delete all logs in the database.
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
                <Button onClick={handleClose}>Disagree</Button>
                <Button onClick={deleteAllLogs} disabled={!password} autoFocus>
                    Agree
                </Button>
                </DialogActions>
            </Dialog>
        </div>
        )
      }else{
        return (<div></div>)
      }
    }
  }

export default DeleteLogDialog;