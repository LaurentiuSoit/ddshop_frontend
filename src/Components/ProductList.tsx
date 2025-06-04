import React from 'react';
import {ProductListProps} from "./Props/ProductListProps";
import {Link} from "react-router-dom";
import {Button, Card, CardContent, Container} from "@mui/material";
import "./ProductList.css"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {productImage} from "../Utils/Utilities";

const ProductList: React.FC<ProductListProps> = ({products}) => {
    return (
        <Container className="product-container">
            {products.map(product => (
                <Card key={product.id} className="card">
                    <CardContent className="card-content">
                        <Link className="product-link" to={`/product/${product.id}`}>
                            <img className="product-image"
                                 src={productImage(product.name)}
                                 alt="description"
                            />
                        </Link>
                    </CardContent>
                    <Link className="product-name-link" to={`/product/${product.id}`}>
                        <p>{product.name}</p>
                    </Link>
                    <div className="product-price-stock">
                        ${product.price}
                        {product.availableQuantity > 0 ? <span style={{color: 'green'}}>In Stock</span> :
                            <span style={{color: 'red'}}>Out of Stock</span>}
                    </div>
                    <Link className="product-link" to={`/product/${product.id}`}>
                        <Button className="select-options-button"
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                        >
                            <AddCircleIcon className="add-circle-icon"/>
                            <b>View Product</b>
                        </Button>
                    </Link>
                </Card>
            ))}
        </Container>
    )
}

export default ProductList;