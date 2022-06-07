import ShackerToolbar from '../../components/ShackerToolbar';

import React from 'react'
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import UploadButton from '../../components/UploadButton';

/**
 * Component for View Student Records
 * 
 */
  

function UploadStudentRecord() {
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
                           Upload Student Records
                        </Typography>
                    </Box>
                    {/*List of all uploaded files*/}
                    <Box>
                        <UploadButton />
                    </Box>

                    
                </Stack>
            </Container>
        </div>                       
    )
}

export default UploadStudentRecord;