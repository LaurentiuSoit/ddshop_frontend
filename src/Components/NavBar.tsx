import React, {useEffect, useState} from 'react';
import {Box, Button} from '@mui/material';
import './NavBar.css'
import {ArrowBackIosNew} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {CategoryDTO} from "./Types/CategoryDTO";

const NavBar: React.FC = () => {

    const [categoryList, setCategoryList] = useState<CategoryDTO[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/category/getAll`);
                if (!response.ok) {
                    throw new Error('Could not get categories.');
                }
                const data: CategoryDTO[] = await response.json();
                setCategoryList(data);
            } catch (error: any) {
                setError(error.message);
            }
        };
        fetchCategories();
    }, []);

    return (
        <Box className="box">
            {categoryList.map(category => (
                <Link key={category.id} to={`/category/${category.id}`}>
                    <Button className="category-button" key={category.id}>
                        {category.name}
                    </Button>
                </Link>
            ))}
        </Box>
    );
};

export default NavBar;
