import React, {useEffect, useState} from 'react'
import {ShopOrderDTO} from "./Types/ShopOrderDTO";
import "./OrderHistory.css"
import {AddressDTO} from "./Types/AddressDTO";

const OrderHistory: React.FC = () => {
    const [addressList, setAddressList] = useState<AddressDTO[]>([]);
    const [orderList, setOrderList] = useState<ShopOrderDTO[]>([]);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await fetch("http://localhost:8080/address/getAll");
                if (!response.ok) {
                    throw new Error("Could not fetch addresses.");
                }
                const data: AddressDTO[] = await response.json();
                setAddressList(data);
            } catch (error: any) {
                console.log(error.message);
            }
        }
        const fetchOrderHistory = async () => {
            try {
                const response = await fetch(`http://localhost:8080/order/get/${localStorage.getItem("user-id")}`);
                if (!response.ok) {
                    throw new Error('Could not get order history.');
                }
                const data: ShopOrderDTO[] = await response.json();
                setOrderList(data);
            } catch (error: any) {
                console.log(error.message);
            }
        };
        fetchAddresses();
        fetchOrderHistory();
    }, [])

    return (
        <div>
            <header className="my-account-header">
                <picture className="header-image">
                    <img src="https://www.kultofathena.com/wp-content/uploads/2021/03/weapons_page_title_bar.jpg"/>
                </picture>
                <h1 className="my-account-text">
                    Order History
                </h1>
            </header>
            <div className="order-history-div">
                {orderList.map(order => {
                    const deliveryAddress = addressList.find(address => address.id === order.deliveryAddressId)
                    const billingAddress = addressList.find(address => address.id === order.invoiceAddressId)
                    return (
                        <div key={order.id} className="order-history-entry-div">
                            <>
                                Total Price: ${order.totalPrice}
                                <br/>
                                Payment Type : {order.paymentType}
                                <br/>
                                Delivery Address
                                : {deliveryAddress ? `${deliveryAddress.streetLine}, ${deliveryAddress.city}, ${deliveryAddress.postalCode}, ${deliveryAddress.county}, ${deliveryAddress.country}` : "Loading..."}
                                <br/>
                                Billing Address
                                : {billingAddress ? `${billingAddress.streetLine}, ${billingAddress.city}, ${billingAddress.postalCode}, ${billingAddress.county}, ${billingAddress.country}` : "Loading..."}
                                <br/>
                                Order Date : {order.orderDate}
                            </>
                        </div>
                    )

                })}
            </div>
        </div>
    )
}

export default OrderHistory;