import React from 'react';
import {Link} from 'react-router-dom';
import image from '../koa_logo_w-300x75-1.png'

const Logo: React.FC = () => {
    return (
        <Link to="/">
            <img src={image}></img>
        </Link>
    );
};

export default Logo;