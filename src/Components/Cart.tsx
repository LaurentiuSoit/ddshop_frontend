import React from 'react'
import "./Cart.css"


const Cart: React.FC = () => {
    return (
        <div>
            <header className="my-account-header">
                <picture className="header-image">
                    <img src="https://www.kultofathena.com/wp-content/uploads/2021/03/weapons_page_title_bar.jpg"/>
                </picture>
                <h1 className="my-account-text">
                    Cart
                </h1>
            </header>
        </div>
    );
}

export default Cart;