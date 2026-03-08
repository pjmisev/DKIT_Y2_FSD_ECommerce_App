import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import { BuyProduct } from "./BuyProduct.jsx";
import {SERVER_HOST} from "../config/global_constants.js";



export const Cart = props => {

    const [cartProducts, setCartProducts] = useState([]); // This must be defined!
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pricing, setPricing] = useState(null);

    // const API_URL = 'http://localhost:4000/api';

    useEffect(() => {
        const savedIds = JSON.parse(localStorage.getItem('cart')) || [];

        if (savedIds.length > 0) {
            // Fetch only the products that match your saved IDs
            axios.get(`${SERVER_HOST}/api/products`)
                .then(res => {
                    const cartItems = res.data.filter(p => savedIds.includes(p._id));
                    setCartProducts(cartItems);

                    return axios.post(`${SERVER_HOST}/api/products/calculate-pricing`, {
                        productIds: savedIds
                    });
                })
                .then(pricingRes => {
                    setPricing(pricingRes.data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching cart data:', err);
                    setError('Failed to load cart data');
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
            setPricing({
                subtotal: 0,
                vat: 0,
                shippingCost: 0,
                total: 0,
                freeShipping: false
            });
        }
    }, []);

    const removeFromCart = (productId) => {
        const existingCartIds = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedIds = existingCartIds.filter(id => id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedIds));

        setCartProducts(prevProducts =>
            prevProducts.filter(product => product._id !== productId)
        );

        // Recalculate pricing after removal
        if (updatedIds.length > 0) {
            axios.post(`${SERVER_HOST}/api/products/calculate-pricing`, {
                productIds: updatedIds
            })
            .then(pricingRes => {
                setPricing(pricingRes.data);
            })
            .catch(err => {
                console.error('Error recalculating pricing:', err);
            });
        } else {
            // Cart is empty
            setPricing({
                subtotal: 0,
                vat: 0,
                shippingCost: 0,
                total: 0,
                freeShipping: false
            });
        }
    };

    return (
        <div className="cart-container">
            <h1>Your Cart</h1>

            {isLoading ? (
                <div>Loading cart...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : cartProducts.length === 0 ? (
                <div>
                    <h2>Your cart is empty</h2>
                    <p>Add items to your cart to start shopping.</p>
                    <Link to={'/products'} className="action-button">Add products from our catalouge here</Link>
                </div>
            ) : (
                <>
                    {/* Desktop/Tablet Table View */}
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Image</th>
                            <th>Model</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cartProducts?.map((product) => (
                            <tr key={product._id}>
                                <td>
                                    <img
                                        src={
                                            product.image
                                                ? `data:image/png;base64,${product.image}`
                                                : '/placeholder.png'
                                        }
                                        alt={product.model}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                </td>
                                <td>{product.brand} {product.model}</td>
                                <td>€{product.price.toFixed(2)}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            removeFromCart(product._id);
                                        }}
                                        className="action-button delete-button"
                                    >
                                        Remove from Cart
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        {/* Adding a Footer for the Total */}
                        <tfoot>
                        <tr>
                            <td colSpan="2" style={{ textAlign: 'right', fontWeight: 'bold' }}>Subtotal:</td>
                            <td style={{ fontWeight: 'bold' }}>
                                €{pricing?.subtotal.toFixed(2) || '0.00'}
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colSpan="2" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                Shipping:
                                {pricing?.freeShipping && (
                                    <span style={{ color: 'green', marginLeft: '5px' }}>
                                        (FREE over €100)
                                    </span>
                                )}
                            </td>
                            <td style={{ fontWeight: 'bold' }}>
                                {pricing?.freeShipping ? (
                                    <span style={{ color: 'green' }}>FREE</span>
                                ) : (
                                    `€${pricing?.shippingCost.toFixed(2) || '0.00'}`
                                )}
                            </td>
                            <td></td>
                        </tr>
                        <tr style={{ borderTop: '2px solid #000' }}>
                            <td colSpan="2" style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.2em' }}>Total:</td>
                            <td style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                                €{pricing?.total.toFixed(2) || '0.00'}
                            </td>
                            <td>
                                <BuyProduct
                                product={{products: cartProducts}}
                                price={pricing?.total.toFixed(2) || '0.00'}
                                pricing={pricing}
                                />
                            </td>
                        </tr>
                        </tfoot>
                    </table>

                    {/* Mobile Card View */}
                    <div className="cart-mobile-grid">
                        {cartProducts?.map((product) => (
                            <div key={product._id} className="cart-product-card">
                                <div className="cart-product-header">
                                    <img
                                        src={
                                            product.image
                                                ? `data:image/png;base64,${product.image}`
                                                : '/placeholder.png'
                                        }
                                        alt={product.model}
                                        className="cart-product-image"
                                    />
                                    <div className="cart-product-info">
                                        <div className="cart-product-brand">{product.brand}</div>
                                        <div className="cart-product-model">{product.model}</div>
                                        <div className="cart-product-price">€{product.price.toFixed(2)}</div>
                                    </div>
                                </div>
                                <div className="cart-product-actions">
                                    <button
                                        onClick={() => {
                                            removeFromCart(product._id);
                                        }}
                                        className="action-button delete-button"
                                        style={{ width: '100%' }}
                                    >
                                        Remove from Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        {/* Mobile Summary */}
                        <div className="cart-summary">
                            <div className="cart-summary-row">
                                <span className="cart-summary-label">Subtotal:</span>
                                <span className="cart-summary-value">€{pricing?.subtotal.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="cart-summary-row">
                                <span className="cart-summary-label">
                                    Shipping:
                                    {pricing?.freeShipping && (
                                        <span style={{ color: 'green', marginLeft: '5px', fontSize: '0.8rem' }}>
                                            (FREE over €100)
                                        </span>
                                    )}
                                </span>
                                <span className="cart-summary-value">
                                    {pricing?.freeShipping ? (
                                        <span style={{ color: 'green' }}>FREE</span>
                                    ) : (
                                        `€${pricing?.shippingCost.toFixed(2) || '0.00'}`
                                    )}
                                </span>
                            </div>
                            <div className="cart-summary-row">
                                <span className="cart-summary-label">Total:</span>
                                <span className="cart-summary-value">€{pricing?.total.toFixed(2) || '0.00'}</span>
                            </div>
                            <BuyProduct
                                product={{products: cartProducts}}
                                price={pricing?.total.toFixed(2) || '0.00'}
                                pricing={pricing}
                                className="cart-checkout-btn"
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}