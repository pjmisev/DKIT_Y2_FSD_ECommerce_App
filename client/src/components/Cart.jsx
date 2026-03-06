import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import { BuyProduct } from "./BuyProduct.jsx";



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

    const removeFromCart = (productId) => {
        const existingCartIds = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedIds = existingCartIds.filter(id => id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedIds));

        setCartProducts(prevProducts =>
            prevProducts.filter(product => product._id !== productId)
        );
    };

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
                    <td colSpan="2" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
                    <td style={{ fontWeight: 'bold' }}>
                        €{cartProducts.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                    </td>
                    <td>
                        <BuyProduct
                        product={cartProducts}
                        price={cartProducts.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                        />
                    </td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
}