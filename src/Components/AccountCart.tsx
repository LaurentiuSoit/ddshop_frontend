import React from 'react'
import {Button} from '@mui/material';
import './AccountCart.css'

const AccountCart: React.FC = () => {
    return (
        <div className="account-cart-box">
            <Button className="account-button">
                <u><b>MyAccount</b></u>
            </Button>
            <Button className="cart-button">
                <u><b>Cart</b></u>
            </Button>
        </div>
    )
}

export default AccountCart;