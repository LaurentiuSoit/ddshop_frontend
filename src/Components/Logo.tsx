import React from 'react';
import image from '../koa_logo_w-300x75-1.png'
import './Logo.css'

const Logo: React.FC = () => {
    return (
            <img className = "logo-image" src={image}></img>
    );
};

export default Logo;