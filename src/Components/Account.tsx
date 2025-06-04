import React from 'react';
import AccountInfoCard from "./AccountInfoCard";
import Header from "./Header";

const Account: React.FC<{ setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }> = ({setIsLoggedIn}) => {

    return (
        <div>
            <Header headerText="My Account"/>
            <AccountInfoCard setIsLoggedIn={setIsLoggedIn} isAccount={true}/>
        </div>
    )
}

export default Account;