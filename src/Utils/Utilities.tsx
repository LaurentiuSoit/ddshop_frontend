import {ProductDTO} from "../Components/Types/ProductDTO";
import {UserDTO} from "../Components/Types/UserDTO";
import {CartDTO} from "../Components/Types/CartDTO";
import {ProductFilterCriteria} from "../Components/Types/ProductFilterCriteria";
import {useEffect, useState} from "react";
import {ProductAttributeDTO} from "../Components/Types/ProductAttributeDTO";
import {AttributeValueDTO} from "../Components/Types/AttributeValueDTO";

export function productImage(name: string): string {
    if (!name) {
        return "/Images/default.png";  // fallback image URL path in public folder
    }

    const fileName = name.toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll('-', '_') + ".png";

    // Return the relative path to the image in the public folder
    return `/Images/${fileName}`;
}

export const fetchProductById = async (id: number): Promise<ProductDTO> => {
    try {
        const response = await fetch(`http://localhost:8080/product/get/${id}`);

        if (!response.ok) {
            throw new Error(`Error fetching product with id ${id}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const fetchAttributeValueById = async (id: number): Promise<AttributeValueDTO> => {
    try {
        const response = await fetch(`http://localhost:8080/attribute_value/get/${id}`);
        if (!response.ok) {
            throw new Error(`Error fetching attribute value with id ${id}: ${response.statusText}`);
        }
        const data: AttributeValueDTO = await response.json();
        return data;
    } catch (error: any) {
        console.log(error);
        throw new Error('Failed to fetch Attribute Value.');
    }
}

export const fetchUser = async (): Promise<UserDTO> => {
    if (!localStorage.getItem("user-id")) {
        throw new Error('User ID is missing in local storage.');
    }
    try {
        const response = await fetch(`http://localhost:8080/user/get/${localStorage.getItem("user-id")}`);
        if (!response.ok) {
            throw new Error('Could not get user.');
        }
        const user: UserDTO = await response.json();
        return user;
    } catch (error: any) {
        console.log(error.message);
        throw new Error('Failed to fetch user data.');
    }
}

export const fetchCart = async (): Promise<CartDTO> => {
    try {
        const response = await fetch(`http://localhost:8080/cart/get/${localStorage.getItem("user-id")}`);
        const cart: CartDTO = await response.json();
        if (response.ok) {
            return cart;
        } else {
            throw new Error('Cart could not be retrieved.');
        }
    } catch (err: unknown) {
        console.log((err as Error).message);
        throw new Error('Failed to fetch cart data.');
    }
}

export const useFetchProducts = (
    productFilterCriteria: ProductFilterCriteria,
    sortBy: string
) => {
    const [productList, setProductList] = useState<ProductDTO[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/product/filter?sortBy=${sortBy}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(productFilterCriteria),
                    }
                );
                if (!response.ok) {
                    throw new Error('Could not get products.');
                }
                const data: ProductDTO[] = await response.json();
                setProductList(data);
            } catch (error: any) {
                console.log(error.message);
            }
        };

        fetchProducts();
    }, [productFilterCriteria, sortBy]);

    return {productList};
};

export const useFetchProductAttributes = () => {
    const [productAttributeList, setProductAttributeList] = useState<ProductAttributeDTO[]>([]);

    useEffect(() => {
        const fetchProductAttributeList = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/product_attribute/get`);
                if (!response.ok) {
                    throw new Error('Could not get product attributes.');
                }
                const data: ProductAttributeDTO[] = await response.json();
                setProductAttributeList(data);
            } catch (error: any) {
                console.log(error.message);
            }
        };

        fetchProductAttributeList();
    }, []);

    return {productAttributeList};
};
