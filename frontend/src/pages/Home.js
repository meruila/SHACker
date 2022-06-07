import React, { useEffect, useState }from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardActions, CardContent }from '@mui/material';
import { Container, Grid } from '@mui/material';
import { Table, TableBody, TableCell,TableContainer, TableHead, TableRow } from '@mui/material';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip'

import HomeShackerToolbar from '../components/HomeShackerToolbar'
import LoadingPage from '../components/LoadingPage'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ListItem from '@mui/material/ListItem';

/**
 * Component for Shacker Homepage.
 * Page should display verified student, to be followed...
 * To Do: Add five most recent logs from the logs API Call
 */

function Homepage() {
    const Navigate = useNavigate();
    const [totalRecords, setTotalRecords] = useState();
    const [verifiedRecords, setVerifiedRecords] = useState();
    const [logsArray, setLogsArray] = useState([]);

    const [gotFetched, setgotFetched] = useState();

    
    useEffect(() => {
        // FETCH call for homeRecords
        fetch(
            process.env.REACT_APP_API_PATH +"/homeRecords",
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
                  // If successful
                  setTotalRecords(body.allCount);
                  setVerifiedRecords(body.verifiedCount);

                  // FETCH call for viewLogs
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
                            let reversedArray = [...logsArray].reverse(); 
                            //reverse the order of objects in an object: https://stackoverflow.com/questions/51917746/reversing-an-array-of-objects-in-javascript
                            setLogsArray(reversedArray); 
                            //set the logs array the reversed array as to put the most recent changes
                            
                            setgotFetched(true);
                        }
                        else {
                            console.log(body);
                        }
                        })
                        .catch(err => console.log(err));
              }
              else {
                console.log(body);
              }
            })
            .catch(err => console.log(err));

            
    }, [])


    // Rendering the logs
    const recentChanges = (
        <React.Fragment >
            <CardContent>
                {/* Insert Table */}
                <TableContainer sx={{ maxHeight: '80%'}} >
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead >
                            <TableRow >
                                <TableCell><ListItem><AccountBoxIcon /><strong>{'Editor'}</strong></ListItem></TableCell>
                                <TableCell><strong>Action</strong></TableCell>
                                <TableCell><strong>Record</strong></TableCell>
                                <TableCell><ListItem><AccessTimeIcon /><strong>Time of Access</strong></ListItem></TableCell>
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
                            .slice(0,5)
                            .map((row, index) => {
                                return (
                                <TableRow hover tabIndex={-1} key={index} id={index}>
                                    <TableCell align="left"><Chip key={index} label={row.editorName} variant="outlined" sx={{ mr: 1 }} /></TableCell>
                                    <TableCell align="left">{row.description}</TableCell>
                                    <TableCell align="left">{row.recordNumber}</TableCell>
                                    <TableCell align="left">{row.time}</TableCell>
                                </TableRow>
                                );
                            })} 
                        </TableBody>
                    </Table>
                </TableContainer>  

             </CardContent>

             <CardActions>
                <div/>
               <Button size="small" sx={{ marginLeft: "auto" }} onClick={()=>{Navigate('/logs')}} >View all</Button>
             </CardActions>
        </React.Fragment>
    );
    
    // Rendering the Total Records
    const recordsOverview = (
        <React.Fragment>
            <CardContent>
                <Typography variant="h3">
                    {totalRecords}
                </Typography>
                <Typography sx={{ fontSize: 14 }} >
                    total records
                </Typography>
            </CardContent>
        </React.Fragment>
    );

    // Rendering the Total VERIFIED Records
    const verifiedOverview = (
        <React.Fragment>
            <CardContent>
                <Typography variant="h3">
                    {verifiedRecords}
                </Typography>
                <Typography sx={{ fontSize: 14 }} >
                    verified records
                </Typography>
            </CardContent>
        </React.Fragment>
    );
    
    // Renders a loading icon 
    // while waiting for data to get fetched
    if (gotFetched === undefined || logsArray === undefined || verifiedRecords === undefined ) {
        return (
            <LoadingPage />
        );
    }
    
    return (
        <div>
            <HomeShackerToolbar/>

            {/* Section Header */}
            <Container maxWidth="xl">
                <Typography variant="h4" marginTop="40px" marginBottom="20px">
                    Recent Changes
                </Typography>
            </Container>
            {/* Recent Changes */}
            <Container maxWidth="xl">
                <Card variant="outlined">{recentChanges}</Card>
            </Container>

            {/* Section Header */}
            <Container maxWidth="xl">
                <Typography variant="h4" marginTop="40px" marginBottom="20px">
                    Overview
                </Typography>
            </Container>
            
            {/* Records Overview and Verified Overview */}
            <Container maxWidth="xl">
                <Grid container spacing={10} justifyContent="center">
                    <Grid item>
                        <Card variant="outlined" sx={{ minWidth: 700 }}>{recordsOverview}</Card>
                    </Grid>
                    <Grid item>
                        <Card variant="outlined" sx={{ minWidth: 700 }}>{verifiedOverview}</Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default Homepage;
