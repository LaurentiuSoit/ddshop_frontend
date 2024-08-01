import React from 'react'
import {Button} from '@mui/material';
import './AccountCart.css'
import {Link} from "react-router-dom";

const AccountCart: React.FC = () => {

    return (
        <div className="account-cart-box">
            <Link to="/my-account">
                <Button
                    className="account-button"
                >
                    <u><b>MyAccount</b></u>
                </Button>
            </Link>
            <Link to="/cart">
                <Button className="cart-button">
                    <u><b>Cart</b></u>
                </Button>
            </Link>
        </div>

    )
}

export default AccountCart;