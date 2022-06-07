import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Box, Grid, Stack, Paper, Typography, TextField, Button, Alert, CircularProgress, Fade, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

import Chip from "@mui/material/Chip";
import CheckIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorIcon from "@mui/icons-material/HighlightOff";
import WarningIcon from "@mui/icons-material/ErrorOutline";
import AddIcon from "@mui/icons-material/Add";

import TermGrades from "../../components/student-record/TermGrades";
import RecordWarningsTable from "../../components/student-record/RecordWarningsTable";
import SignConfirmationModal from "../../components/student-record/SignConfirmationModal";
import StudentGradesContext from "../../contexts/StudentGradesContext";
import ShackerToolbar from "../../components/ShackerToolbar";

import studentRecords from "../../data/studentRecords";
import { useNavigate, useParams } from "react-router-dom";

import LoadingPage from '../../components/LoadingPage'
import HandleScroll from '../../components/HandleScrollBottom';
import HandleScrollTop from '../../components/HandleScrollTop'

import degreeProgramList from '../../data/casDegreePrograms';
import titleCase from "../../custom-utility-functions/titleCase";
/**
 * Component for Edit Student Record
 *
 */

// If the input field is disabled,
// set text color to dark color so that it is still readable
const disabledInputSx = (disabled) => {
  if (disabled)
    return (
      {
        input: {
          "-webkit-text-fill-color": '#212121 !important',
          "color": '#212121 !important',
          background: '#f5f5f5',
        },
        '.MuiSelect-select.MuiSelect-outlined.Mui-disabled.MuiOutlinedInput-input.MuiInputBase-input.Mui-disabled': {
          "-webkit-text-fill-color": '#212121 !important',
          "color": '#212121 !important',
          background: '#f5f5f5 !important',
        }
      }
    );

  return {};
}

const labelStyle = {
  fontWeight: "bold",
  color: "#595959",
};

