import React, {useEffect, useState} from 'react';
import './App.css';
import NavBar from "./Components/NavBar";
import Logo from "./Components/Logo";
import SearchBar from "./Components/SearchBar";
import AccountCart from "./Components/AccountCart";
import {Routes, Route, useLocation} from "react-router-dom";
import MainPage from "./Components/MainPage";
import Category from "./Components/Category";
import SignUpForm from "./Components/SignUpForm";
import Cart from "./Components/Cart";
import {Box, Divider, Drawer, Fab} from "@mui/material";
import {ShoppingCart} from "@mui/icons-material";
import Account from "./Components/Account";

function App() {

    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(localStorage.getItem("logged-in") === "true");
    const location = useLocation();
    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem("logged-in") === "true");
    }, [location]);

    return (
        <div className="app">
            <header className="header">
                <div className="color-bar">
                    <b>The largest collection of swords, weapons and more from the Bronze Age to World War II</b>
                </div>
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
                 onClick={toggleDrawer}>
                <ShoppingCart className="cart-icon"/>
            </Fab>
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={toggleDrawer}
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
                </Box>
            </Drawer>
            <Routes>
                <Route path="/"
                       element={<MainPage/>}/>
                <Route path="/category/:categoryId"
                       element={<Category/>}/>
                <Route path="/my-account"
                       element={isLoggedIn ? <Account/> : <SignUpForm setIsLoggedIn={setIsLoggedIn}/>}/>
                <Route path="/cart"
                       element={<Cart/>}/>
            </Routes>
        </div>
    );
}

export default App;
