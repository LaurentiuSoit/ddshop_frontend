import React from 'react';
import "./Account.css"
import AccountInfoCard from "./AccountInfoCard";

const Account: React.FC<{ setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }> = ({setIsLoggedIn}) => {

    return (
        <div>
            <header className="my-account-header">
                <picture className="header-image">
                    <img src="https://www.kultofathena.com/wp-content/uploads/2021/03/weapons_page_title_bar.jpg"/>
                </picture>
                <h1 className="my-account-text">
                    My Account
                </h1>
            </header>
            <AccountInfoCard setIsLoggedIn={setIsLoggedIn} isAccount={true}/>
        </div>
    )
}

export default Account;