const EditStudentRecordPage = () => {
  const navigate = useNavigate();
  const [fetched, setFetched] = useState();
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState({
    status: "", // good, warning, error
    note: "",
  });

  const [warnings, setWarnings] = useState([]);

  // Student Info
  const [stNumber, setStNumber] = useState("");
  const [stFirstName, setStFirstName] = useState("");
  const [stLastName, setStLastName] = useState("");
  const [stMiddleInitial, setStMiddleInitial] = useState("");
  const [stDegreeProgram, setStDegreeProgram] = useState("");
  // Totals
  const [stTotalUnitsTaken, setStTotalUnitsTaken] = useState("");
  const [stTotalUnitsRequired, setStTotalUnitsRequired] = useState("");
  const [stGwa, setStGwa] = useState("");
  // Verified by
  const [stVerifiedBy, setStVerifiedBy] = useState([]);
  const [areInputsChecked, setAreInputsChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stRemarks, setStRemarks] = useState([]);
  const [newRemarks, setNewRemarks] = useState("");

  // Sign Confirmation Modal States
  const [signConfirmationModalOpen, setSignConfirmationModalOpen] =
    useState(false);

  const [stErrors, setStErrors] = useState({
    num: "",
    fName: "",
    lName: "",
    degreeProgram: "",
    totalUnitsTaken: "",
    totalUnitsRequired: "",
    gwa: "",
  });

  // Student Grades
  // const sampleGrades = studentRecords[0].records;
  const [stGrades, setStGrades] = useState([]);
  const [recordErrors, setRecordErrors] = useState([]);
  const [recordWarnings, setRecordWarnings] = useState([]);

  const studentNumber = useParams(); // Used to be able to get the student Object from the database

  // Handles the changes in student details (sn, name, deg. program) textfields
  const onStudentInfoChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "stNumber":
        setStNumber(value);
        break;
      case "stFirstName":
        setStFirstName(titleCase(value));
        break;
      case "stLastName":
        setStLastName(titleCase(value));
        break;
      case "stMiddleInitial":
        setStMiddleInitial(titleCase(value));
        break;
      case "stDegreeProgram":
        setStDegreeProgram(value.trim().toUpperCase());
        break;
      case "stTotalUnitsTaken":
        setStTotalUnitsTaken(value);
        break;
      case "stTotalUnitsRequired":
        setStTotalUnitsRequired(value);
        break;
      case "stGwa":
        setStGwa(value);
        break;
    }
  };

  // Hanldes the adding of term when the button is clicked
  const handleAddTermClick = () => {
    // Add new term to student's record
    setStGrades((prev) => [
      ...prev,
      {
        sem: "",
        year: "",
        status: "",
        units: "",
        subjects: [],
      },
    ]);

    setRecordErrors((prev) => [
      ...prev,
      {
        sem: "",
        year: "",
        status: "",
        units: "",
        subjects: [],
      },
    ]);
  };

  // Handles the updating of the new student record when save button is clicked
  const handleUpdateClick = () => {
    setSaving(true);

    if (!validate(true)) {
      setSaving(false);
      return;
    }

    const email = localStorage.getItem("user");

    const stRecord = {
      name: {
        first: stFirstName,
        last: stLastName,
        middle: stMiddleInitial,
      },
      course: stDegreeProgram,
      studentNo: stNumber,
      records: stGrades,
      totalUnitsTaken: stTotalUnitsTaken,
      totalUnitsRequired: stTotalUnitsRequired,
      GWA: stGwa,
      remarks: [...stRemarks, `${email}: ${newRemarks}`],
    };

    // Submit Record to API
    // Default options are marked with *
    fetch(process.env.REACT_APP_API_PATH + "/updateStudentRecord", {
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
      body: JSON.stringify({ updatedStudentObject: stRecord }), // body data type must match "Content-Type" header
    })
      .then((response) => response.json())
      .then((data) => {
        setSaving(false);

        // Redirect to student records page if saving succeeded
        if (data.success) {
          setResult({
            status: "success",
            note: data.note,
          });
          setAreInputsChecked(false);
          setTimeout(() => {
            window.location.reload();
          }, 800);
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
        setSaving(false);
        console.error(error);
      });
  };

  const validate = (isRemarkRequired) => {
    const stNumConstruct = new RegExp("^[0-9]{4}-[0-9]{5}$");

    // Validate Inputs
    const studentInfoValidationErrors = {
      num: "",
      fName: "",
      lName: "",
      degreeProgram: "",
      totalUnitsTaken: "",
      totalUnitsRequired: "",
      gwa: "",
    };

    // Student Number Textfields
    if (stNumber.length === 0) {
      studentInfoValidationErrors["num"] = "Student number is required.";
    }
    if (!stNumConstruct.test(stNumber)) {
      studentInfoValidationErrors["num"] =
        "Student number must have the following format: XXXX-YYYYY";
    }
    // Name Textfields
    if (stFirstName.length === 0) {
      studentInfoValidationErrors["fName"] = "First name is required.";
    }
    if (stLastName.length === 0) {
      studentInfoValidationErrors["lName"] = "Last name is required";
    }
    // Degree Textfields
    if (stDegreeProgram.length === 0) {
      studentInfoValidationErrors["degreeProgram"] =
        "Degree program is required.";
    }
    // Total Units Taken Textfields
    if (stTotalUnitsTaken.length === 0) {
      studentInfoValidationErrors["totalUnitsTaken"] =
        "Total units taken is required.";
    }
    if (Number(stTotalUnitsTaken) < 0 || isNaN(stTotalUnitsTaken)) {
      studentInfoValidationErrors["totalUnitsTaken"] =
        "Total units taken must be a positive number.";
    }
    // Total Units Required Textfields
    if (stTotalUnitsRequired.length === 0) {
      studentInfoValidationErrors["totalUnitsRequired"] =
        "Total units req is required.";
    }
    if (Number(stTotalUnitsRequired) < 0 || isNaN(stTotalUnitsRequired)) {
      studentInfoValidationErrors["totalUnitsRequired"] =
        "Total units req must be a positive number.";
    }
    // GWA Textfields
    if (stGwa.length === 0) {
      studentInfoValidationErrors["gwa"] = "GWA is required.";
    }
    if (Number(stGwa) < 0 || isNaN(stGwa)) {
      studentInfoValidationErrors["gwa"] = "GWA must be a positive number.";
    }

    setStErrors(studentInfoValidationErrors);

    // Validation for each semester
    const stGradesCopy = JSON.parse(JSON.stringify(stGrades));
    const recordsValidationErrors = stGradesCopy.map((term) => {
      // sem
      if (term.sem.length === 0) {
        term.sem = "Please select semester.";
      } else {
        term.sem = "";
      }
      // ay
      const acadYearConstruct = new RegExp("^[0-9]{4}-[0-9]{4}$");
      if (term.year.length === 0) {
        term.year = "A.Y. is required.";
      }
      if (!acadYearConstruct.test(term.year)) {
        term.year = "A.Y. must be in the format XXXX-XXXX.";
      } else {
        term.year = "";
      }
      // status
      if (term.status.length === 0) {
        term.status = "Please select enrollment status.";
      } else {
        term.status = "";
      }
      // units
      if (term.units.length === 0) {
        term.units = "Number of units required.";
      }
      if (Number(term.units) < 0 || isNaN(term.units)) {
        term.units = "Units must be a non-negative number.";
      } else {
        term.units = "";
      }

      term.subjects = term.subjects.map((sub) => {
        // courseNo
        if (sub[0].length === 0) {
          sub[0] = "Required.";
        } else {
          sub[0] = "";
        }
        // grade
        if (sub[1].length === 0) {
          sub[1] = "Required.";
        } else {
          sub[1] = "";
        }
        // unit
        if (sub[2].length === 0) {
          sub[2] = "Required.";
        } else {
          sub[2] = "";
        }
        // weight
        if (sub[3].length === 0) {
          sub[3] = "Required.";
        }
        if (Number(sub[3]) < 0 || isNaN(sub[3])) {
          sub[3] = "Non-negative number required.";
        } else {
          sub[3] = "";
        }
        // cumulative
        if (sub[4].length === 0) {
          sub[4] = "Required.";
        }
        if (Number(sub[4]) < 0 || isNaN(sub[4])) {
          sub[4] = "Non-negative number required.";
        } else {
          sub[4] = "";
        }

        return sub;
      });

      return term;
    });

    setRecordErrors(recordsValidationErrors);

    for (const [key, value] of Object.entries(studentInfoValidationErrors)) {
      if (value.length) {
        return false;
      }
    }

    for (const tr of recordsValidationErrors) {
      if (tr.sem || tr.year || tr.status || tr.units) {
        return false;
      }

      for (const sub of tr.subjects) {
        for (const subErr of sub) {
          if (subErr) {
            return false;
          }
        }
      }
    }

    if (isRemarkRequired && newRemarks.length === 0) {
      setResult({
        status: "warning",
        note: "Adding a remark is required when updating a record.",
      });
      return false;
    }

    return true;
  };

  const handleCheckInputsClick = () => {
    setSaving(true);

    if (!validate(false)) {
      setSaving(false);
      return;
    }

    const stRecord = {
      name: {
        first: stFirstName,
        last: stLastName,
        middle: stMiddleInitial,
      },
      course: stDegreeProgram,
      studentNo: stNumber,
      records: stGrades,
      totalUnitsTaken: stTotalUnitsTaken,
      totalUnitsRequired: stTotalUnitsRequired,
      GWA: stGwa,
    };

    fetch(process.env.REACT_APP_API_PATH + "/checkForWarnings", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentObject: stRecord }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSaving(false);
          if (data.warnings.length === 0) {
            setResult({
            status: "success",
            note: "All good!",
            });
          } else {
            setResult({
              status: "warning",
              note: "Detected inconsistencies!",
            });
            setRecordWarnings(data.warnings);
          }
          setAreInputsChecked(true);
        } else {
          setResult({
            status: "error",
            note: "Detected invalid input/s!",
          });

          setRecordWarnings(data.warnings);
          setAreInputsChecked(true);
        }
      })
      .catch((err) => {
        setSaving(false);
        console.log(err);
      });
  };

  const handleSignClick = () => {
    fetch(process.env.REACT_APP_API_PATH + "/sign", {
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
      body: JSON.stringify({ studentNo: stNumber }), // body data type must match "Content-Type" header
    })
      .then((response) => response.json())
      .then((data) => {
        setSaving(false);

        // Redirect to student records page if signing succeeded
        if (data.success) {
          setResult({
            status: "success",
            note: data.note,
          });
          setTimeout(() => {
            navigate("/student-records");
          }, 800);
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
        setSaving(false);
        console.error(error);
      });
  };

  const handleShowSignConfirmationModal = () => {
    setSignConfirmationModalOpen(true);
  };

  const handleUnsignClick = () => {
    fetch(process.env.REACT_APP_API_PATH + "/unsign", {
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
      body: JSON.stringify({ studentNo: stNumber }), // body data type must match "Content-Type" header
    })
      .then((response) => response.json())
      .then((data) => {
        setSaving(false);

        // Redirect to student records page if signing succeeded
        if (data.success) {
          setResult({
            status: "success",
            note: data.note,
          });

          setTimeout(() => {
            window.location.reload();
          }, 800);
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
        setSaving(false);
        console.error(error);
      });
  };

  // FETCH Call for Deleting Student Record
  const handleDeleteClick = () => {
    fetch(process.env.REACT_APP_API_PATH + "/deleteStudentRecord", {
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
      body: JSON.stringify({ studentNo: stNumber }), // body data type must match "Content-Type" header
    })
      .then((response) => response.json())
      .then((data) => {
        setSaving(false);

        // Redirect to student records page if signing succeeded
        if (data.success) {
          setResult({
            status: "success",
            note: data.note,
          });
          setTimeout(() => {
            navigate("/student-records");
          }, 800);
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
        setSaving(false);
        console.error(error);
      });
  };

  useEffect(() => {
    const searchForStudent = { studentNo: studentNumber.id };
    fetch(process.env.REACT_APP_API_PATH + "/viewStudentRecord", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchForStudent),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.success) {
          const stObject = body.studentObject;

          setStNumber(stObject.studentNo);
          setStFirstName(stObject.name.first);
          setStLastName(stObject.name.last);
          setStDegreeProgram(stObject.course);
          setStTotalUnitsTaken(stObject.totalUnitsTaken);
          setStTotalUnitsRequired(stObject.totalUnitsRequired);
          setStGwa(stObject.GWA);
          setStVerifiedBy(stObject.verifiedBy);
          setStRemarks(stObject.remarks);

          for (let i = 0; i < stObject.records.length; i++) {
            setStGrades((prev) => [
              ...prev,
              {
                sem: stObject.records[i].sem,
                year: stObject.records[i].year,
                status: stObject.records[i].status,
                units: stObject.records[i].units,
                subjects: stObject.records[i].subjects,
              },
            ]);

            setRecordErrors((prev) => [
              ...prev,
              {
                sem: "",
                year: "",
                status: "",
                units: "",
                subjects: [],
              },
            ]);
          }
        } else {
          console.log(body);
        }
        setFetched(true);
      });

    fetch("http://localhost:3001/isAdmin", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "include", // include, *same-origin, omit
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
      .then((response) => response.json())
      .then((data) => {
        setIsAdmin(data.isAdmin);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Renders a loading icon
  // while waiting for data to get fetched
  if (fetched === undefined) {
    return <LoadingPage />;
  }

  return (
    <>
      <ShackerToolbar />
      <Container sx={{ py: 3 }}>
        {/* Heading */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Page title */}
          <Typography variant="h1" fontSize={52} fontWeight="bold">
            Edit Record
          </Typography>

          {/* Status Indicator */}
          {saving && <CircularProgress color="info" />}
          {!saving && result.status === "good" && (
            <Fade in timeout={100}>
              <CheckIcon fontSize="large" color="success" />
            </Fade>
          )}
          {!saving && result.status === "error" && (
            <Fade in timeout={100}>
              <ErrorIcon fontSize="large" color="error" />
            </Fade>
          )}
          {!saving && result.status === "warning" && (
            <Fade in timeout={100}>
              <WarningIcon fontSize="large" color="warning" />
            </Fade>
          )}

          <HandleScroll />
        </Box>

        {/* Student Details Section */}
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={3}>
            <Stack>
              <Typography variant="subtitle2" sx={{ ...labelStyle, mb: 1 }}>
                STUDENT NUMBER
              </Typography>
              <TextField
                sx={disabledInputSx(stVerifiedBy.length > 0)}
                variant="outlined"
                name="stNumber"
                label="XXXX-YYYYY"
                fullWidth
                defaultValue={stNumber}
                onBlur={onStudentInfoChange}
                error={stErrors["num"].length !== 0}
                helperText={stErrors["num"]}
                disabled={stVerifiedBy.length > 0}
              />
            </Stack>
          </Grid>
          <Grid item xs={7}>
            <Stack>
              <Typography variant="subtitle2" sx={{ ...labelStyle, mb: 1 }}>
                STUDENT NAME
              </Typography>
              <Stack direction="row" spacing={1}>
                <TextField
                  sx={disabledInputSx(stVerifiedBy.length > 0)}
                  variant="outlined"
                  name="stLastName"
                  label="LAST NAME"
                  defaultValue={stLastName}
                  onBlur={onStudentInfoChange}
                  error={stErrors["lName"].length !== 0}
                  helperText={stErrors["lName"]}
                  disabled={stVerifiedBy.length > 0}
                />
                <TextField
                  sx={disabledInputSx(stVerifiedBy.length > 0)}
                  variant="outlined"
                  name="stFirstName"
                  label="FIRST NAME"
                  defaultValue={stFirstName}
                  onBlur={onStudentInfoChange}
                  error={stErrors["fName"].length !== 0}
                  helperText={stErrors["fName"]}
                  disabled={stVerifiedBy.length > 0}
                />
                <TextField
                  sx={disabledInputSx(stVerifiedBy.length > 0)}
                  variant="outlined"
                  name="stMiddleInitial"
                  label="M.I."
                  defaultValue={stMiddleInitial}
                  onBlur={onStudentInfoChange}
                  disabled={stVerifiedBy.length > 0}
                />
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={2}>
            <Stack>
              <Typography variant="subtitle2" sx={{ ...labelStyle, mb: 1 }}>
                DEGREE PROGRAM
              </Typography>
              <FormControl sx={{ minWidth: 120, width: '100%' }} error={
                    stErrors['degreeProgram'].length !== 0
                  }>
                <InputLabel id="select-degree-program">Select one...</InputLabel>
                <Select
                  sx={disabledInputSx(stVerifiedBy.length > 0)}
                  labelId="select-degree-program"
                  id="select-degree-program"
                  value={stDegreeProgram}
                  name="stDegreeProgram"
                  label="Select one..."
                  onChange={onStudentInfoChange}
                  disabled={stVerifiedBy.length > 0}
                >
                  {
                    degreeProgramList.map((val) => <MenuItem value={val}>{val}</MenuItem>)
                  }
                </Select>
                {(stErrors['degreeProgram'].length !== 0) && (
                  <FormHelperText>{stErrors['degreeProgram']}</FormHelperText>
                )}
              </FormControl>
            </Stack>
          </Grid>
        </Grid>

        {/* Grades Section */}
        <Typography variant="subtitle2" sx={{ ...labelStyle, mt: 3 }}>
          GRADES
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          {stGrades.length === 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Add a term to start!
            </Alert>
          )}

          <StudentGradesContext.Provider
            value={{
              grades: stGrades,
              setGrades: setStGrades,
              setRecordErrors,
            }}
          >
            {stGrades.map((term, tIdx) => (
              <TermGrades
                key={tIdx}
                id={tIdx}
                sem={term.sem}
                year={term.year}
                status={term.status}
                units={term.units}
                subjects={term.subjects}
                errors={recordErrors[tIdx]}
                editable={stVerifiedBy.length === 0}
              />
            ))}
          </StudentGradesContext.Provider>

          { stVerifiedBy.length === 0 && <Button
            variant="contained"
            size="small"
            color="success"
            startIcon={<AddIcon />}
            sx={{ px: 2 }}
            onClick={handleAddTermClick}
          >
            Add a Term
          </Button> }
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
          <Grid container spacing={4}>
            <Grid item>
              <Stack sx={{ width: 220 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ ...labelStyle, fontSize: 12 }}
                >
                  TOTAL UNITS TAKEN
                </Typography>
                <TextField
                  sx={disabledInputSx(stVerifiedBy.length > 0)}
                  size="small"
                  variant="outlined"
                  name="stTotalUnitsTaken"
                  defaultValue={stTotalUnitsTaken}
                  onBlur={onStudentInfoChange}
                  error={stErrors["totalUnitsTaken"].length !== 0}
                  helperText={stErrors["totalUnitsTaken"]}
                  disabled={stVerifiedBy.length > 0}
                />
              </Stack>
            </Grid>

            <Grid item>
              <Stack sx={{ width: 220 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ ...labelStyle, fontSize: 12 }}
                >
                  TOTAL UNITS REQUIRED
                </Typography>
                <TextField
                  sx={disabledInputSx(stVerifiedBy.length > 0)}
                  size="small"
                  variant="outlined"
                  name="stTotalUnitsRequired"
                  defaultValue={stTotalUnitsRequired}
                  onBlur={onStudentInfoChange}
                  error={stErrors["totalUnitsRequired"].length !== 0}
                  helperText={stErrors["totalUnitsRequired"]}
                  disabled={stVerifiedBy.length > 0}
                />
              </Stack>
            </Grid>

            <Grid item>
              <Stack sx={{ width: 220 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ ...labelStyle, fontSize: 12 }}
                >
                  GWA:
                </Typography>
                <TextField
                  sx={disabledInputSx(stVerifiedBy.length > 0)}
                  size="small"
                  variant="outlined"
                  name="stGwa"
                  defaultValue={stGwa}
                  onBlur={onStudentInfoChange}
                  error={stErrors["gwa"].length !== 0}
                  helperText={stErrors["gwa"]}
                  disabled={stVerifiedBy.length > 0}
                />
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Signed By */}
        <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{ ...labelStyle, fontSize: 12, mb: 1 }}
          >
            Signed By ({stVerifiedBy.length}/2):
          </Typography>
          {stVerifiedBy &&
            stVerifiedBy.map((data, i) => (
              <Chip key={i} label={data} variant="outlined" sx={{ mr: 1 }} />
            ))}
        </Paper>

        {/* Remarks */}
        <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{ ...labelStyle, fontSize: 12, mb: 1 }}
          >
            Remarks
          </Typography>
          {stRemarks &&
            stRemarks.map((data, i) => (
              <>
                <Chip key={i} label={data} sx={{ mb: 1 }} />
                <br />
              </>
            ))}

          <TextField
            sx={{ ...disabledInputSx(stVerifiedBy.length > 0), mt: 3, fontSize: 14 }}
            fullWidth
            id="remarks"
            label="Please put a remark documenting your changes."
            multiline
            maxRows={4}
            value={newRemarks}
            onChange={(e) => setNewRemarks(e.target.value)}
            disabled={stVerifiedBy.length > 0}
          />
        </Paper>

        {result.status && (
          <Fade in timeout={100}>
            <Alert severity={result.status} sx={{ mt: 1 }}>
              {result.note}
            </Alert>
          </Fade>
        )}

        <RecordWarningsTable recordWarnings={recordWarnings} />

        {/* Action Buttons Section */}
        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Link to="/student-records" style={{ textDecoration: "none" }}>
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
              color="info"
              onClick={handleCheckInputsClick}
              sx={{
                mr: 2,
              }}
            >
              Check inputs
            </Button>
            {stVerifiedBy.length === 0 && (
              <Button
                variant="contained"
                color="info"
                onClick={handleUpdateClick}
                sx={{
                  mr: 2,
                }}
              >
                Update
              </Button>
            )}
            <Button
              variant="contained"
              color="info"
              disabled={
                !areInputsChecked ||
                stVerifiedBy.includes(localStorage.getItem("user")) ||
                stVerifiedBy.length === 2
              }
              onClick={
                stVerifiedBy.length === 1
                  ? handleShowSignConfirmationModal
                  : handleSignClick
              }
              sx={{
                mr: 2,
              }}
            >
              Sign
            </Button>
            {((isAdmin && stVerifiedBy.length > 0) ||
              stVerifiedBy.includes(localStorage.getItem("user"))) && (
              <Button
                variant="contained"
                color="warning"
                onClick={handleUnsignClick}
                sx={{
                  mr: 2,
                }}
              >
                Unsign
              </Button>
            )}
          </Box>

          {/* Status Indicator */}
          {saving && <CircularProgress color="info" />}
          {!saving && result.status === "good" && (
            <Fade in timeout={100}>
              <CheckIcon fontSize="large" color="success" />
            </Fade>
          )}
          {isAdmin && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteClick}
              sx={{
                mr: 2,
              }}
            >
              Delete
            </Button>
          )}
          <HandleScrollTop/ >
          {!saving && result.status === "error" && (
            <Fade in timeout={100}>
              <ErrorIcon fontSize="large" color="error" />
            </Fade>
          )}
          {!saving && result.status === "warning" && (
            <Fade in timeout={100}>
              <WarningIcon fontSize="large" color="warning" />
            </Fade>
          ) }
        </Box>
      </Container>

      {/* Will show when User 2 attempts to sign the record */}
      <SignConfirmationModal
        open={signConfirmationModalOpen}
        setOpen={setSignConfirmationModalOpen}
        stRecord={{
          name: {
            first: stFirstName,
            last: stLastName,
            middle: stMiddleInitial,
          },
          course: stDegreeProgram,
          studentNo: stNumber,
          records: stGrades,
          totalUnitsTaken: stTotalUnitsTaken,
          totalUnitsRequired: stTotalUnitsRequired,
          GWA: stGwa,
        }}
      />
    </>
  );
};

export default EditStudentRecordPage;
