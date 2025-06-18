import React, {useEffect, useState} from "react";
import AccountInfoCard from "./AccountInfoCard";
import {Link, useNavigate} from "react-router-dom";
import {fetchCart, fetchProductById, productImage} from "../Utils/Utilities";
import {CartEntryDTO} from "./Types/CartEntryDTO";
import {ProductDTO} from "./Types/ProductDTO";
import {CartDTO} from "./Types/CartDTO";
import "./Order.css"
import Header from "./Header";

const Order: React.FC<{ setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }> = ({setIsLoggedIn}) => {
    const [cart, setCart] = useState<CartDTO>({
        id: 0,
        cartEntryIdList: [],
        shopUserId: 0,
        totalPrice: 0
    })
    const [entryList, setEntryList] = useState<CartEntryDTO[]>([]);
    const [productList, setProductList] = useState<ProductDTO[]>([]);

    useEffect(() => {

        const fetchEntries = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cartEntry/get/${localStorage.getItem("cart-id")}`);
                if (!response.ok) {
                    throw new Error('Could not get cart entries.');
                }
                const data: CartEntryDTO[] = await response.json();

                const productsPromises = data.map(entry => fetchProductById(entry.productId));
                const products = await Promise.all(productsPromises);
                setEntryList(data);
                setProductList(products);
            } catch (error: any) {
                console.log(error.message);
            }
        }
        fetchCart().then(fetchedCart => {
            setCart(fetchedCart)
        });
        fetchEntries();
    }, [])
    return (
        <div>
            <Header headerText="Order"/>
            <div className="order-content">
                <div className="order-entries-div">
                    {entryList.map(entry => {
                        const product = productList.find(product => product.id === entry.productId);
                        return (
                            <div key={entry.id} className="order-page-entry-div">
                                <div className="order-page-entry-image-div">
                                    <Link to={`/product/${product ? product.id : ''}`}>
                                        <img className="order-page-entry-image"
                                             src={product ? productImage(product.name) : ""}
                                             alt="description"
                                        />
                                    </Link>
                                </div>
                                <div className="order-page-entry-div-text">
                                    <br/>Name: {product ? product.name : 'Loading...'}
                                    <br/>Quantity: {entry.quantity}
                                    <br/>Total Price: ${entry.totalPricePerEntry}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="order-page-options">
                    <h1><u>Total: ${cart.totalPrice}</u></h1>
                    <AccountInfoCard setIsLoggedIn={setIsLoggedIn} totalPrice={cart.totalPrice}/>
                </div>
            </div>
        </div>
    )
}

export default Order;