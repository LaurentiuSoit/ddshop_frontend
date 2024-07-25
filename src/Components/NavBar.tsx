import React, {useEffect, useState} from 'react';
import {Box, Button} from '@mui/material';
import './NavBar.css'
import {ArrowBackIosNew} from "@mui/icons-material";

interface CategoryDTO {
    id: number;
    name: string;
    description: string;
}

const NavBar: React.FC = () => {

    const [categoryList, setCategoryList] = useState<CategoryDTO[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/category/getAll');
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
                <Button className="category-button" key={category.id}>
                    {category.name}
                    <div className="arrow-div">
                        <ArrowBackIosNew/>
                    </div>
                </Button>
            ))}
        </Box>
    );
};

export default NavBar;
