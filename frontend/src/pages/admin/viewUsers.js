import SearchBar from '../../components/SearchBar';
import ShackerToolbar from '../../components/ShackerToolbar';
import LoadingPage from '../../components/LoadingPage'

import React, { useState , useEffect, useContext } from 'react'
import { Link } from "react-router-dom";
import Cookies from 'universal-cookie';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';


import { Box, Button, Container, Grid, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { Table, TableBody, TableCell,TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';

import { UserContext } from '../../contexts/UserContext';


/**
 * Component for Manage Users Page
 * Page will display the following: (1) first name, (2) last name, (3) email
 * Features: (1) Can delete users, (2) Can Promote user
 */

//UP COLOR SCHEME
const maroon = "#8A1538";
const green = "#0D542F";
  
function ManageUsers() {
    const { user, setUser } = useContext(UserContext);
    const [userArray, setUserArray] = useState([]);
    const [gotFetched, setgotFetched] = useState();
    
    /**
     * Used to fetch ALL USERS data from database 
     * to be displayed in the table
     */
    useEffect(() => {
        fetch(
            process.env.REACT_APP_API_PATH +"/getAllUsers",
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
                setUserArray(body.users);
                setgotFetched(true);
            }
            else{
                console.log(body.note);
            }
            })
            .catch(err => console.log(err)); 
    }, [])

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // Handles Pagination(1)
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    // Handles Pagination(2)
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const promoteUser = (e, index) => {
        e.preventDefault();

        // Data to be sent to API for promote User
        const toPromote = {
            email: userArray[index].user.email
        }

        fetch(
            process.env.REACT_APP_API_PATH +"/promoteUser",
            {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(toPromote)
            })
            .then(response => response.json())
            .then(body => {
            if (body.success) {
                // If promotion is successful
                // Removes all cookies and tokens
                // Redirects User to log in page (logs out admin)
                const cookies = new Cookies();
                cookies.remove('authToken', { path: '/admin' });
                cookies.remove('authToken', { path: '/' });
                setUser(null);
                localStorage.removeItem('user');
                localStorage.removeItem('isAuthenticated');
                localStorage.clear();
                window.localStorage.clear()
                window.location.reload(true)
            }
            else{
                console.log(body.note);
            }
            })
            .catch(err => console.log(err)); 
    }

    const deleteUser = (e, index) => {
        e.preventDefault();

        // Data sent to API call for Deleting User
        const toDelete = {
            email: userArray[index].user.email
        }

        // FETCH Call to Delete User
        fetch(
            process.env.REACT_APP_API_PATH +"/deleteUser",
            {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(toDelete)
            })
            .then(response => response.json())
            .then(body => {
            if (body.success) {
                window.location.reload()
            }
            else{
                console.log(body.note);
            }
            })
            .catch(err => console.log(err)); 
    }

    // Renders a loading icon 
    // while waiting for data to get fetched
    if (gotFetched === undefined) {
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

                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                        {/* Page title */}
                        <Typography variant="h1" fontSize={52} fontWeight="bold">
                            Manage Users
                        </Typography>
                    </Box>

                    {/* Add New Record & Search Bar*/}
                    <Box>
                        <Grid container spacing={2}>

                            {/*Add New User */}
                            <Grid item xs={9}>
                                <Link to="/admin/users/add" style={{ textDecoration: 'none' }}>
                                    <Button variant="contained"
                                        startIcon={<AddIcon />}
                                        color="success"
                                        sx={{ px: 2 }}>
                                        Add new user
                                    </Button>
                                </Link>
                            </Grid>

                            {/* Search Button */}
                            <Grid item sx={3}>
                                <SearchBar />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Users Table */}
                    <Box>
                        <Paper sx={{ width: '100%' }}>
                            <TableContainer sx={{ maxHeight: '80%' }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Firstname</TableCell>
                                            <TableCell>Lastname</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
        
                                    <TableBody>
                                        {userArray.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {item.user.name.fname}                         
                                                </TableCell>
                                                <TableCell>
                                                    {item.user.name.lname} 
                                                </TableCell>
                                                <TableCell>
                                                    {item.user.email} 
                                                </TableCell>
                                                <TableCell>
                                                    {localStorage.getItem('user') === item.user.email ? null: 
                                                    <Tooltip title="Promote">
                                                        <IconButton onClick={(event) => promoteUser(event, index)}>
                                                            <AdminPanelSettingsIcon sx={{color: green}}/>
                                                        </IconButton>
                                                    </Tooltip>}
                                                    {localStorage.getItem('user') === item.user.email ? null: 
                                                    <Tooltip title="Delete">
                                                        <IconButton onClick={(event) => deleteUser(event, index)}>
                                                            <DeleteIcon sx={{color: maroon}}/>
                                                        </IconButton>
                                                    </Tooltip>}
                                                </TableCell>
                                            </ TableRow>
                                        ))}
                                    </TableBody>

                                </Table>
                            </TableContainer>

                            {/* Table Pagination */}
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={(userArray.length)}
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

export default ManageUsers;