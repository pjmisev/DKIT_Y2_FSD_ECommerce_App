import React from "react";
import { Link } from "react-router-dom";

export const ProductTableRow = ({ product, addToCart }) => {
    const isOutOfStock = product.stock_level <= 0;

    return (
        <tr key={product._id}>
            <td>
                <img
                    src={product.image ? `data:image/png;base64,${product.image}` : '/placeholder.png'}
                    alt={product.model}
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                />
            </td>
            <td>{product.category}</td>
            <td>{product.brand}</td>
            <td>{product.model}</td>
            <td>€{product.price.toFixed(2)}</td>
            <td>{product.stocking_status}</td>
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