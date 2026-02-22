import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const Home = () => {
    const [products, setProducts] = useState([]); // Stores all products
    const [filteredProducts, setFilteredProducts] = useState([]); // Stores the list after sorting/filtering
    const [sortOption, setSortOption] = useState(''); // Sorting state
    const [filterCategory, setFilterCategory] = useState(''); // Filter category state
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:4000/api'; // Replace with your server endpoint

    // Fetch all products from the server
    useEffect(() => {
        setIsLoading(true);
        axios
            .get(`${API_URL}/products`)
            .then((response) => {
                setProducts(response.data); // Store all products
                setFilteredProducts(response.data); // Set initial view
            })
            .catch((err) => {
                console.error('Error fetching products:', err);
                setError("Failed to load products. Please ensure the server is running.");
            })
            .finally(() => {
                setIsLoading(false); // Always stop loading after the request
            });
    }, []);

    // Handles sorting
    const handleSort = (e) => {
        const sortValue = e.target.value;
        setSortOption(sortValue);

        let sortedProducts = [...filteredProducts];
        if (sortValue === 'price-asc') {
            sortedProducts.sort((a, b) => a.price - b.price); // Sort by price ascending
        } else if (sortValue === 'price-desc') {
            sortedProducts.sort((a, b) => b.price - a.price); // Sort by price descending
        } else if (sortValue === 'name-asc') {
            sortedProducts.sort((a, b) => a.model.localeCompare(b.model)); // Sort by name ascending
        } else if (sortValue === 'name-desc') {
            sortedProducts.sort((a, b) => b.model.localeCompare(a.model)); // Sort by name descending
        }
        setFilteredProducts(sortedProducts);
    };

    // Handles filtering
    const handleFilter = (e) => {
        const category = e.target.value;
        setFilterCategory(category);

        if (category === '') {
            setFilteredProducts(products); // Reset to all products if filter is cleared
        } else {
            const filtered = products.filter((product) => product.category === category);
            setFilteredProducts(filtered);
        }
    };

    if (isLoading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const uniqueCategories = [...new Set(products.map((product) => product.category))]; // Extract unique categories from products

    return (
        <div>
            {/* Hero Section */}
            <header style={{ textAlign: 'center', padding: '20px 0' }}>
                <h1>Welcome to Sustainable Living Store</h1>
                <p>Your one-stop shop for eco-friendly home appliances.</p>
            </header>

            {/* Sorting and Filtering Options */}
            <section style={{ margin: '20px 0', textAlign: 'center' }}>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    {/* Filter by Category */}
                    <select value={filterCategory} onChange={handleFilter} style={{ padding: '10px' }}>
                        <option value="">All Categories</option>
                        {uniqueCategories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    {/* Sort Options */}
                    <select value={sortOption} onChange={handleSort} style={{ padding: '10px' }}>
                        <option value="">Sort By</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">Name: A to Z</option>
                        <option value="name-desc">Name: Z to A</option>
                    </select>
                </div>
            </section>

            {/* Featured Products Section */}
            <section style={{ margin: '20px 0', textAlign: 'center' }}>
                <h2>Our Products</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    {filteredProducts.map((product) => (
                        <div
                            key={product._id}
                            style={{
                                border: '1px solid gray',
                                borderRadius: '5px',
                                padding: '10px',
                                maxWidth: '200px',
                                textAlign: 'center',
                            }}
                        >
                            <img
                                src={product.image}// Mock images for now
                                alt={product.model}
                                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                            />
                            <p style={{ fontWeight: 'bold', margin: '10px 0' }}>{product.model}</p>
                            <p>€{product.price.toFixed(2)}</p>
                            <Link
                                to={`/products/${product._id}`}
                                style={{
                                    display: 'inline-block',
                                    marginTop: '10px',
                                    textDecoration: 'none',
                                    padding: '5px 10px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    borderRadius: '5px',
                                }}
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};