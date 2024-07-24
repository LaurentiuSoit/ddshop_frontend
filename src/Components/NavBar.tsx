import React, {useState} from 'react';
import {Box, Button} from '@mui/material';
import './NavBar.css'
import {ArrowBackIosNew} from "@mui/icons-material";

const categories: string[] = ['Swords', 'Weapons', 'Armor', 'Shields', 'Clothing', 'Accessories',
    ' LARP Weapons & Gear', 'Sport Combat', 'Cultures', 'Brand', 'Sale'];

const elementsToHide: number = 3;

const NavBar: React.FC = () => {
    return (
        <Box className="box">
            {categories.map((category, index) => (
                <Button className="category-button">
                    {category}
                    {index < categories.length - elementsToHide && (
                        <div className="arrow-div">
                            <ArrowBackIosNew/>
                        </div>
                    )}
                </Button>
            ))}

        </Box>
    );
};

export default NavBar;
