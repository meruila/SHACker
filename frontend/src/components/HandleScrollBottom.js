import React from 'react';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

/**
 * Component for HandleScroll
 * Page scrolls down to the bottom upon click
 */
function HandleScrollBottom() {
    const scroll = () => {
        window.scroll({
            top: document.body.offsetHeight,
            left: 0, 
            behavior: 'smooth',
        });
    }

    return (
        <Tooltip title="Scroll to Bottom">
            <Button variant="outlined" onClick={scroll}>
                SCROLL TO BOTTOM
            </Button>
        </Tooltip>
    );
} 

export default HandleScrollBottom;