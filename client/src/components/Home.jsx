import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = "http://localhost:4000/api";

    useEffect(() => {
        fetch(`${API_URL}/products/featured`)
            .then(res => res.json())
            .then(data => {
                setFeaturedProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching featured products:', err);
                setLoading(false);
            });
    }, []);

    const ProductCard = ({ product }) => (
        <div className="product-card">
            {product.image ? (
                <img 
                    src={`data:image/jpeg;base64,${product.image}`} 
                    alt={product.model}
                    className="product-image"
                />
            ) : (
                <div className="product-image-placeholder">No Image</div>
            )}
            <div className="product-info">
                <h3 className="product-brand">{product.brand}</h3>
                <p className="product-model">{product.model}</p>
                <div className="product-price">€{product.price}</div>
                <Link to={`/products/${product._id}`} className="action-button">
                    View Details
                </Link>
            </div>
        </div>
    );

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Welcome to Sustiances</h1>
                    <p className="hero-subtitle">Your sustainable living destination for eco-friendly home appliances</p>
                    <div className="hero-buttons">
                        <Link to="/products" className="primary-button">
                            Shop Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="featured-section">
                <div className="section-header">
                    <h2>Featured Products</h2>
                    <p>Discover our handpicked selection of sustainable home appliances</p>
                </div>
                
                {loading ? (
                    <div className="loading">Loading featured products...</div>
                ) : featuredProducts.length > 0 ? (
                    <div className="products-grid">
                        {featuredProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="no-products">
                        <p>No featured products available at the moment.</p>
                        <Link to="/products" className="primary-button">
                            View All Products
                        </Link>
                    </div>
                )}
                
                <div className="view-all-container">
                    <Link to="/products" className="primary-button">
                        View All Products
                    </Link>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section">
                <div className="about-content">
                    <h2>About Sustiances</h2>
                    <div className="about-grid">
                        <div className="about-text">
                            <p>
                                At Sustiances, we believe in creating a sustainable future through eco-friendly home solutions. 
                                Our carefully curated selection of energy-efficient appliances helps you reduce your carbon footprint 
                                without compromising on quality or performance.
                            </p>
                            <p>
                                Every product in our store meets strict environmental standards, from energy efficiency ratings 
                                to sustainable manufacturing practices. We partner with leading brands that share our commitment to 
                                protecting our planet.
                            </p>
                        </div>
                        <div className="about-features">
                            <div className="feature-item">
                                <h3>Eco-Friendly</h3>
                                <p>All products meet strict environmental standards</p>
                            </div>
                            <div className="feature-item">
                                <h3>Energy Efficient</h3>
                                <p>Save money while reducing your environmental impact</p>
                            </div>
                            <div className="feature-item">
                                <h3>Quality Assured</h3>
                                <p>Premium products from trusted sustainable brands</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Make a Difference?</h2>
                    <p>Join thousands of customers who have chosen sustainable living</p>
                    <Link to="/products" className="action-button">
                        Start Shopping Today
                    </Link>
                </div>
            </section>
        </div>
    );
};