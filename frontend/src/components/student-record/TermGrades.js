import React, { useContext } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from "@mui/material/Divider"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import StudentGradesContext from '../../contexts/StudentGradesContext';
import TermInfo from './TermInfo';

/* SAMPLE DATA */
function createData(courseNo, grade, units, weight, cumulative, term ) {
  return { courseNo, grade, units, weight, cumulative, term  };
}

const rows = [
  createData('ENG 1(AH)', 2, 3, 6, 6, '18 I/15/16'),
  createData('FIL 20', 2.25, 3, 6.75, 12.75, '18 I/15/16'),
  createData('IT 1(MST)', 2, 3, 6, 18.75, '18 I/15/16'),
  createData('PE 1', 2, 0, 0, 18.75, '18 I/15/16'),
  createData('PHLO1(SSP)', 1.75, 3, 5.25, 24, '18 I/15/16'),
];

const rightAlignInputStyle = {
  input: { textAlign: 'right' }
};

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
        }
      }
    );

  return {};
}

/**
 * Gets the index number of the component of a grade/subject
 * @param {string} component Component name
 * @returns {number} Index of the component from the grade/subject array
 */
const getSubjectComponentIndex = (component) => {
  switch (component) {
    case 'courseNo':
      return 0;
    case 'grade':
      return 1;
    case 'units':
      return 2;
    case 'weight':
      return 3;
    case 'cumulative':
      return 4;
    default:
      return -1;
  }
}

/**
 * A React component that displays all the grades of a student in a given term.
 * @returns React component for TermGrades
 */
