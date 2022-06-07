import React from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Tooltip, Box, Button } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Cookies from "universal-cookie";
import { UserContext } from "../../contexts/UserContext";
  

/**
 * Template for Quick Access Buttons in SHACker Toolbar
 * @returns Quick Access Buttons Component for SHACKerToolbar
 */

function QuickAccessButtons() {

    const { setUser } = React.useContext(UserContext);
    const Navigate = useNavigate();

    const logOut = () => (e) => {
        e.preventDefault();

        // Delete cookie with authToken
        const cookies = new Cookies();
            
        localStorage.removeItem('isAuthenticated');

        cookies.remove('authToken', { path: '/admin' });
        cookies.remove('authToken', { path: '/' });
                    
        // Clearing localstorage
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.clear();
        window.localStorage.clear()
        window.location.reload(true)
    }
    return (
        <Box sx={{
            display: 'flex',
            flexWrap: 'nowrap',
          }}>
            <Tooltip title="Student Records">
                <IconButton onClick={() => Navigate('/student-records')}>
                    <ArticleIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Summary">
                <IconButton onClick={() => Navigate('/summary')}>
                    <SummarizeIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Logs">
                <IconButton onClick={() => Navigate('/logs')}>
                    <ReceiptLongIcon/>
                </IconButton>
            </Tooltip>
            
            <Button variant="outlined" onClick={logOut()}>
                SIGN OUT
            </Button>
        </Box>
    )
}

export default QuickAccessButtons;