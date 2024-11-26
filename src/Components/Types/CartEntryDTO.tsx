export interface CartEntryDTO {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
    pricePerPiece: number;
    totalPricePerEntry: number;
};