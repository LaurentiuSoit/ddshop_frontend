import React, {useEffect, useState} from 'react';
import './App.css';
import NavBar from "./Components/NavBar";
import Logo from "./Components/Logo";
import SearchBar from "./Components/SearchBar";
import AccountCart from "./Components/AccountCart";
import {Routes, Route, Link, useNavigate} from "react-router-dom";
import MainPage from "./Components/MainPage";
import Category from "./Components/Category";
import SignUpForm from "./Components/SignUpForm";
import Cart from "./Components/Cart";
import {Box, Button, Divider, Drawer, Fab} from "@mui/material";
import {ShoppingCart} from "@mui/icons-material";
import Account from "./Components/Account";
import Product from "./Components/Product";
import {CartEntryDTO} from "./Components/Types/CartEntryDTO";
import {ProductDTO} from "./Components/Types/ProductDTO";
import Order from "./Components/Order";
import {productImage} from "./Utils/Utilities";
import OrderConfirmation from "./Components/OrderConfirmation";
import ForgotPassword from "./Components/ForgotPassword";
import ChangePassword from "./Components/ChangePassword";
import SearchPage from "./Components/SearchPage";
import OrderHistory from "./Components/OrderHistory";

function App() {

    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(localStorage.getItem("logged-in") === "true");
    const [entryList, setEntryList] = useState<CartEntryDTO[]>([]);
    const [productList, setProductList] = useState<ProductDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleMyCartClick = () => {
        openDrawer();
        navigate("/cart");
    }

    const fetchProductById = async (id: number): Promise<ProductDTO> => {
        try {
            const response = await fetch(`http://localhost:8080/product/get/${id}`);

            if (!response.ok) {
                throw new Error(`Error fetching product with id ${id}: ${response.statusText}`);
            }

            const product: ProductDTO = await response.json();
            return product;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const openDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
        if (!isDrawerOpen) {
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
            };
            fetchEntries();
        }
    };


    useEffect(() => {
        setIsLoggedIn(localStorage.getItem("logged-in") === "true");
    }, []);

    return (
        <div className="app">
            <header className="header">
                <div className="header-wrapper">
                    <div className="top-elements">
                        <Logo/>
                        <div className="search-bar-wrapper">
                            <SearchBar/>
                        </div>
                        <AccountCart setIsLoggedIn={setIsLoggedIn}/>
                    </div>
                    <NavBar/>
                </div>
            </header>
            <Fab className={`floating-cart ${isDrawerOpen ? 'floating-cart-open' : ''}`}
                 onClick={openDrawer}>
                <ShoppingCart className="cart-icon"/>
            </Fab>
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={openDrawer}
            >
                <Box
                    className="drawer-box"
                    role="presentation"
                >
                    <div className="drawer-box-header">
                        <ShoppingCart className="drawer-box-cart"/>
                        <b>Your Cart</b>
                    </div>
                    <Divider className="divider"/>
                    <div className="entry-container">
                        {entryList && entryList.length > 0 ? (
                            entryList.map(entry => {
                                const product = productList.find(product => product.id === entry.productId);
                                return (
                                    <div key={entry.id} className="entry-div">
                                        <div className="entry-image-div">
                                            <Link to={`/product/${product ? product.id : ''}`} onClick={openDrawer}>
                                                <img
                                                    className="entry-image"
                                                    src={product ? productImage(product.name) : ""}
                                                    alt="description"
                                                />
                                            </Link>
                                        </div>
                                        <div className="entry-div-text">
                                            <br/>Name: {product ? product.name : 'Loading...'}
                                            <br/>Quantity: {entry.quantity}
                                            <br/>Total Price: ${entry.totalPricePerEntry}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>Shopping cart is empty.</p>
                        )}
                    </div>
                    <Button
                        className="my-cart-button"
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleMyCartClick}
                    >
                        <b>Go To Cart</b>
                    </Button>
                </Box>
            </Drawer>
            <Routes>
                <Route path="/"
                       element={<MainPage/>}/>
                <Route path="/search"
                       element={<SearchPage/>}/>
                <Route path="/category/:categoryId"
                       element={<Category/>}/>
                <Route path="/product/:productId"
                       element={<Product/>}/>
                <Route path="/my-account"
                       element={isLoggedIn ? <Account setIsLoggedIn={setIsLoggedIn}/> :
                           <SignUpForm setIsLoggedIn={setIsLoggedIn}/>}/>
                <Route path="/cart"
                       element={isLoggedIn ? <Cart/> : <SignUpForm setIsLoggedIn={setIsLoggedIn}/>}/>
                <Route path="/orders"
                       element={isLoggedIn ? <OrderHistory/> : <SignUpForm setIsLoggedIn={setIsLoggedIn}/>}/>
                <Route path="/order"
                       element={<Order setIsLoggedIn={setIsLoggedIn}/>}/>
                <Route path="/order_confirm"
                       element={<OrderConfirmation/>}/>
                <Route path="/forgot_password"
                       element={<ForgotPassword/>}/>
                <Route path="/change_password/:userId"
                       element={<ChangePassword/>}/>
            </Routes>
        </div>
    );
}

export default App;
