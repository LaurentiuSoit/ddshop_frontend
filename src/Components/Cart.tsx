import React, {useEffect, useState} from 'react'
import "./Cart.css"
import {CartEntryDTO} from "./Types/CartEntryDTO";
import {ProductDTO} from "./Types/ProductDTO";
import {Link, useNavigate} from "react-router-dom";
import {Button, TextField} from "@mui/material";
import {CartDTO} from "./Types/CartDTO";
import {fetchCart, fetchProductById, productImage} from "../Utils/Utilities";

const Cart: React.FC = () => {

    const [cart, setCart] = useState<CartDTO>({
        id: 0,
        cartEntryIdList: [],
        shopUserId: 0,
        totalPrice: 0
    })
    const [entryList, setEntryList] = useState<CartEntryDTO[]>([]);
    const [productList, setProductList] = useState<ProductDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleQtyChange = async (e: React.ChangeEvent<HTMLInputElement>, entryId: number) => {
        const newQuantity: number = Number(e.target.value);

        try {
            const response = await fetch(`http://localhost:8080/cartEntry/update?entryId=${entryId}&cartId=${localStorage.getItem("cart-id")}&newQuantity=${newQuantity}`, {
                method: 'PUT'
            });
            if (!response.ok) {
                throw new Error('Could not update quantity.');
            }

            const updatedEntries: CartEntryDTO[] = await response.json();
            setEntryList(updatedEntries);
        } catch (error: any) {
            setError(error.message);
        }
        fetchCart();
    };

    const handleRemove = async (entryId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/cartEntry/delete?entryId=${entryId}&cartId=${localStorage.getItem("cart-id")}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Could not get cart entries.');
            }
            const updatedEntries: CartEntryDTO[] = await response.json();
            setEntryList(updatedEntries);
        } catch (error: any) {
            setError(error.message);
        }
    }

    const fetchEntries = async () => {
        try {
            const response = await fetch(`http://localhost:8080/cartEntry/get/${localStorage.getItem("cart-id")}`);
            if (!response.ok) {
                throw new Error('Could not get cart entries.');
            }
            const data: CartEntryDTO[] = await response.json();

            const productsPromises = data.map(entry => fetchProductById(entry.productId));
            const products = await Promise.all(productsPromises);
            setEntryList(data);
            setProductList(products);
        } catch (error: any) {
            setError(error.message);
        }
    }

    useEffect(() => {
        fetchCart().then(fetchedCart => {
            setCart(fetchedCart)
        });
        fetchEntries();
    }, []);

    return (
        <div>
            <header className="my-account-header">
                <picture className="header-image">
                    <img src="https://www.kultofathena.com/wp-content/uploads/2021/03/weapons_page_title_bar.jpg"/>
                </picture>
                <h1 className="my-account-text">
                    Cart
                </h1>
            </header>
            <div className="cart-content">
                <div className="cart-entries-div">
                    {entryList.map(entry => {
                        const product = productList.find(product => product.id === entry.productId);
                        return (
                            <div key={entry.id} className="cart-page-entry-div">
                                <div className="cart-page-entry-image-div">
                                    <Link to={`/product/${product ? product.id : ''}`}>
                                        <img className="cart-page-entry-image"
                                             src={product ? productImage(product.name) : ""}
                                             alt="description"
                                        />
                                    </Link>
                                </div>
                                <div className="cart-page-entry-div-text">
                                    <br/>Name: {product ? product.name : 'Loading...'}
                                    <br/>Quantity: {entry.quantity}
                                    <br/>Total Price: ${entry.totalPricePerEntry}
                                </div>
                                <div className="cart-page-quantity-div">
                                    Qty
                                    &emsp;
                                    <TextField
                                        className="quantity-select"
                                        variant="outlined"
                                        required
                                        type="number"
                                        defaultValue={entry.quantity}
                                        onChange={(e) => handleQtyChange(e as React.ChangeEvent<HTMLInputElement>, entry.id)}
                                    />
                                </div>
                                &emsp;
                                <Button
                                    className="remove-button"
                                    variant="text"
                                    size="large"
                                    onClick={() => handleRemove(entry.id)}
                                >
                                    <b>Remove</b>
                                </Button>
                            </div>
                        );
                    })}
                </div>
                <div className="cart-page-options">
                    <h1><u>Total: ${cart.totalPrice}</u></h1>
                    <Button
                        className="order-button"
                        variant="contained"
                        size="large"
                        onClick={() => navigate("/order")}
                    >
                        <b>Order</b>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Cart;