import React, { useState , useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import mainLogo from "../assets/images/uplb-logo.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import titleCase from "../custom-utility-functions/titleCase";

/**
 * Component for Create Admin Page.
 * Required fields include the first name, last name, email, username, password, and password confirmation to be able to sign up successfully.
 * @returns React component for Create Admin Page.
 * To Do: Set Title-case function for names
 */

function CreateAdminPage() {
  let navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [result, setResult] = useState({ success: null, note: "" });


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
            if (body.adminIsExisting){
              navigate("/login");
            }
          }
        })
}, [])

  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;

    if (name === "firstName") {
      setFirstName(titleCase(value));
    } else if (name === "lastName") {
      setLastName(titleCase(value));
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = (e) => {
    const validationErrors = {
      fname: "",
      lname: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    const emailConstruct = new RegExp(
      "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$"
    );
    const passwordConstruct = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$"
    );

    // Check fname
    if (firstName.length === 0) {
      validationErrors["fname"] = "First name must not be empty.";
    }
    // Check lname
    if (lastName.length === 0) {
      validationErrors["lname"] = "Last name must not be empty.";
    }
    // Check email
    if (email.length === 0) {
      validationErrors["email"] = "Email must not be empty.";
    } else if (!emailConstruct.test(email)) {
      validationErrors["email"] = "Email must follow the standard format.";
    }
    // Check password
    if (password.length === 0) {
      validationErrors["password"] = "Password must not be empty.";
    } else if (!passwordConstruct.test(password)) {
      validationErrors["password"] =
        "Password must have at least 8 characters including 1 uppercase letter, 1 lowercase letter, and 1 digit.";
    }
    // Check confirm password
    if (confirmPassword.length === 0) {
      validationErrors["confirmPassword"] =
        "Confirm password must not be empty.";
    } else if (password !== confirmPassword) {
      validationErrors["confirmPassword"] = "Passwords do not match.";
    }

    setErrors(validationErrors);

    // Has error
    if (
      validationErrors["fname"].length ||
      validationErrors["lname"].length ||
      validationErrors["email"].length ||
      validationErrors["password"].length ||
      validationErrors["confirmPassword"].length
    ) {
      return;
    }

    // TODO: API Call
    // Default options are marked with *
    fetch(process.env.REACT_APP_API_PATH +"/adminSignUp", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }), // body data type must match "Content-Type" header
    })
      .then((response) => response.json())
      .then((data) => {
        setResult(data);

        // Redirect to login page if registration succeeded
        if (data.success) {
          setTimeout(() => {
            navigate("/login");
          }, 800);
        }
      })
      .catch((error) => {
        setResult({ success: false, note: "An error has occured." });
        console.error(error);
      });
  };

  return (
    <div>
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
        Create Admin Account
      </Typography>
      <Grid container columnSpacing={8} rowSpacing={2} sx={{ px: 18 }}>
        <Grid item xs={6}>
          <TextField
            error={errors.fname.length > 0}
            helperText={errors.fname}
            label="First Name"
            variant="outlined"
            fullWidth
            size="small"
            value={firstName}
            name="firstName"
            onChange={handleChange}
            inputProps={{ tabIndex: "1" }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            error={errors.password.length > 0}
            helperText={errors.password}
            label="Password"
            variant="outlined"
            fullWidth
            size="small"
            value={password}
            name="password"
            onChange={handleChange}
            type="password"
            inputProps={{ tabIndex: "4" }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            error={errors.lname.length > 0}
            helperText={errors.lname}
            label="Last Name"
            variant="outlined"
            fullWidth
            size="small"
            value={lastName}
            name="lastName"
            onChange={handleChange}
            inputProps={{ tabIndex: "2" }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            error={errors.confirmPassword.length > 0}
            helperText={errors.confirmPassword}
            label="Confirm Password"
            variant="outlined"
            fullWidth
            size="small"
            value={confirmPassword}
            name="confirmPassword"
            onChange={handleChange}
            type="password"
            inputProps={{ tabIndex: "5" }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            error={errors.email.length > 0}
            helperText={errors.email}
            label="Email"
            variant="outlined"
            fullWidth
            size="small"
            value={email}
            name="email"
            onChange={handleChange}
            inputProps={{ tabIndex: "3" }}
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
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button
            tabIndex={7}
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
          tabIndex={6}
          variant="contained"
          sx={{
            mr: 2,
            backgroundColor: "#8A1538",
            "&:hover": {
              backgroundColor: "#570E24",
            },
          }}
          onClick={handleSubmit}
        >
          Sign Up
        </Button>
      </Box>
      <Box
        sx={{
          px: 18,
          pt: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 5,
        }}
      >
        <img src={mainLogo} alt="UPLB Logo" height="45" />
        <Typography
          variant="h6"
          sx={{
            color: "#9B1515",
            fontWeight: "bold",
            fontSize: 15,
          }}
        >
          Administrator Sign-Up Page
        </Typography>
      </Box>
    </div>
  );
}

export default CreateAdminPage;

