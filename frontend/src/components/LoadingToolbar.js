import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

/**
 * Component for Loading Icon for Toolbar
 * @returns CircularProgress Icon while fetching for Toolbar
 */

function LoadingToolbar() {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center'}} paddingTop="30px" paddingLeft="30px">
            <CircularProgress color="inherit" />
        </Box>
    );
  }

  export default LoadingToolbar;