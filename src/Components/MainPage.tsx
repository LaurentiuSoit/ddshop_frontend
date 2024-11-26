import React, {useEffect, useState} from 'react';
import ProductList from "./ProductList";
import {
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Slider
} from "@mui/material";
import "./MainPage.css"
import {ProductFilterCriteria} from "./Types/ProductFilterCriteria";
import {fetchAttributeValueById, useFetchProductAttributes, useFetchProducts} from "../Utils/Utilities";
import {AttributeValueDTO} from "./Types/AttributeValueDTO";

const MainPage: React.FC = () => {
    const MINPRICE = 0;
    const MAXPRICE = 500;
    const [price, setPrice] = useState<number[]>([MINPRICE, MAXPRICE]);
    const [inStock, setInStock] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<string>('newest');
    const [attributeValues, setAttributeValues] = useState<Record<number, string>>({});
    const [productFilterCriteria, setProductFilterCriteria] = useState<ProductFilterCriteria>({
        minPrice: null,
        maxPrice: null,
        name: null,
        inStock: null,
        categoryId: null,
        attributeValueIds: []
    });

    const marks = [
        {
            value: MINPRICE,
            label: `${MINPRICE}`,
        },
        {
            value: MAXPRICE,
            label: `${MAXPRICE}`,
        }
    ];

    const handleSortSelection = (event: SelectChangeEvent<string>) => {
        setSortBy(event.target.value as string);
    }

    const handlePriceChange = (event: Event | React.SyntheticEvent<Element, Event>,
                               newValue: number | number[]) => {
        const [minPrice, maxPrice] = newValue as number[];

        setPrice([minPrice, maxPrice]);

        setProductFilterCriteria(prevState => ({
            ...prevState,
            minPrice: minPrice,
            maxPrice: maxPrice
        }));
    };

    const handleInStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedInStock = event.target.checked;

        setInStock(updatedInStock);
        setProductFilterCriteria(prevState => ({
            ...prevState,
            inStock: updatedInStock
        }));
    }

    const handleValueCheckbox = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        setProductFilterCriteria(prevState => {
            if (event.target.checked) {
                return {
                    ...prevState,
                    attributeValueIds: [...prevState.attributeValueIds, id]
                };
            } else {
                return {
                    ...prevState,
                    attributeValueIds: prevState.attributeValueIds.filter(attributeId => attributeId !== id)
                };
            }
        })
    }

    const fetchAndSetAttributeValues = async (attributeValueIdList: number[]) => {
        const values = await Promise.all(
            attributeValueIdList.map(async (id) => {
                const attributeValue = await fetchAttributeValueById(id);
                return {id, value: attributeValue.value};
            })
        );
        setAttributeValues(prevValues => ({
            ...prevValues,
            ...Object.fromEntries(values.map(({id, value}) => [id, value]))
        }));
    }

    const {productList} = useFetchProducts(productFilterCriteria, sortBy);
    const {productAttributeList} = useFetchProductAttributes();

    useEffect(() => {
        if (productAttributeList) {
            productAttributeList.forEach(productAttribute => {
                fetchAndSetAttributeValues(productAttribute.attributeValueIdList);
            });
        }
    }, [productAttributeList]);

    return (
        <div>
            <FormControl className="form-control">
                <Select
                    className="select"
                    value={sortBy}
                    onChange={handleSortSelection}
                >
                    <MenuItem className="menu-item" value={"newest"}>Sort By Newest</MenuItem>
                    <MenuItem className="menu-item" value={"priceasc"}>Sort By Price Ascending</MenuItem>
                    <MenuItem className="menu-item" value={"pricedesc"}>Sort By Price Descending</MenuItem>
                </Select>
            </FormControl>
            <div className="main-page-content">
                <div className="filter-options">
                    <div className="checkbox-filter">
                        <FormControlLabel control={<Checkbox onChange={handleInStockChange}/>}
                                          label="Show only In Stock items"/>
                    </div>
                    <div className="price-filter">
                        Price
                        <Slider
                            marks={marks}
                            min={MINPRICE}
                            max={MAXPRICE}
                            value={price}
                            onChange={(
                                event: Event,
                                newValue: number | number[]
                            ) => setPrice(newValue as number[])}
                            onChangeCommitted={handlePriceChange}
                            getAriaLabel={() => 'Temperature range'}
                            valueLabelDisplay="auto"
                        />
                    </div>
                    {productAttributeList.map(productAttribute => (
                        <>
                            <div className="filter">
                                {productAttribute.name}
                            </div>
                            {productAttribute.attributeValueIdList.map(attributeValueId => (
                                <div key={attributeValueId} className="checkbox-filter">
                                    <FormControlLabel
                                        control={<Checkbox
                                            onChange={(event) => handleValueCheckbox(event, attributeValueId)}/>}
                                        label={attributeValues[attributeValueId] || "Loading..."}/>
                                </div>
                            ))}
                        </>
                    ))}
                </div>
                <div className="product-list">
                    <ProductList products={productList}/>
                </div>
            </div>
        </div>
    );
}

export default MainPage;