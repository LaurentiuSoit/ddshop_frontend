export interface CartDTO {
    id: number;
    shopUserId: number;
    cartEntryIdList: number[];
    totalPrice: number;
}