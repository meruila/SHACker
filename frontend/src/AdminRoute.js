import React, { useEffect , useState} from "react";
import { useNavigate } from "react-router-dom";
import LoadingPage from "./components/LoadingPage"

// For the modal
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";


function Admin({children}) {
    const navigate = useNavigate();
    const [adminStatus, setAdminStatus] = useState();
    const [open, setOpen] = useState(false);
  
  // Handles Opening of Dialog Box
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Handles Closing of Dialog Box
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
        navigate("/home");
    }, 500);
  };

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
                setAdminStatus(body.isAdmin);

                if(!body.isAdmin){
                    handleClickOpen()
                }
            })
            .catch(err => console.log(err));                
    },[]); 

    if (adminStatus === undefined) {
        return <LoadingPage/>
    }

    if(!adminStatus){
        return (
            <div>      
              <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
              >
                  <DialogTitle id="alert-dialog-title">
                  {"Permission denied"}
                  </DialogTitle>
                  <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <strong>
                      You are not an admin!
                    </strong>
                  </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                  <Button onClick={handleClose}>Go Back</Button>
                  </DialogActions>
              </Dialog>
          </div>
          )
    }

    return children

}




export default Admin;