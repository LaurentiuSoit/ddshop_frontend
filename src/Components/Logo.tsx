import React from 'react';
import {Link} from 'react-router-dom';
import './Logo.css'

const Logo: React.FC = () => {
    return (
        <Link to="/">
            <img className="site-logo" src='/site-logo.png'></img>
        </Link>
    );
};

export default Logo;