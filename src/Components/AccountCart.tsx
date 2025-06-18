import React from 'react'
import {Button} from '@mui/material';
import './AccountCart.css'
import {Link, useNavigate} from "react-router-dom";

const AccountCart: React.FC<{ setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }> = ({setIsLoggedIn}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.setItem("logged-in", "false");
        setIsLoggedIn(false);
        localStorage.removeItem("user-id");
        localStorage.removeItem("cart-id");
        navigate('/');
        window.location.reload();
    };

    return (
        <div className="account-cart-box">
            <div className="account-div">
                <Link to="/my-account">
                    <Button
                        className="account-button"
                    >
                        <u><b>My Account</b></u>
                    </Button>
                </Link>
                <div className="account-menu">
                    <div>
                        <Link to="/my-account">Dashboard</Link>
                    </div>
                    <div>
                        <Link to="/orders">Orders</Link>
                    </div>
                    {localStorage.getItem("logged-in") === "true" &&
                        <div>
                            <Link to="/"
                                  onClick={handleLogout}
                            >
                                Logout
                            </Link>
                        </div>
                    }
                </div>
            </div>
            <Link to="/cart">
                <Button className="cart-button">
                    <u><b>Cart</b></u>
                </Button>
            </Link>
        </div>
    )
}

export default AccountCart;