import React from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

/**
 * Component for HandleScroll
 * Page scrolls down to the bottom upon click
 */
function HandleScrollTop() {
    const scroll = () => {
        window.scroll({
            top: 0,
            left: 0, 
            behavior: 'smooth',
        });
    }

    return (
        <Tooltip title="Scroll to Top">
            <Button variant="outlined" onClick={scroll}>
                SCROLL TO TOP
            </Button>
        </Tooltip>
    );
}

export default HandleScrollTop;