import React from "react";
import { Link } from "react-router-dom";

export const ProductCard = ({ product, addToCart }) => {
    return (
        <div key={product._id} className="data-card">
            <img
                src={product.image ? `data:image/png;base64,${product.image}` : '/placeholder.png'}
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
                <button className="action-button" onClick={() => addToCart(product._id)}>
                    Add to Cart
                </button>
                <Link to={`/products/${product._id}`} className="action-button">
                    Details
                </Link>
            </div>
        </div>
    );
};