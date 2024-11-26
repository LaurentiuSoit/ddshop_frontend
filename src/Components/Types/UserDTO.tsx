export interface UserDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    defaultDeliveryAddressId: number;
    defaultBillingAddressId: number;
};