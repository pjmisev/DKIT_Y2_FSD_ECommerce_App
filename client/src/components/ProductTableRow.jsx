import React from "react";
import { Link } from "react-router-dom";
import { BuyProduct } from "./BuyProduct.jsx";

export const ProductTableRow = ({ product, addToCart }) => {
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
                <button className="action-button" onClick={() => addToCart(product._id)}>
                    Add to Cart
                </button>
                <Link to={`/products/${product._id}`} className="action-button">
                    Details
                </Link>
                <div style={{marginTop: "10px"}}>
                    <BuyProduct product={product} price={product.price} />
                </div>
            </td>
        </tr>
    );
};