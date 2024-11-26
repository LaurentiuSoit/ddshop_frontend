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
                <Card className="card">
                    <CardContent className="card-content">
                        <Link className="product-link" key={product.id} to={`/product/${product.id}`}>
                            <img className="product-image"
                                 src={productImage(product.name)}
                                 alt="description"
                            />
                            <h3>
                                {product.name}
                            </h3>
                        </Link>
                        <p>${product.price} <br/><br/> {product.description}</p>
                    </CardContent>
                    {product.availableQuantity > 0 ? <h3 style={{color: '#77a464'}}>In Stock</h3> :
                        <h3 style={{color: 'red'}}>Out of Stock</h3>}
                    <Link className="product-link" key={product.id} to={`/product/${product.id}`}>
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