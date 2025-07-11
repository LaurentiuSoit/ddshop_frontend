import React, {useEffect, useState} from 'react'
import {ProductDTO} from "./Types/ProductDTO";
import {Link, useParams} from "react-router-dom";
import "./Product.css"
import {Button, Divider, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import {CategoryDTO} from "./Types/CategoryDTO";
import {AttributeDTO} from "./Types/AttributeDTO";
import {productImage} from "../Utils/Utilities";

const Product: React.FC = () => {

    const [quantity, setQuantity] = useState<number>(1);
    const [isInStock, setIsInStock] = useState<boolean>(false);
    const [added, setAdded] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
    const [product, setProduct] = useState<ProductDTO>({
        id: 0,
        name: "",
        price: 0,
        addedDate: "",
        availableQuantity: 0,
        categoryId: 0,
        description: "",
        validAttributeIdList: []
    })
    const [category, setCategory] = useState<CategoryDTO>({
        id: 0,
        name: '',
        description: ''
    })
    const [attributeList, setAttributeList] = useState<AttributeDTO[]>([]);

    const [error, setError] = useState<string | null>(null);

    const {productId} = useParams();

    const handleQtyChange = (e: SelectChangeEvent<number>) => {
        if (Number(e.target.value) >= 1)
            setQuantity(Number(e.target.value));
    };

    const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (localStorage.getItem("logged-in") === "false") {
            setIsLoggedIn(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cart/add?cartId=${localStorage.getItem("cart-id")}&productId=${productId}&quantity=${quantity}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Could not add product.`);
            }
            setAdded(true);
        } catch (error: any) {
            setError(error.message)
        }
    }

    useEffect(() => {
        const fetchProduct = async (productId: string | undefined) => {
            if (!productId) {
                return;
            }
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/product/get/${productId}`);
                if (!response.ok) {
                    throw new Error('Could not get product.');
                }
                const data: ProductDTO = await response.json();
                setProduct(data);
                if (data.availableQuantity > 0)
                    setIsInStock(true);
            } catch (error: any) {
                setError(error.message);
            }
        }
        fetchProduct(productId);
    }, [productId])

    useEffect(() => {
        const fetchCategory = async () => {
            if (!product.categoryId) {
                return;
            }
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/category/get/${product.categoryId}`);
                if (!response.ok) {
                    throw new Error('Could not get category.');
                }
                const data: CategoryDTO = await response.json();
                setCategory(data);
            } catch (error: any) {
                setError(error.message);
            }
        };
        fetchCategory();
    }, [product.categoryId]);

    useEffect(() => {
        const fetchAttributes = async () => {
            if (!productId) {
                return;
            }
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/product/getAttributes/${productId}`);
                if (!response.ok) {
                    throw new Error('Could not get product attributes.');
                }
                const data: AttributeDTO[] = await response.json();
                setAttributeList(data);
            } catch (error: any) {
                setError(error.message);
            }
        }
        fetchAttributes();
    }, [productId])

    return (
        <div>
            <div className="product-page-header">
                <div className="product-page-header-links">
                    <Link to="/">
                        <HomeIcon className="links-home-icon"/>
                    </Link>
                    &emsp;
                    »
                    &emsp;
                    <Link to={`/category/${category.id}`}>
                        {category.name}
                    </Link>
                    &emsp;
                    »
                    &emsp;
                    {product.name}
                </div>
                <Divider className="product-page-divider"/>
                <div className="product-page-header-elements">
                    <div className="product-header-name">
                        <b>{product.name}</b>
                    </div>
                    <div className="product-header-price">
                        <b>${product.price}</b>
                    </div>
                </div>
            </div>
            <div className="product-page-container">
                <div className="product-container-image-div">
                    <img className="product-page-image"
                         src={productImage(product.name)}/>
                </div>
                <div className="product-details">
                    {!isLoggedIn ?
                        <h2 style={{color: 'darkred'}}>You must be logged in to add products to your cart</h2> :
                        ""}
                    {added ? <h2 style={{color: 'green'}}> Product Added to Cart</h2> :
                        ""}
                    {isInStock ? <h4 style={{color: 'green'}}>In Stock</h4> :
                        <h4 style={{color: 'red'}}>Out of Stock</h4>}
                    {isInStock && (
                        <div className="quantity-div">
                            Qty
                            &emsp;
                            <Select
                                labelId="number-select-label"
                                value={quantity}
                                label="Number"
                                onChange={handleQtyChange}
                                variant="outlined">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                    <MenuItem key={num} value={num}>
                                        {num}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                    )}
                    &emsp;
                    <Button
                        className="add-to-cart-button"
                        name="availableQuantity"
                        variant="contained"
                        size="large"
                        disabled={!isInStock}
                        onClick={handleAddToCart}
                    >
                        <b>Add to Cart</b>
                    </Button>
                    <div>
                        <h2><u>Description</u></h2>
                        {product.description}
                    </div>
                    <div className="specifications">
                        <h2><u>Specifications</u></h2>
                        {attributeList.map(attribute => (
                            <p key={`${attribute.name}-${attribute.value}`}>
                                {attribute.name} : {attribute.value}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Product;