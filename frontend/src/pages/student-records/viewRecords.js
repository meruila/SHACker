import ShackerToolbar from '../../components/ShackerToolbar';

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Box, Container, Grid, Stack, Paper, Typography, Button } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

import { Table, TableBody, TableCell,TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@mui/material';
import {IconButton, InputBase, Chip} from '@mui/material';

import PropTypes from "prop-types";

import DeleteDialog from '../../components/dialogs/DeleteDialog'
import LoadingPage from '../../components/LoadingPage';

/**
 * Component for View Student Records
 * Shows the Student Number, Last Name, First Name, and Degree Program of all the students from the Student Records DB.
 * The Search bar filters the contents with regards to the search item.
 * 
 */

// Sorting: https://mui.com/x/react-data-grid/sorting/
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
  
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
  
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  
  stabilizedThis.sort((a, b) => { 
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
  
// Defines column header names and its attributes
const headCells = [
  { id: "studentNo", numeric: false, label: "Student Number" },
  { id: "lastName", numeric: false, label: "Last name" },
  { id: "firstName", numeric: false, label: "First Name" },
  { id: "course", numeric: false, label: "Degree" },
  { id: "verifiedBy", numeric: false, label: "Verified by" }
];
  
function EnhancedTableHead(props) {
  const {
    order,
    orderBy,
    onRequestSort,
  } = props;
  
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
  
EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

function StudentRecord() {
  const navigate = useNavigate();

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [rows, setRows] = useState();
  const [searched, setSearched] = useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [studentArray, setStudentArray] = useState([]);
  const [arrayFetch, setArrayFetch] = useState()

  useEffect(() => {
    fetch(process.env.REACT_APP_API_PATH +"/getStudentRecords",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
        })
        .then(response => response.json())
        .then(body => {
          if (body.success) {
            let customRows = [];

              //setgotFetched(true);
            if(body.records.length !== 0){ //check first if there is a saved record
              for(let i = 0; i < body.records.length; i++){
                customRows.push({
                  lastName: body.records[i].name.last,
                  firstName: body.records[i].name.first,
                  course: body.records[i].course,
                  studentNo: body.records[i].studentNo,
                  verifiedBy: body.records[i].verifiedBy
                })
                if (i === (body.records.length - 1)){
                  setRows(customRows)
                  setStudentArray(customRows);
                  setArrayFetch(true);
                }                
              }
            }else{
              setRows(customRows);
              setStudentArray(customRows);
              setArrayFetch(true);
            }

          }
          else {
            console.log(body);
          }
    })
    .catch(err => console.log(err));   

}, [])

  const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
  };

  // Handles Pagination (1)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handles Pagination (2)
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

    // Navigates to individual students records
  const navigateToUser = (e, studentNo) => {
    e.preventDefault();
    const navigateTo = "/student-records/" + studentNo
    navigate(navigateTo)
  }

  // Currently filters using Course
  const requestSearch = (searchedVal) => {
    setSearched(searchedVal.target.value)

    const lowerCased = searchedVal.target.value.toLowerCase();
    const filteredRows = studentArray.filter((row) => {
      return row.studentNo.toLowerCase().includes(lowerCased);
    });
    setRows(filteredRows);
  };

  // Renders a loading icon 
  // while waiting for data to get fetched
  if (arrayFetch === undefined) {
    return (
        <LoadingPage />
    );
  }
    return (
      <div>
      {/* Toolbar Component */}
      <ShackerToolbar/>

      <Container sx={{ py: 3 }}>
          <Stack spacing={3}>

              {/* Heading */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                  {/* Page title */}
                  <Typography variant="h1" fontSize={52} fontWeight="bold">
                      Student Records
                  </Typography>
              </Box>

              {/* Add New Record & Search Bar*/}
              <Box>
                  <Grid container spacing={2}>
                      {/*Add New Record */}
                      <Grid item xs={2}>
                          <Link to="/student-records/new" style={{ textDecoration: 'none' }}>
                              <Button variant="contained"
                                  startIcon={<AddIcon />}
                                  color="success"
                                  sx={{ px: 2 }}>
                                  add record
                              </Button>
                          </Link>
                          
                      </Grid>
                      <Grid item xs={2}>
                      <Link to="/student-records/upload" style={{ textDecoration: 'none' }}>
                              <Button variant="contained"
                                  startIcon={<AddIcon />}
                                  color="success"
                                  sx={{ px: 2 }}>
                                  Upload
                              </Button>
                          </Link>
                      </Grid>
                      <Grid item xs={5}>
                        <DeleteDialog />
                      </Grid>
                      {/* Search Button */}
                      <Grid item sx={3}> 
                      <Paper component="form" sx={{ width: '250px'}}>
                        <InputBase
                            sx={{ ml: 2, flex: 3 }}
                            placeholder="search by student no"
                            value={searched}
                            onChange={(event) => requestSearch(event)}
                        />  
                        <IconButton>
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                      </Grid>
                  </Grid>
              </Box>

              {/* Student Record Table */}
              <Box>
                  <Paper sx={{ width: '100%' }}>
                      <TableContainer sx={{ maxHeight: '80%' }}>
                          <Table stickyHeader aria-label="sticky table">
                          <EnhancedTableHead
                              order={order}
                              orderBy={orderBy}
                              onRequestSort={handleRequestSort}
                              rowCount={rows.length}
                          />
                              <TableBody>

                                {/* If table is empty, renders "No Data" */}
                                {
                                  rows.length === 0 ? (
                                  <TableRow tabIndex={-1}>
                                    <TableCell align="center" colSpan={5}>No data.</TableCell>
                                  </TableRow>
                                  ) : null
                                }

                                {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                return (
                                    <TableRow
                                      hover
                                      tabIndex={-1}
                                      key={index}
                                      id={index}
                                      onClick={(event) => navigateToUser(event, row.studentNo)}
                                    >
                                    <TableCell align="left">{row.studentNo}</TableCell>
                                    <TableCell align="left">{row.lastName}</TableCell>
                                    <TableCell align="left">{row.firstName}</TableCell>
                                    <TableCell align="left">{row.course}</TableCell>
                                    {(row.verifiedBy.length === 0) && (
                                    <TableCell align="left">{"None"}</TableCell>
                                    )}
                                    {(row.verifiedBy.length === 1) && (
                                    <TableCell align="left"><Chip label={row.verifiedBy[0]} variant="outlined" sx={{ mr: 1 }} /></TableCell>
                                    )}
                                    {(row.verifiedBy.length === 2) && (
                                    <TableCell align="left">
                                      <Chip label={row.verifiedBy[0]} variant="outlined" sx={{ mr: 1 }} />
                                      <Chip label={row.verifiedBy[1]} variant="outlined" sx={{ mr: 1 }} /></TableCell>
                                    )}
                                    
                                    </TableRow>
                                );
                                })}
                              </TableBody>
                          </Table>
                      </TableContainer>

                      {/* Table Pagination */}
                      <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                  </Paper>
              </Box>
          </Stack>
      </Container>
  </div>               
  )
}

export default StudentRecord;