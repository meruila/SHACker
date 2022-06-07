import React from 'react';
import { useNavigate } from "react-router-dom";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';

/**
 * Component for Back button
 * Returns to previous page in history
 * @ Returns Component for Back Button in SHACker Toolbar
 */

function Backbutton () {
    const Navigate = useNavigate();

    return (
        <div>
            <IconButton onClick={() => Navigate(-1)}>
                <ArrowBackIcon />
            </IconButton>
        </div>
    )
}

export default Backbutton;