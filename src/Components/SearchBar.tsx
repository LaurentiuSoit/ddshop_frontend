import React from 'react'
import {TextField, IconButton, InputAdornment} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import './SearchBar.css'

const SearchBar: React.FC = () => {
    return (
        <TextField
            className="search-bar"
            variant="outlined"
            placeholder="Search for products..."
            fullWidth
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <IconButton className="icon-button">
                            <SearchIcon className="search-icon"/>
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    );
};

export default SearchBar;