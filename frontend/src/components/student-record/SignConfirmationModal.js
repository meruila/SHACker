import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import RecordWarningsTable from "../../components/student-record/RecordWarningsTable";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function SignConfirmationModal({ open, setOpen, stRecord }) {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [warningLoading, setWarningLoading] = useState(true);
  const [recordWarnings, setRecordWarnings] = useState(false);
  const [result, setResult] = useState({
    status: "", // good, warning, error
    note: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCheckboxClick = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSignClick = () => {
    fetch("http://localhost:3001/sign", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({ studentNo: stRecord.studentNo }), // body data type must match "Content-Type" header
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setResult({
            status: "success",
            note: data.note,
          });
          setTimeout(() => {
            navigate("/student-records");
          }, 3000);
        } else {
          setResult({
            status: "error",
            note: data.note,
          });
        }
      })
      .catch((error) => {
        setResult({
          status: "error",
          note: "An error has occured.",
        });
        console.error(error);
      });
  };

  useEffect(() => {
    setWarningLoading(false);
    fetch("http://localhost:3001/checkForWarnings", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentObject: stRecord }),
    })
      .then((response) => response.json())
      .then((data) => {
        setRecordWarnings(data.warnings);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setWarningLoading(false);
      });
  }, []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Student Record Signing Confirmation
        </Typography>
        {warningLoading ? (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ maxHeight: 400, overflowY: 'scroll' }}>
              <RecordWarningsTable recordWarnings={recordWarnings} />
            </Box>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              By clicking the <strong>"Sign"</strong> button, you agree that this student record
              has been thoroughly cross-checked and validated.
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox onChange={handleCheckboxClick} />}
                label="I agree."
              />
            </FormGroup>
            <Button
              variant="contained"
              color="info"
              disabled={!isChecked}
              onClick={handleSignClick}
              sx={{
                mr: 2,
              }}
            >
              Sign
            </Button>
          </>
        )}
        {result.status && (
          <Fade in timeout={100}>
            <Alert severity={result.status} sx={{ mt: 1 }}>
              {result.note}
            </Alert>
          </Fade>
        )}
      </Box>
    </Modal>
  );
}
