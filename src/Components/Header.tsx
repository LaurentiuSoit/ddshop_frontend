import React from 'react';
import "./Header.css"

const Header: React.FC<{ headerText: String }> = ({headerText}) => {
    return (
        <header className="page-header">
            <picture className="header-image">
                <img src="/header-image.jpg"/>
            </picture>
            <h1 className="page-header-text">
                {headerText}
            </h1>
        </header>
    )
}

export default Header;