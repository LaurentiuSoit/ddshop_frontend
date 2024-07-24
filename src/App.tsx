import React from 'react';
import './App.css';
import NavBar from "./Components/NavBar";
import Logo from "./Components/Logo";
import SearchBar from "./Components/SearchBar";
import AccountCart from "./Components/AccountCart";

function App() {
    return (
        <div className="app">
            <header className="header">
                <div className="color-bar">
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
        </div>
    );
}

export default App;
