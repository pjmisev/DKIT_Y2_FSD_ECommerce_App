import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

export const DisplayProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const API_URL = "http://localhost:4000/api";

    useEffect(() => {
        axios
            .get(`${API_URL}/products/${id}`)
            .then((response) => {
                setProduct(response.data);
                setError("");
            })
            .catch((err) => {
                console.error("Error fetching product details:", err);
                setError("Failed to fetch product details. Please try again later.");
            })
            .finally(() => {
                setIsLoading(false); // Stop loading
            });
    }, [id]);

    if (isLoading) {
        return <div>Loading product details...</div>;
    }

    if (error) {
        return <div style={{ color: "red" }}>{error}</div>;
    }

    return (
        <div className="product-details-container">

            <h1><strong>{product.model}</strong></h1>

            <div className="product-details-image">

            {product.image ? (
                <img
                    src={`data:;base64,${product.image}`}
                    alt={product.model}
                />
            ) : (
                <div>Unable to load image</div>
            )}
            </div>

            <h2>Details:</h2>

            <div className="product-details">
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Brand:</strong> {product.brand}</p>
                <p><strong>Colour:</strong> {product.colour}</p>
                <p><strong>Energy Rating:</strong> {product.energy_rating}</p>
                <p><strong>Release Date:</strong> {new Date(product.release_date).toLocaleDateString()}</p>
                <p><strong>Price:</strong> €{product.price.toFixed(2)}</p>
                <p><strong>Description:</strong> {product.description}</p>

            </div>

            <div className="prod-det-but">
                <button className="action-button">Add to Cart</button>
                <Link to="/products" className="action-button">Back</Link>
            </div>

        </div>
    );
};