import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// const green = "#0D542F";

/**
 * Component for Loading Icon for Pages
 * @returns CircularProgress Icon while fetching for Page Data
 */
function LoadingPage() {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '800px'}}>
            <CircularProgress color="success" size={150} />
        </Box>
    );
  }

  export default LoadingPage;