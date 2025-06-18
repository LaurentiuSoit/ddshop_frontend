import React, {Fragment, useEffect, useState} from 'react'
import {ShopOrderDTO} from "./Types/ShopOrderDTO";
import "./OrderHistory.css"
import {AddressDTO} from "./Types/AddressDTO";
import Header from "./Header";
import {fetchProductById} from "../Utils/Utilities";

const OrderHistory: React.FC = () => {
    const [addressList, setAddressList] = useState<AddressDTO[]>([]);
    const [orderList, setOrderList] = useState<ShopOrderDTO[]>([]);
    const [productsMap, setProductsMap] = useState<Record<number, string>>({});

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/address/getAll`);
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
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/order/get/${localStorage.getItem("user-id")}`);
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

    useEffect(() => {
        const fetchAllProducts = async () => {
            const productIds = Array.from(
                new Set(orderList.flatMap(order => order.orderEntries.map(entry => entry.productId)))
            );

            const productsEntries = await Promise.all(
                productIds.map(async (id) => {
                    try {
                        const product = await fetchProductById(id);
                        return [id, product.name]; // Assuming ProductDTO has 'name'
                    } catch {
                        return [id, "Unknown Product"];
                    }
                })
            );

            setProductsMap(Object.fromEntries(productsEntries));
        };

        fetchAllProducts();
    }, [orderList]);

    return (
        <div>
            <Header headerText="Order History"/>
            <div className="order-history-div">
                {orderList.map(order => {
                    const deliveryAddress = addressList.find(address => address.id === order.deliveryAddressId)
                    const billingAddress = addressList.find(address => address.id === order.invoiceAddressId)
                    order.orderEntries.forEach(entry => {
                        console.log(entry.productId)
                    })
                    return (
                        <div key={order.id} className="order-history-entry-div">
                            <>
                                Total Price: ${order.totalPrice}
                                <br/>
                                Payment Type : {order.paymentType}
                                <br/>
                                Product List :
                                {order.orderEntries.map((entry) => (
                                    <Fragment key={entry.id}>
                                        <br/>
                                        {productsMap[entry.productId] || "Loading..."} ,
                                        Quantity: {entry.quantity}
                                    </Fragment>
                                ))}
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