import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";



export const Cart = props => {

    const [cartProducts, setCartProducts] = useState([]); // This must be defined!
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // const API_URL = 'http://localhost:4000/api';

    useEffect(() => {
        const savedIds = JSON.parse(localStorage.getItem('cart')) || [];

        if (savedIds.length > 0) {
            // Fetch only the products that match your saved IDs
            axios.get(`http://localhost:4000/api/products`)
                .then(res => {
                    const cartItems = res.data.filter(p => savedIds.includes(p._id));
                    setCartProducts(cartItems);
                });
        }
    }, []);

    return (
        <div className="cart-container">
            <h1>Your Cart</h1>

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
                                className="action-button-danger"
                                // TODO onClick={() => removeFromCart(product._id)}
                            >
                                Remove
                            </button>
                            <button
                                className="action-button-danger"
                                // TODO onClick={() => purchase(product._id)}
                            >
                                Purchase
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
                {/* Adding a Footer for the Total */}
                <tfoot>
                <tr>
                    <td colSpan="2" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
                    <td style={{ fontWeight: 'bold' }}>
                        €{cartProducts.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                    </td>
                    <td></td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
}