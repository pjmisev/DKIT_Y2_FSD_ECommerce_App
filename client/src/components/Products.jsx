import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

export const Products = props => {
    const [products, setProducts] = useState([]); // Stores all products
    const [searchQuery, setSearchQuery] = useState(''); // Holds the search input value
    const [filteredProducts, setFilteredProducts] = useState([]); // Displays products based on search
    const [sortOption, setSortOption] = useState(''); // Sorting state
    const [filterCategory, setFilterCategory] = useState(''); // Filter category state
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:4000/api'; 

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

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter products that match model, brand, or category
        const filtered = products.filter((product) =>
            product.model.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
        setFilteredProducts(filtered);
    };

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
                <h1>Products</h1>
                <p>View our great selection of appliances</p>
            </header>
        <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by model, brand, or category..."
            style={{
                padding: '10px',
                width: '100%',
                marginBottom: '20px',
                border: '1px solid #ccc',
                borderRadius: '4px',
            }}
        />
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
                <section>
                    {filteredProducts?.length === 0 ? (
                        <p>No products found</p>
                    ) : (
                        <>
                            <table className="data-table">
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
                                {filteredProducts?.map((product) => (
                                    <tr key={product._id}>

                                        <td>
                                            <img
                                            src={
                                                product.image
                                                    ? `data:image/png;base64,${product.image}` // Ensure Base64 rendering
                                                    : '/placeholder.png' // Fallback image for missing product images
                                            }
                                            alt={product.model}
                                            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td>{product.category}</td>
                                        <td>{product.brand}</td>
                                        <td>{product.model}</td>
                                        <td>€{product.price.toFixed(2)}</td>
                                        <td>{product.stocking_status}</td>
                                        <td>
                                            <button
                                                className="action-button"
                                            >
                                                Add to Cart
                                            </button>
                                            <Link
                                                to={`/products/${product._id}`}
                                                className="action-button"
                                            >
                                                Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <div className="card-grid">

                                {filteredProducts?.map((product) => (
                                    <div key={product._id} className="data-card">
                                        <img
                                            src={
                                                product.image
                                                    ? `data:image/png;base64,${product.image}` // Ensure Base64 rendering
                                                    : '/placeholder.png' // Fallback image for missing product images
                                            }
                                            alt={product.model}
                                            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                        />
                                        <div className="card-title">{product.brand} {product.model}</div>
                                        <div className="card-field">
                                            <span className="card-field-label">Category:</span>
                                            <span className="card-field-value">{product.category}</span>
                                        </div>

                                        <div className="card-field">
                                            <span className="card-field-label">Price:</span>
                                            <span className="card-field-value">€{product.price.toFixed(2)}</span>
                                        </div>
                                        <div className="card-field">
                                            <span className="card-field-label">Stock:</span>
                                            <span className="card-field-value">{product.stocking_status}</span>
                                        </div>
                                        <div className="card-actions">
                                            <button
                                                className="action-button"
                                            >
                                                Add to Cart
                                            </button>
                                            <Link
                                                to={`/products/${product._id}`}
                                                className="action-button"
                                            >
                                                Details
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </section>


            </section>
        </div>
    );
}