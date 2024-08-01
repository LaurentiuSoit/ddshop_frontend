import React, {useEffect, useState} from 'react'
import {ProductDTO} from "./Types/ProductDTO";
import ProductList from "./ProductList";
import {useParams} from "react-router-dom";
import {CategoryDTO} from "./Types/CategoryDTO";

const Category: React.FC = () => {

    const [productList, setProductList] = useState<ProductDTO[]>([]);
    const [category, setCategory] = useState<CategoryDTO>({
        id: 0,
        name: '',
        description: ''
    })
    const [error, setError] = useState<string | null>(null);

    const {categoryId} = useParams();

    useEffect(() => {
        const fetchProducts = async () => {
            if (!categoryId) {
                return;
            }
            try {
                const response = await fetch(`http://localhost:8080/product/getByCategory?categoryId=${categoryId}`);
                if (!response.ok) {
                    throw new Error('Could not get products.');
                }
                const data: ProductDTO[] = await response.json();
                setProductList(data);
            } catch (error: any) {
                setError(error.message);
            }
        };
        const fetchCategory = async () => {
            if (!categoryId) {
                return;
            }
            try {
                const response = await fetch(`http://localhost:8080/category/get/${categoryId}`);
                if (!response.ok) {
                    throw new Error('Could not get category.');
                }
                const data: CategoryDTO = await response.json();
                setCategory(data);
            } catch (error: any) {
                setError(error.message);
            }
        }
        fetchProducts();
        fetchCategory();
    }, [categoryId]);

    return (
        <div>
            <header className="my-account-header">
                <picture className="header-image">
                    <img src="https://www.kultofathena.com/wp-content/uploads/2021/03/weapons_page_title_bar.jpg"/>
                </picture>
                <h1 className="my-account-text">
                    {category.name}
                </h1>
            </header>
            <ProductList products={productList}/>
        </div>
    );
}

export default Category;