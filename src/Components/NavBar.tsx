import React, {useState} from 'react';
import {Box, Button} from '@mui/material';
import './NavBar.css'
import {ArrowBackIosNew} from "@mui/icons-material";

const NavBar: React.FC = () => {

    const categories: string[] = ['Swords', 'Weapons', 'Armor', 'Shields', 'Clothing', 'Accessories',
                                    ' LARP Weapons & Gear', 'Sport Combat'];

    return (
        <Box className="Box">
            {categories.map((category, index) => (
                <Button
                    className="Button"
                >
                    {category}
                    <div className="arrow-div">
                        <ArrowBackIosNew/>
                    </div>
                </Button>
            ))}

        </Box>
    );
};

export default NavBar;
