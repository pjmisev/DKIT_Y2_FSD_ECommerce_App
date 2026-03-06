import React from "react";
import { Link } from "react-router-dom";

export const ProductCard = ({ product, addToCart }) => {
    return (
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
                <div className="card-actions">
                    <button className="action-button" onClick={() => addToCart(product._id)}>
                        Add to Cart
                    </button>
                    <Link to={`/products/${product._id}`} className="action-button">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};