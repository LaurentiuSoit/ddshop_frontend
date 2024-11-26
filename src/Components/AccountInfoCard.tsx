import React, {useEffect, useState} from 'react'
import {
    Box,
    Button,
    Card, CardContent, Container,
    FormControl,
    Grid,
    MenuItem,
    Modal,
    Select,
    SelectChangeEvent,
    TextField
} from "@mui/material";
import {AddressDTO} from "./Types/AddressDTO";
import {UserDTO} from "./Types/UserDTO";
import {useNavigate} from "react-router-dom";
import {fetchUser} from "../Utils/Utilities";
import "./Order.css"
import "./AccountInfoCard.css"
import {ShopOrderDTO} from "./Types/ShopOrderDTO";

const AccountInfoCard: React.FC<{
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
    isAccount?: boolean,
    totalPrice?: number
}> = ({
          setIsLoggedIn,
          isAccount = false,
          totalPrice = 0

      }) => {
    const [user, setUser] = useState<UserDTO>({
        id: 0,
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        defaultBillingAddressId: 0,
        defaultDeliveryAddressId: 0
    })
    const [updateUser, setUpdateUser] = useState<UserDTO>({
        id: 0,
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        defaultBillingAddressId: 0,
        defaultDeliveryAddressId: 0
    })
    const [addressList, setAddressList] = useState<AddressDTO[]>([]);
    const [address, setAddress] = useState<string>("");
    const [newAddress, setNewAddress] = useState<AddressDTO>({
        id: 0,
        country: "",
        county: "",
        postalCode: 0,
        city: "",
        streetLine: ""
    });
    const [billingAddress, setBillingAddress] = useState<AddressDTO>({
        id: 0,
        country: "",
        county: "",
        postalCode: 0,
        city: "",
        streetLine: ""
    })
    const [deliveryAddress, setDeliveryAddress] = useState<AddressDTO>({
        id: 0,
        country: "",
        county: "",
        postalCode: 0,
        city: "",
        streetLine: ""
    })

    enum paymentTypeEnum {
        CREDIT_CARD,
        DEBIT_CARD,
        PAYPAL,
        BANK_TRANSFER,
    }

    const [paymentType, setPaymentType] = useState<paymentTypeEnum>(0);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [hasError, setHasError] = useState<boolean>(false);

    const handlePaymentChange = (event: SelectChangeEvent) => {
        setPaymentType(Number(event.target.value));
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        document.body.style.cursor = 'wait';
        const shopOrderDTO: ShopOrderDTO = {
            id: 0,
            shopUserId: user.id,
            cartId: Number(localStorage.getItem("cart-id")),
            paymentType: paymentType,
            deliveryAddressId: deliveryAddress.id,
            invoiceAddressId: billingAddress.id,
            totalPrice: totalPrice,
            orderDate: new Date()
        }
        try {
            const response = await fetch('http://localhost:8080/order/place', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shopOrderDTO)
            });
            if (response.ok) {
                navigate("/order_confirm");
            } else {
                const data: string = await response.text();
                setMessage(data);
                setHasError(true);
            }
        } catch (error: any) {
            console.log(error.message)
        } finally {
            setLoading(false);
            document.body.style.cursor = 'default';
        }
    }

    const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false);
    const [openEditModal, setOpenEditModal] = React.useState<boolean>(false);

    const handleOpenEditModal = () => setOpenEditModal(true);
    const handleCloseEditModal = () => setOpenEditModal(false);

    const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setUpdateUser(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmitUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8080/user/update/${localStorage.getItem("user-id")}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateUser)
            });
            if (!response.ok) {
                throw new Error('Update failed.');
            }
            const newUser: UserDTO = await response.json();
            setUser(newUser);
        } catch (err: unknown) {
            console.log((err as Error).message);
        }

        setOpenEditModal(false);
    };
    const [openAddAddressModal, setOpenAddAddressModal] = React.useState<boolean>(false);
    const [openBillingAddressModal, setOpenBillingAddressModal] = React.useState<boolean>(false);
    const [openDeliveryAddressModal, setOpenDeliveryAddressModal] = React.useState<boolean>(false);
    const handleOpenAddAddressModal = () => setOpenAddAddressModal(true);
    const handleCloseAddAddressModal = () => setOpenAddAddressModal(false);

    const handleChangeAddAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setNewAddress(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmitAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/address/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAddress)
            });
            if (!response.ok) {
                throw new Error('Could not add address.');
            }
        } catch (err: unknown) {
            console.log((err as Error).message);
        }
        setOpenAddAddressModal(false);
    };

    const handleAddressChange = (event: SelectChangeEvent) => {
        setAddress(event.target.value as string);
    };

    const handleOpenBillingAddressModal = () => {
        setOpenBillingAddressModal(true);
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
        fetchAddresses();
    }


    const handleCloseBillingAddressModal = () => {
        setOpenBillingAddressModal(false);
    }

    const handleSubmitBillingAddress = async (addressId: number) => {

        try {
            const response = await fetch(`http://localhost:8080/user/updateBillingAddress?userId=${localStorage.getItem("user-id")}&addressId=${addressId}`, {
                method: 'PUT',
            });
            if (!response.ok) {
                throw new Error('Could not update billing address.');
            }
            if (updateUser && setUser) {
                const newUser: UserDTO = await response.json();
                setUser(newUser);
            }
        } catch (err: unknown) {
            console.log((err as Error).message);
        }
    }

    const handleOpenDeliveryAddressModal = () => {
        setOpenDeliveryAddressModal(true);
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
        fetchAddresses();
    }


    const handleCloseDeliveryAddressModal = () => {
        setOpenDeliveryAddressModal(false);
    }

    const handleSubmitDeliveryAddress = async (addressId: number) => {

        try {
            const response = await fetch(`http://localhost:8080/user/updateDeliveryAddress?userId=${localStorage.getItem("user-id")}&addressId=${addressId}`, {
                method: 'PUT',
            });
            if (!response.ok) {
                throw new Error('Could not update delivery address.');
            }
            if (updateUser && setUser) {
                const newUser: UserDTO = await response.json();
                setUser(newUser);
            }
        } catch (err: unknown) {
            console.log((err as Error).message);
        }
    }

    const handleOpenDeleteModal = () => setOpenDeleteModal(true);
    const handleCloseDeleteModal = () => setOpenDeleteModal(false);
    const handleDeleteAccount = () => {
        const deleteAccount = async () => {
            try {
                const response = await fetch(`http://localhost:8080/user/delete/${localStorage.getItem("user-id")}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error('Could not delete user.');
                }
            } catch (error: any) {
                console.log(error.message);
            }
            localStorage.setItem("logged-in", "false");
            setIsLoggedIn(false);
            navigate("/");
        }
        deleteAccount();
    }


    useEffect(() => {
        fetchUser().then(fetchedUser => {
            setUser(fetchedUser);
        });
    }, [])
    useEffect(() => {
        const fetchBillingAddress = async () => {
            if (!localStorage.getItem("user-id")) {
                return;
            }
            try {
                const response = await fetch(`http://localhost:8080/address/get/${user.defaultBillingAddressId}`);
                if (!response.ok) {
                    throw new Error('Could not get billing address.');
                }
                const billingAddress: AddressDTO = await response.json();
                setBillingAddress(billingAddress);
            } catch (error: any) {
                console.log(error.message);
            }
        }
        fetchBillingAddress();
    }, [user.defaultBillingAddressId])

    useEffect(() => {
        const fetchDeliveryAddress = async () => {
            if (!localStorage.getItem("user-id")) {
                return;
            }
            try {
                const response = await fetch(`http://localhost:8080/address/get/${user.defaultDeliveryAddressId}`);
                if (!response.ok) {
                    throw new Error('Could not get delivery address.');
                }
                const deliveryAddress: AddressDTO = await response.json();
                setDeliveryAddress(deliveryAddress);
            } catch (error: any) {
                console.log(error.message);
            }
        }
        fetchDeliveryAddress();
    }, [user.defaultDeliveryAddressId])

    return (
        <Container className={isAccount ? "account-container" : "order-container"}>
            <Card className="account-card">
                <CardContent className="account-card-content">
                    First Name : {user.firstName}
                    <br/>
                    Last Name : {user.lastName}
                    <br/>
                    Email : {user.email}
                    <br/>
                    Phone Number : {user.phoneNumber}
                    <br/>
                    Billing Address
                    : {`${billingAddress.streetLine}, ${billingAddress.city}, ${billingAddress.postalCode}, ${billingAddress.county}, ${billingAddress.country}`}
                    <br/>
                    Delivery Address
                    : {`${deliveryAddress.streetLine}, ${deliveryAddress.city}, ${deliveryAddress.postalCode}, ${deliveryAddress.county}, ${deliveryAddress.country}`}
                    <br/>
                    {!isAccount && (
                        <div>
                            <p>Select Payment Type :</p>
                            <Select
                                className="payment-select"
                                value={paymentType as unknown as string}
                                label="Payment Type"
                                onChange={handlePaymentChange}
                            >
                                <MenuItem value={0}>Credit Card</MenuItem>
                                <MenuItem value={1}>Debit Card</MenuItem>
                                <MenuItem value={2}>Paypal</MenuItem>
                                <MenuItem value={3}>Bank Transfer</MenuItem>
                            </Select>
                            <br/>
                            <br/>
                        </div>
                    )}
                    {hasError && (
                        <h3 style={{color: 'red'}}>Order could not be completed. {message}</h3>
                    )}
                    {!isAccount && (
                        <Button
                            className="place-order-button"
                            type="submit"
                            variant="contained"
                            size="large"
                            onClick={handlePlaceOrder}
                            disabled={loading}
                        >
                            <b>Place Order</b>
                        </Button>
                    )}
                </CardContent>
                <Button
                    className="edit-info-button"
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleOpenEditModal}
                >
                    <b>Edit Info</b>
                </Button>
                <Button
                    className="edit-info-button"
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleOpenAddAddressModal}
                >
                    <b>Add Address</b>
                </Button>
                <Button
                    className="edit-info-button"
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleOpenBillingAddressModal}
                >
                    <b>Select Billing Address</b>
                </Button>
                <Button
                    className="edit-info-button"
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleOpenDeliveryAddressModal}
                >
                    <b>Select Delivery Address</b>
                </Button>
                <Modal
                    open={openAddAddressModal}
                    onClose={handleCloseAddAddressModal}>
                    <Box className="edit-info-button-modal">
                        <form onSubmit={handleSubmitAddAddress}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        className="update-textfield"
                                        name="streetLine"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label="Street Line"
                                        type="text"
                                        onChange={handleChangeAddAddress}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        className="update-textfield"
                                        name="postalCode"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label="Postal Code"
                                        type="number"
                                        onChange={handleChangeAddAddress}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        className="update-textfield"
                                        name="city"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label="City"
                                        type="text"
                                        onChange={handleChangeAddAddress}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        className="update-textfield"
                                        name="county"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label="County"
                                        type="text"
                                        onChange={handleChangeAddAddress}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        className="update-textfield"
                                        name="country"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label="Country"
                                        type="text"
                                        onChange={handleChangeAddAddress}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                className="update-info-button"
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                            >
                                Add Address
                            </Button>
                        </form>
                    </Box>
                </Modal>
                <Modal
                    open={openBillingAddressModal}
                    onClose={handleCloseBillingAddressModal}
                >
                    <Box className="address-button-modal">
                        <FormControl>
                            <Select
                                className="select-address"
                                value={address}
                                onChange={handleAddressChange}
                            >
                                {addressList.map((address) => (
                                    <MenuItem
                                        key={address.id}
                                        value={`${address.streetLine}, ${address.city}, ${address.postalCode}, ${address.county}, ${address.country}`}
                                        onClick={() => handleSubmitBillingAddress(address.id)}
                                    >
                                        {`${address.streetLine}, ${address.city}, ${address.postalCode}, ${address.county}, ${address.country}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                </Modal>
                <Modal
                    open={openDeliveryAddressModal}
                    onClose={handleCloseDeliveryAddressModal}
                >
                    <Box className="address-button-modal">
                        <FormControl>
                            <Select
                                className="select-address"
                                value={address}
                                onChange={handleAddressChange}
                            >
                                {addressList.map((address) => (
                                    <MenuItem
                                        className="select-menu-item"
                                        key={address.id}
                                        value={`${address.streetLine}, ${address.city}, ${address.postalCode}, ${address.county}, ${address.country}`}
                                        onClick={() => handleSubmitDeliveryAddress(address.id)}
                                    >
                                        {`${address.streetLine}, ${address.city}, ${address.postalCode}, ${address.county}, ${address.country}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Modal>
                {isAccount && (
                    <Button
                        className="delete-account-button"
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleOpenDeleteModal}
                    >
                        <b>Delete Account</b>
                    </Button>
                )}
                <Modal
                    open={openEditModal}
                    onClose={handleCloseEditModal}>
                    <Box className="edit-info-button-modal">
                        <form onSubmit={handleSubmitUpdate}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        className="update-textfield"
                                        name="firstName"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label="First Name"
                                        type="text"
                                        defaultValue={user.firstName}
                                        onChange={handleChangeEdit}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        className="update-textfield"
                                        name="lastName"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label="Last Name"
                                        type="text"
                                        defaultValue={user.lastName}
                                        onChange={handleChangeEdit}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        className="update-textfield"
                                        name="phoneNumber"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label="Phone Number"
                                        type="text"
                                        defaultValue={user.phoneNumber}
                                        onChange={handleChangeEdit}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                className="update-info-button"
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                            >
                                UPDATE INFO
                            </Button>
                        </form>
                    </Box>
                </Modal>
                {isAccount && (
                    <Modal
                        open={openDeleteModal}
                        onClose={handleCloseDeleteModal}>
                        <Box className="delete-account-button-modal">
                            <div className="delete-modal-text">
                                Are you sure you want to delete your account ?
                            </div>
                            <div className="delete-modal-buttons-div">
                                <Button
                                    className="delete-account-button"
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={handleDeleteAccount}
                                >
                                    <b>Delete</b>
                                </Button>
                                <Button
                                    className="cancel-button"
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={handleCloseDeleteModal}
                                >
                                    <b>Cancel</b>
                                </Button>
                            </div>
                        </Box>
                    </Modal>
                )}
            </Card>
        </Container>
    )
}

export default AccountInfoCard;