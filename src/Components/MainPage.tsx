import React, {ChangeEvent, useEffect, useState} from 'react';
import {ProductDTO} from "./Types/ProductDTO";
import ProductList from "./ProductList";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import "./MainPage.css"

const MainPage: React.FC = () => {
    const [productList, setProductList] = useState<ProductDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>('newest');

    const handleSortSelection = (event: SelectChangeEvent<string>) => {
        setSortBy(event.target.value as string);
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:8080/product/getAll?sortBy=${sortBy}`);
                if (!response.ok) {
                    throw new Error('Could not get products.');
                }
                const data: ProductDTO[] = await response.json();
                setProductList(data);
            } catch (error: any) {
                setError(error.message);
            }
        };
        fetchProducts();
    }, [sortBy]);

    return (
        <div>
            <FormControl className="form-control">
                <Select
                    className="select"
                    value={sortBy}
                    onChange={handleSortSelection}
                >
                    <MenuItem className="menu-item" value={"newest"}>Sort By Newest</MenuItem>
                    <MenuItem className="menu-item" value={"priceasc"}>Sort By Price Ascending</MenuItem>
                    <MenuItem className="menu-item" value={"pricedesc"}>Sort By Price Descending</MenuItem>
                </Select>
            </FormControl>
            <ProductList products={productList}/>
        </div>
    );
}

export default MainPage;