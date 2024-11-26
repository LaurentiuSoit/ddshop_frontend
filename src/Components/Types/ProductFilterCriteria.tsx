export interface ProductFilterCriteria {
    inStock: boolean | null;
    minPrice: number | null;
    maxPrice: number | null;
    name: string | null;
    categoryId: string | null;
    attributeValueIds: number[];
}