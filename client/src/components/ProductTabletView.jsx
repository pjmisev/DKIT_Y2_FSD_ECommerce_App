import React from "react";
import { Link } from "react-router-dom";

export const ProductTabletView = ({ product, addToCart }) => {
    const isOutOfStock = product.stock_level <= 0;

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
                {isOutOfStock ? (
                    <span className="out-of-stock">Out of Stock</span>
                ) : (
                    <>
                        <button className="action-button" onClick={() => addToCart(product._id)}>
                            Add to Cart
                        </button>
                        <Link to={`/products/${product._id}`} className="action-button">
                            View Details
                        </Link>
                    </>
                )}
            </td>
        </tr>
    );
};