import {ShopOrderEntryDTO} from "./ShopOrderEntryDTO";

enum paymentTypeEnum {
    CREDIT_CARD,
    DEBIT_CARD,
    PAYPAL,
    BANK_TRANSFER,
}

export interface ShopOrderDTO {
    id: number;
    shopUserId: number;
    cartId: number;
    paymentType: paymentTypeEnum;
    deliveryAddressId: number;
    invoiceAddressId: number;
    totalPrice: number;
    orderDate: Date;
    orderEntries: ShopOrderEntryDTO[];
}