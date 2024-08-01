import React, {useState} from 'react';
import './App.css';
import NavBar from "./Components/NavBar";
import Logo from "./Components/Logo";
import SearchBar from "./Components/SearchBar";
import AccountCart from "./Components/AccountCart";
import {Routes, Route} from "react-router-dom";
import MainPage from "./Components/MainPage";
import Category from "./Components/Category";
import SignUpForm from "./Components/SignUpForm";
import Cart from "./Components/Cart";
import {Box, Button, Drawer, Fab, Typography} from "@mui/material";
import {ShoppingCart} from "@mui/icons-material";

function App() {

    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

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
                        <AccountCart/>
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
                    onClick={toggleDrawer}
                    onKeyDown={toggleDrawer}
                >
                </Box>
            </Drawer>
            <Routes>
                <Route path="/"
                       element={<MainPage/>}/>
                <Route path="/category/:categoryId"
                       element={<Category/>}/>
                <Route path="/my-account"
                       element={<SignUpForm/>}/>
                <Route path="/cart"
                       element={<Cart/>}/>
            </Routes>
        </div>
    );
}

export default App;
