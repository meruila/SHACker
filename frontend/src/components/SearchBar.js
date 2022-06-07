import React from "react";

import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Paper from "@mui/material/Paper"

import SearchIcon from '@mui/icons-material/Search';

/**
 * SearchBar Component
 * Used in:
 *      Logs
 *      Student Record (view)
 *      Manage Users
 */

function SearchBar(){
    return(
        <div>
            <Paper component="form" sx={{ width: '250px'}}>
                <InputBase
                    sx={{ ml: 2, flex: 3 }}
                    placeholder="Search..."
                />
                <IconButton>
                    <SearchIcon />
                </IconButton>
            </Paper>
        </div>
    );
}

export default SearchBar;