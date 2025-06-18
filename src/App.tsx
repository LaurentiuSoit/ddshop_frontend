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
import {Box, Button, Card, CardContent, Divider, Drawer, Fab, IconButton, TextField, Typography} from "@mui/material";
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
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import {MessageDTO} from "./Components/Types/MessageDTO";

function App() {

    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(localStorage.getItem("logged-in") === "true");
    const [entryList, setEntryList] = useState<CartEntryDTO[]>([]);
    const [productList, setProductList] = useState<ProductDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
    const [messages, setMessages] = useState<MessageDTO[]>([]);
    const [input, setInput] = useState("");
    const navigate = useNavigate();


    const handleMyCartClick = () => {
        openDrawer();
        navigate("/cart");
    }

    const fetchProductById = async (id: number): Promise<ProductDTO> => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/product/get/${id}`);

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

    const handleOpenChat = () => {
        setIsChatOpen(true);

        if (!hasOpenedOnce) {
            const welcomeMessage: MessageDTO = {
                sender: "bot",
                text: "Hi there! How can I assist you today?",
            };
            setMessages((prev) => [...prev, welcomeMessage]);
            setHasOpenedOnce(true);
        }
    };


    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: MessageDTO = {sender: "user", text: input};
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/chat/ask`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({input}),
            });

            const botText = await response.text();
            const botMessage: MessageDTO = {sender: "bot", text: botText};
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Failed to fetch chat response:", error);
            setMessages((prev) => [
                ...prev,
                {sender: "bot", text: "Sorry, something went wrong."},
            ]);
        }
    };


    const openDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
        if (!isDrawerOpen) {
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
            {!isChatOpen && (
                <div className="chat-float-button">
                    <Fab color="primary" onClick={handleOpenChat}>
                        <ChatIcon/>
                    </Fab>
                </div>
            )}

            {isChatOpen && (
                <Card className="chat-card">
                    <div className="chat-header">
                        <Typography variant="h6">AI Assistant</Typography>
                        <IconButton onClick={() => setIsChatOpen(false)}>
                            <CloseIcon/>
                        </IconButton>
                    </div>

                    <CardContent className="chat-content">
                        {messages.map((msg, idx) => (
                            <Box
                                key={idx}
                                className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
                            >
                                {msg.text}
                            </Box>
                        ))}
                    </CardContent>

                    <div className="chat-input">
                        <TextField
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            fullWidth
                            size="small"
                            placeholder="Type your message..."
                        />
                        <IconButton color="primary" onClick={handleSend}>
                            <SendIcon/>
                        </IconButton>
                    </div>
                </Card>
            )}
            {!isChatOpen && (
                <Fab className={`floating-cart ${isDrawerOpen ? 'floating-cart-open' : ''}`}
                     onClick={openDrawer}>
                    <ShoppingCart className="cart-icon"/>
                </Fab>
            )}
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
