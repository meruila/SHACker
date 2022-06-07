import ShackerToolbar from '../components/ShackerToolbar';
import SearchBar from '../components/SearchBar'

import React, { useState , useEffect } from 'react'
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import LoadingPage from '../components/LoadingPage';
import DeleteLogDialog from '../components/dialogs/DeleteLogDialog';

// NOTE: [wip]: Retrieve editor name in logs array

/**
 * Component for Logs Page
 * Will receive from backend:
 *      (At least 20 logs from database ?)
 *      Name of student whose records have been edited recently
 *      Name of user that edited the student
 *      Action (add, edit, delete, etc)
 *      Date/Time the action has been done
 */
  
function Logs() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [logsArray, setLogsArray] = useState([]);
    const [gotFetched, setgotFetched] = useState();

    // Handles Pagination (1)
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    // Handles Pagination (2)
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // FETCH Call for Logs
    useEffect(() => {
        fetch(
            process.env.REACT_APP_API_PATH +"/viewLogs",
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
                  let logsArray = body.logs
                  let reversedArray = [...logsArray].reverse(); //reverse the order of objects in an object: https://stackoverflow.com/questions/51917746/reversing-an-array-of-objects-in-javascript
                  setLogsArray(reversedArray); //set the logs array the reversed array as to put the most recent changes
                  
                  setgotFetched(true);
              }
              else {
                console.log(body);
              }
            })
            .catch(err => console.log(err));

        

    }, [])

    // While fetching data for page, render loading page
    if (gotFetched === undefined) {
        return (
            <LoadingPage />
        );
    }

    return (
        <div>
            <ShackerToolbar />
            <Container sx={{ py: 3 }}>
                <Stack spacing={3}>

                    {/* Heading */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                        {/* Page title */}
                        <Typography variant="h1" fontSize={52} fontWeight="bold">
                            Logs
                        </Typography>
                    </Box>

                    

                    {/* Add New Record & Search Bar*/}
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={9.2
                            }>
                                <DeleteLogDialog />
                            {/* To push the SearchBar to the right side of the table */}
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Student Record Table */}
                    <Box>
                        <Paper sx={{ width: '100%' }}>
                            <TableContainer sx={{ maxHeight: '80%' }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Editor</TableCell>
                                            <TableCell>Action</TableCell>
                                            <TableCell>Record</TableCell>
                                            <TableCell>Time of Edit</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* If table is empty, renders "No Data" */}
                                        {
                                        logsArray.length === 0 ? (
                                        <TableRow tabIndex={-1}>
                                            <TableCell align="center" colSpan={5}>No data.</TableCell>
                                        </TableRow>
                                        ) : null
                                        }

                                        {logsArray
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                            <TableRow hover tabIndex={-1} key={index} id={index}>
                                                <TableCell align="left">{row.editorName}</TableCell>
                                                <TableCell align="left">{row.description}</TableCell>
                                                <TableCell align="left">{row.recordNumber}</TableCell>
                                                <TableCell align="left">{row.time}</TableCell>
                                            </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Pagination */}
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={(logsArray.length)}
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
    );
}

export default Logs;
