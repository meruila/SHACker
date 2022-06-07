import React, { useContext, useEffect } from 'react';
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import StudentGradesContext from '../../contexts/StudentGradesContext';

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
        '.MuiSelect-select.MuiSelect-outlined.Mui-disabled.MuiOutlinedInput-input.MuiInputBase-input.Mui-disabled.MuiInputBase-inputSizeSmall': {
          "-webkit-text-fill-color": '#212121 !important',
          "color": '#212121 !important',
          background: '#f5f5f5 !important',
        }
      }
    );

  return {};
}

export default function TermInfo({ termIndex, tiSem, tiYear, tiStatus, tiUnits, errors, editable }) {
  const [sem, setSem] = React.useState('');
  const [year, setYear] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [units, setUnits] = React.useState('');

  // Match state and prop values for TextField(s)
  useEffect(() => { 
    setYear(tiYear);
    setUnits(tiUnits);
  }, [tiYear, tiUnits])

  const { setGrades } = useContext(StudentGradesContext);

  /**
   * Updates a specific info in the term object (sem, year, status, or units)
   * @param {number} tIndex Index position of the term object
   * @param {string} key Key of the component in the term object
   * @param {string} value Updated value of the component
   */
  const setTermInfo = (tIndex, key, value) => {
    setGrades(terms => {
      return terms.map((term, tIdx) => {
        if (tIdx === tIndex) {
          return {
            ...term,
            [key]: value
          }
        }

        return term;
      })
    })
  }

  /**
   * Handles the event when term info values are changed
   * @param {*} event 
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setTermInfo(termIndex, name, value);

    switch (name) {
      case 'sem':
        setSem(value);
        break;
      case 'year':
        setYear(value);
        break;
      case 'status':
        setStatus(value);
        break;
      case 'units':
        setUnits(value);
        break;
    }
  };


  const handleRemoveSemClick = () => {
    setGrades((grades) => {
      let newGrades = JSON.parse(JSON.stringify(grades));
      newGrades = newGrades.filter((g, i) => i !== termIndex);
      return newGrades;
    })
  }
  
  return (
    <Box container sx={{ mb: 2, display: 'flex' }} spacing={1}>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small" error={
                    Boolean(
                      errors.sem && errors.sem.length !== 0
                      // 'hello'
                    )
                  }>
                <InputLabel id="select-semester">Semester</InputLabel>
                <Select
                  sx={disabledInputSx(!editable)}
                  labelId="select-semester"
                  id="select-semester"
                  value={tiSem}
                  name="sem"
                  label="Semester"
                  onChange={handleChange}
                  disabled={!editable}
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="M">M</MenuItem>
                </Select>
                {(errors.sem && errors.sem.length !== 0) && (
                  <FormHelperText>{errors.sem}</FormHelperText>
                )}
              </FormControl>

              <TextField
                sx={{...disabledInputSx(!editable), mt: 1, width: 150 }}
                size="small"
                variant="outlined"
                name="year"
                label="A.Y."
                value={year}
                onChange={handleChange}
                error={
                  errors.year
                  && errors.year.length !== 0
                }
                helperText={
                  (errors.year && errors.year.length !== 0)
                  ? errors.year : "Format: XXXX-XXXX"
                }
                disabled={!editable}
              />
              
              <FormControl sx={{ m: 1, minWidth: 90 }} size="small" error={
                    Boolean(
                      errors.status && errors.status.length !== 0
                    )
                  }>
                <InputLabel id="select-status">Status</InputLabel>
                <Select
                  sx={disabledInputSx(!editable)}
                  labelId="select-status"
                  id="select-status"
                  value={tiStatus}
                  name="status"
                  label="Status"
                  onChange={handleChange}
                  disabled={!editable}
                >
                  <MenuItem value="ENROLLED">ENROLLED</MenuItem>
                  <MenuItem value="AWOL">AWOL</MenuItem>
                  <MenuItem value="LOA">LOA</MenuItem>
                </Select>
                {(errors.status && errors.status.length !== 0) && (
                  <FormHelperText>{errors.status}</FormHelperText>
                )}
              </FormControl>
              
              <TextField
                sx={{...disabledInputSx(!editable), mt: 1, width: 110 }}
                size="small"
                variant="outlined"
                name="units"
                label="No. of Units"
                value={units}
                onChange={handleChange}
                error={
                  errors.units
                  && errors.units.length !== 0
                }
                helperText={errors.units}
                disabled={!editable}
              />

              { editable && <Box sx={{ textAlign: 'right', ml: 'auto', pt: 1 }}>
                {/* Remove term */}
                <Tooltip title="Remove semester">
                  <IconButton onClick={handleRemoveSemClick}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box> }
          </Box>
  )
}