import React from 'react';
import './App.css';
import NavBar from "./Components/NavBar";
import Logo from "./Components/Logo";
import SearchBar from "./Components/SearchBar";
import AccountCart from "./Components/AccountCart";
import {Routes, Route, Link} from "react-router-dom";

function App() {
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
            <Routes>
                <Route path="/"/>
            </Routes>
        </div>
    );
}

export default App;
