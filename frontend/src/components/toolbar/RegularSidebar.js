import React, { useContext } from "react";
import { Link } from "react-router-dom";

import Box from '@mui/material/Box';
import { Drawer, IconButton } from "@mui/material";
import { List , Divider, ListItem, ListItemText, Grid, ListItemIcon, Typography, Tooltip } from "@mui/material";

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CircleIcon from '@mui/icons-material/Circle';
import MenuIcon from '@mui/icons-material/Menu';

import Cookies from "universal-cookie";
import { UserContext } from "../../contexts/UserContext";

// Icons for Admin Sidebar
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import InfoIcon from '@mui/icons-material/Info';
import ArticleIcon from '@mui/icons-material/Article';

/**
 * Component for REGULAR Sidebar.
 * Viewable pages for all users: Homepage, Student Records, Logs, About Us, Summary
 * Viewable page for admin user only: Manage Users
 * @returns React component for Sidebar.
 */

function RegularSidebar() {

    const { user, setUser } = useContext(UserContext);

    const [state, setState] = React.useState(false);

    const toggleDrawer = (open) => (e) => {
        setState(open)
    }

    const signOut = () => (e) => {
        e.preventDefault();

        // Delete cookie with authToken
        const cookies = new Cookies();
        
        localStorage.removeItem('isAuthenticated');

        cookies.remove('authToken', { path: '/admin' });
        cookies.remove('authToken', { path: '/' });
                

        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.clear();
        window.localStorage.clear()
        window.location.reload(true)
    }

    
    const listOfLinks = () => (
        <Box
            sx={{width: '300px', margin: '10px'}}
        >
            <List sx={{margin: '0px'}}>
                {/* Dummy regular email address */}
                <ListItem>

                    <ListItemIcon>
                        <Tooltip title="Edit Profile">
                            <IconButton component={Link} to="/edit-profile" >
                                <PersonIcon  />
                            </IconButton>
                        </Tooltip>
                    </ListItemIcon>
                    <Tooltip title="Edit Profile">
                        <Link to="/edit-profile">
                            <ListItemText>{localStorage.getItem('user')}</ListItemText>
                        </Link>
                    </Tooltip>
                    <Tooltip title="Collapse Sidebar">
                        <IconButton onClick={toggleDrawer(false)}><ArrowBackIosNewIcon /></IconButton>
                    </Tooltip>
                </ListItem>
                        
                <Box mb={3}>
                    <Divider />
                </Box>
                <ListItem button component={Link} to="/home">
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Homepage" />
                </ListItem>
                <ListItem button component={Link} to="/student-records">
                    <ListItemIcon>
                        <ArticleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Student Records" />
                </ListItem>
                <ListItem button component={Link} to="/summary">
                    <ListItemIcon>
                        <SummarizeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Summary" />
                </ListItem>
                <ListItem button component={Link} to="/logs">
                    <ListItemIcon>
                        <ReceiptLongIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logs" />
                </ListItem>
                <ListItem button component={Link} to="/about">
                    <ListItemIcon>
                        <InfoIcon />
                    </ListItemIcon>
                    <ListItemText primary="About Us" />
                </ListItem>
                
            </List>
            {/* Footer */}
            <Box sx={{position:'absolute', bottom: 0, margin: 3, width:"1"}}>
                <Box sx={{position:'absolute', bottom: 50, width:"1"}}>
                    <ListItem button component={Link} to="/login" onClick={signOut()}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sign out" />
                    </ListItem>
                </Box>
                <Grid container columnSpacing={1} >
                        <Grid item>
                            <Typography variant="h6" sx={{ 
                            color: '#0D542F',
                            fontWeight: 'bold',
                            fontSize: 20
                            }}>SHACKer 
                            </Typography>
                        </Grid>
                        <Grid item>
                        <Typography variant="h6" sx={{ 
                            color: 'lightgrey',
                            fontSize: 20
                            }}>© 2022 
                            </Typography>
                        </Grid>
                    </Grid>
            </Box>
        </Box>
    )


    return (
        <div>
            <Box m={3} >
                <IconButton onClick={toggleDrawer(true)}>
                    <MenuIcon />
                </IconButton>
            </Box>
            <Drawer
                anchor={'left'}
                open={state}
                onClose={toggleDrawer(false)}
            >
                {listOfLinks()}
            </Drawer>
        </div>
    );
}

export default RegularSidebar;
