import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import ShackerToolbar from "../../../components/ShackerToolbar";
import titleCase from "../../../custom-utility-functions/titleCase"

// For the modal
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

/**
 * Component for Add New User Page.
 * Required fields include the first name, last name, email to be able to add a new user successfully.
 * @returns React component for Add New User Page.
 */

function AddNewUserPage() {
  const navigate = useNavigate();
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  // On submit
  const [result, setResult] = useState({ success: null, note: "" });

  const [open, setOpen] = useState(false);
    // Handles Opening of Dialog Box
  const handleClickOpen = () => {
    setOpen(true);
    
  };
    // Handles Closing of Dialog Box
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      navigate("/admin/users");
    }, 800);
  };
  
  const handleChange = (e) => {
    const { value, name } = e.target;

    if (name === "firstName") {
      setFirstName(titleCase(value));
    } else if (name === "lastName") {
      setLastName(titleCase(value));
    } else if (name === "email") {
      setEmail(value);
    }
  };

  const handleSubmit = (e) => {
    const newUser = {firstName, lastName, email };
    fetch(process.env.REACT_APP_API_PATH + "/addUser", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        setResult(data);
        // Redirect to manage users page if registration succeeded
        if (data.success) {
          setGeneratedPassword(data.generatedPassword)
          handleClickOpen()
          
        }
      })
      .catch((error) => {
        setResult({ success: false, note: "An error has occured." });
        console.error(error);
      });
  };

  const validateEmail = (email) => {
    const r = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return r.test(String(email).toLowerCase()); // this will return either true or false
}

  const hasEmptyField = !(firstName.length && lastName.length && email.length); // fname, lname, and email must not be empty

  return (
    <div>
      <ShackerToolbar />
      <Typography
        variant="h1"
        component="div"
        gutterBottom
        sx={{
          px: 18,
          pt: 5,
          fontWeight: "bold",
          fontSize: 52,
          mb: 6,
          mt: 3,
        }}
      >
        Add New User
      </Typography>
      <Grid container columnSpacing={8} rowSpacing={2} sx={{ px: 18 }}>
        <Grid item xs={7}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            size="small"
            value={firstName}
            name="firstName"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={7}>
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            size="small"
            value={lastName}
            name="lastName"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={7}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            size="small"
            value={email}
            name="email"
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      {result.success !== null ? (
        <Box
          sx={{
            px: 18,
            mt: 5,
            mb: 4,
          }}
        >
          <Alert severity={result.success ? "success" : "error"}>
            {result.note}
          </Alert>
        </Box>
      ) : null}

      <Box
        sx={{
          px: 18,
          mt: 5,
          mb: 4,
        }}
      >
        <Link to="/admin/users" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{
              mr: 2,
              backgroundColor: "#E9E9E9",
              color: "#434343",
              "&:hover": {
                backgroundColor: "#B3B3B3",
                color: "#434343",
              },
            }}
          >
            Cancel
          </Button>
        </Link>
        <Button
          variant="contained"
          sx={{
            mr: 2,
            backgroundColor: "#8A1538",
            "&:hover": {
              backgroundColor: "#570E24",
            },
          }}
          disabled={hasEmptyField || !validateEmail(email)}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </Box>

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
              <center>Take note of this password:</center>
              <strong><center>{generatedPassword}</center></strong>
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Okay</Button>
            </DialogActions>
        </Dialog>
    </div>

    </div>
  );
}

export default AddNewUserPage;
