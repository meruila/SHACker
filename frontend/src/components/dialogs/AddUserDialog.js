import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function AddUserDialog(generatedPassword, isOpened) {
  const [open, setOpen] = React.useState(isOpened);
  
  // Handles Opening of Dialog Box
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Handles Closing of Dialog Box
  const handleClose = () => {
    setOpen(false);
  };

return (
    <div>      
      <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
          <DialogTitle id="alert-dialog-title">
          {"User succesfully created!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Take note of this password!
                <strong>{generatedPassword}</strong>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
          <Button onClick={handleClose}>Agree</Button>
          </DialogActions>
      </Dialog>
  </div>
  )
}
export default AddUserDialog;