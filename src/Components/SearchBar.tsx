import React, {useEffect, useState} from 'react'
import {TextField, IconButton, InputAdornment} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import './SearchBar.css'
import {useLocation, useNavigate} from "react-router-dom";

const SearchBar: React.FC = () => {
    const [searchString, setSearchString] = useState<string>("");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchString(e.target.value);
    }
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = async () => {
        navigate(`/search?searchString=${searchString}`);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        setSearchString("");
    }, [location]);


    return (
        <TextField
            className="search-bar"
            variant="outlined"
            placeholder="Search for products..."
            fullWidth
            value={searchString}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <IconButton className="icon-button"
                                    onClick={handleSearch}>
                            <SearchIcon className="search-icon"/>
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    );
};

export default SearchBar;