const TermGrades = ({ id, sem, year, status, units, subjects, errors, editable }) => {
  const { setGrades, setRecordErrors } = useContext(StudentGradesContext);

  /**
   * Updates the state to reflect the change in grade field/s.
   * 
   * @param {string} termIndex Term reference
   * @param {number} subjectIndex Position of the grade object from the grades array
   * @param {string} columnIndex Accessor index from the subject object ([1: courseNo, 2: grade, 3: units, 4: weight, 5: cumulative])
   * @param {string} value Updated value of the field
   */
  const setItem = (termIndex, subjectIndex, columnIndex, value) => {
    setGrades(terms => {
      return terms.map((term, tIdx) => {
        if (tIdx === termIndex) {
          if (term.subjects) {
            term.subjects = term.subjects.map((subject, sIdx) => {
              if (subjectIndex === sIdx) {
                // Capitalize input in courseNo field
                subject[columnIndex] = columnIndex === 0 ? value.toUpperCase() : value;
              }

              return subject;
            })
          }
        }

        return term;
      })
    })
  }

  /**
   * Handles the change in value of the textfields in the grades table.
   * 
   * @param {*} event Event object from the onChange event
   * @param {string} termIndex Term reference
   * @param {number} subjectIndex Position of the grade object from the grades array
   * @param {Array} grade Grade object that contains [ courseNo, grade, units, weight, cumulative ]
   */
  const handleValueChange = (event, termIndex, subjectIndex, grade) => {
    const { value, name } = event.target;
    
    // Only update the state when the value of the grade component (name) is changed
    if (value != grade[getSubjectComponentIndex(name)])
      setItem(termIndex, subjectIndex, getSubjectComponentIndex(name), value);
  }

  // Handles the adding of a grade in the corresponding term
  const handleAddGradeClick = () => {
    setGrades((terms) => (
      terms.map((term, tIdx) => {
        if (tIdx === id) {
          term.subjects = [...term.subjects, ['', '', '', '', '']];
        }

        return term;
      })
    ))
  };

  // Handles the removal of row in grades table
  const handleRemoveRow = (index) => {
    // Delete grade row at index i
    const newGrades = subjects.filter((g, i) => index !== i);

    setGrades((terms) => (
      terms.map((term, tIdx) => {
        if (tIdx === id) {
          // Update term record with the new grades
          if (term.subjects) {
            term.subjects = newGrades;
          }
        }

        return term;
      })
    ))

    // Delete error row at index i
    const newErrors = errors.subjects.filter((g, i) => index !== i);

    setRecordErrors((terms) => (
      terms.map((term, tIdx) => {
        if (tIdx === id) {
          // Update term record with the new error rows
          if (term.subjects) {
            term.subjects = newErrors;
          }
        }

        return term;
      })
    ))
  }

  return (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <TermInfo editable={editable} termIndex={id} tiSem={sem} tiYear={year} tiStatus={status} tiUnits={units} errors={{
             sem: errors.sem, 
             year: errors.year, 
             status: errors.status, 
             units: errors.units, 
          }}  />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
              <TableHead>
                <TableRow sx={{ '& > *': { fontWeight: 'bold !important' } }}>
                  { editable && <TableCell width="5%">{/* Remove/Delete Action Column */}</TableCell> }
                  <TableCell width="19%">Course No.</TableCell>
                  <TableCell width="19%" align="right">Grade</TableCell>
                  <TableCell width="19%" align="right">Units</TableCell>
                  <TableCell width="19%" align="right">Weight</TableCell>
                  <TableCell width="19%" align="right">Cumulative</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects && subjects.map((grade, subIdx) => (
                  <TableRow
                    key={subIdx}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    {/* Remove/Delete Icon Button */}
                    { editable && <TableCell align="center" sx={{ p: 0 }}>
                      <IconButton color="error" onClick={() => handleRemoveRow(subIdx)}>
                        <RemoveCircleIcon />
                      </IconButton>
                    </TableCell> }
                    <TableCell component="th" scope="row">
                      <TextField
                        sx={disabledInputSx(!editable)}
                        name="courseNo"
                        variant="outlined"
                        size="small"
                        value={grade[0]}
                        onChange={(e) => handleValueChange(e, id, subIdx, grade)}
                        error={
                          errors.subjects[subIdx]
                          && errors.subjects[subIdx][0].length !== 0
                        }
                        helperText={errors.subjects[subIdx] && errors.subjects[subIdx][0]}
                        disabled={!editable}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        name="grade"
                        sx={{...rightAlignInputStyle, ...disabledInputSx(!editable)}}
                        variant="outlined"
                        size="small"
                        value={grade[1]}
                        onChange={(e) => handleValueChange(e, id, subIdx, grade)}
                        error={
                          errors.subjects[subIdx]
                          && errors.subjects[subIdx][1].length !== 0
                        }
                        helperText={errors.subjects[subIdx] && errors.subjects[subIdx][1]}
                        disabled={!editable}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        name="units"
                        sx={{...rightAlignInputStyle, ...disabledInputSx(!editable)}}
                        variant="outlined"
                        size="small"
                        value={grade[2]}
                        onChange={(e) => handleValueChange(e, id, subIdx, grade)}
                        error={
                          errors.subjects[subIdx]
                          && errors.subjects[subIdx][2].length !== 0
                        }
                        helperText={errors.subjects[subIdx] && errors.subjects[subIdx][2]}
                        disabled={!editable}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        name="weight"
                        sx={{...rightAlignInputStyle, ...disabledInputSx(!editable)}}
                        variant="outlined"
                        size="small"
                        value={grade[3]}
                        onChange={(e) => handleValueChange(e, id, subIdx, grade)}
                        error={
                          errors.subjects[subIdx]
                          && errors.subjects[subIdx][3].length !== 0
                        }
                        helperText={errors.subjects[subIdx] && errors.subjects[subIdx][3]}
                        disabled={!editable}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        name="cumulative"
                        sx={{...rightAlignInputStyle, ...disabledInputSx(!editable)}}
                        variant="outlined"
                        size="small"
                        value={grade[4]}
                        onChange={(e) => handleValueChange(e, id, subIdx, grade)}
                        error={
                          errors.subjects[subIdx]
                          && errors.subjects[subIdx][4].length !== 0
                        }
                        helperText={errors.subjects[subIdx] && errors.subjects[subIdx][4]}
                        disabled={!editable}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          { editable && <Button
            size="small"
            startIcon={<AddIcon />}
            sx={{
              mt: 1,
              px: 0,
            }}
            color="success"
            onClick={handleAddGradeClick}
          >
            Add a Grade
          </Button> }
        </Paper>
  )
}

export default TermGrades