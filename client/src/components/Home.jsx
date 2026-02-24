import React from 'react';
import { Link } from 'react-router-dom';

export const Home = () => {
    return (
        <div className="home-content">
            {/* Welcome Section */}
            <header>
                <h1>Welcome to Sustiances</h1>
                <p>A sustainable living store, your one-stop destination for eco-friendly home appliances.</p>
            </header>

            {/* Main Menu */}
            <nav style={{ margin: '20px 0' }}>
                <Link
                    to="/products"
                    style={{
                        display: 'inline-block',
                        margin: '10px',
                        padding: '10px 20px',
                        textDecoration: 'none',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        borderRadius: '5px',
                        fontSize: '16px',
                    }}
                >
                    View Products
                </Link>
                <Link
                    to="/cart"
                    style={{
                        display: 'inline-block',
                        margin: '10px',
                        padding: '10px 20px',
                        textDecoration: 'none',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        borderRadius: '5px',
                        fontSize: '16px',
                    }}
                >
                    Go to Cart
                </Link>

            </nav>
        </div>
    );
};