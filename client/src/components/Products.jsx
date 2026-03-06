import React, {useEffect, useState} from "react";
import axios from "axios";
import { ProductTableRow } from "./ProductTableRow.jsx";
import { ProductTabletView } from "./ProductTabletView.jsx";
import { ProductCard } from "./ProductCard.jsx";
import { FilterMenu } from "./FilterMenu.jsx";


export const Products = props => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortOption, setSortOption] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:4000/api';


    useEffect(() => {
        setIsLoading(true);
        axios
            .get(`${API_URL}/products`)
            .then((response) => {
                setProducts(response.data);
                setFilteredProducts(response.data);
            })
            .catch((err) => {
                console.error('Error fetching products:', err);
                setError("Failed to load products. Please ensure the server is running.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);
    useEffect(() => {
        filterAndSortProducts()
    }, [searchQuery, filterCategory, sortOption, products])

    const filterAndSortProducts = () => {
        let updatedProducts = [...products];

        if (filterCategory) {
            updatedProducts = updatedProducts.filter(
                (product) => product.category === filterCategory
            );
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            updatedProducts = updatedProducts.filter(
                (product) =>
                    product.model.toLowerCase().includes(query) ||
                    product.brand.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query)
            );
        }

        if (sortOption === "price-asc") {
            updatedProducts.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-desc") {
            updatedProducts.sort((a, b) => b.price - a.price);
        } else if (sortOption === "name-asc") {
            updatedProducts.sort((a, b) => a.model.localeCompare(b.model));
        } else if (sortOption === "name-desc") {
            updatedProducts.sort((a, b) => b.model.localeCompare(a.model));
        }

        setFilteredProducts(updatedProducts);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilter = (e) => {
        setFilterCategory(e.target.value);
    };

    const handleSort = (e) => {
        setSortOption(e.target.value);
    };

    const addToCart = (productId) => {
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

        if (!existingCart.includes(productId)) {
            const updatedCart = [...existingCart, productId];
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            alert("Added to cart!");
        } else {
            alert("Item already in cart");
        }
    };

    if (isLoading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const uniqueCategories = [...new Set(products.map((product) => product.category))];

    return (
        <div className="cart-container">
            <header style={{ textAlign: 'center', padding: '20px 0' }}>
                <h1>Products</h1>
                <p>View our great selection of appliances</p>
            </header>

            <FilterMenu
                searchQuery={searchQuery}
                filterCategory={filterCategory}
                sortOption={sortOption}
                onSearchChange={handleSearch}
                onFilterChange={handleFilter}
                onSortChange={handleSort}
                categories={uniqueCategories}
            />

            {/* Featured Products Section */}
            <section style={{ margin: '20px 0', textAlign: 'center' }}>
                <h2>Our Products</h2>
                <section>
                    {filteredProducts?.length === 0 ? (
                        <p>No products found</p>
                    ) : (
                        <>
                            {/* DESKTOP TABLE VIEW */}
                            <table className="data-table desktop-table">
                                <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Category</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Price</th>
                                    <th>Stock Status</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredProducts.map((product) => (
                                    <ProductTableRow
                                        key={product._id}
                                        product={product}
                                        addToCart={addToCart}
                                    />
                                ))}
                                </tbody>
                            </table>

                            {/* TABLET VIEW */}
                            <table className="data-table tablet-table">
                                <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredProducts.map((product) => (
                                    <ProductTabletView
                                        key={product._id}
                                        product={product}
                                        addToCart={addToCart}
                                    />
                                ))}
                                </tbody>
                            </table>

                            {/* MOBILE CARD VIEW */}
                            <div className="card-grid">
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        addToCart={addToCart}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </section>
        </div>
    );
}