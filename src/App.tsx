import React from 'react';
import './App.css';
import NavBar from "./Components/NavBar";
import Logo from "./Components/Logo";
import SearchBar from "./Components/SearchBar";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <div>
                    <Logo/>
                </div>
                <NavBar/>
            </header>
        </div>
    );
}

export default App;
