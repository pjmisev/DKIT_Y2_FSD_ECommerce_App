import React from "react";
import { Link } from "react-router-dom";

export const ProductTabletView = ({ product, addToCart }) => {
    return (
        <tr key={product._id}>
            <td>
                <img
                    src={product.image ? `data:image/png;base64,${product.image}` : '/placeholder.png'}
                    alt={product.model}
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
            </td>
            <td>
                <div className="tablet-product-info">
                    <div className="tablet-brand">{product.brand}</div>
                    <div className="tablet-model">{product.model}</div>
                </div>
            </td>
            <td>€{product.price.toFixed(2)}</td>
            <td>
                <button className="action-button" onClick={() => addToCart(product._id)}>
                    Add
                </button>
                <Link to={`/products/${product._id}`} className="action-button">
                    View
                </Link>
            </td>
        </tr>
    );
};