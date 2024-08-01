export interface ProductDTO {
    id: number;
    name: string;
    description: string;
    price: number;
    availableQuantity: number;
    addedDate: string;
    categoryId: number;
    validAttributeIdList: number[];
}