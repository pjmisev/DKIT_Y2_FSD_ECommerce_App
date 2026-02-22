import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const Home = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:4000/api';
    useEffect(() => {
        setIsLoading(true);
        axios.get(`${API_URL}/products`)
            .then((response) => {
                setProducts(response.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching products:', err);
                setError("Failed to load products. Please ensure the server is running.");
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <header style={{ textAlign: 'center', padding: '20px 0' }}>
                <h1>Welcome to Sustainable Living Store</h1>
                <p>Your one-stop shop for eco-friendly home appliances.</p>
            </header>

            <section style={{ margin: '20px 0', textAlign: 'center' }}>
                <h2>Our Products</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    {products.map((product) => (
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
                                src={product.image}//images not implemented yet
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