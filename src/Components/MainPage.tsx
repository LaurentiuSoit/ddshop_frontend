import React, {useEffect, useState} from 'react';
import {ProductDTO} from "./Types/ProductDTO";
import ProductList from "./ProductList";

const MainPage: React.FC = () => {
    const [productList, setProductList] = useState<ProductDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>('newest');

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
    }, []);

    return (
        <ProductList products={productList}/>
    );
}

export default MainPage;