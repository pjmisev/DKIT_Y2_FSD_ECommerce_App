import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {Link} from "react-router";

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
        <div style={{ padding: "20px" }}>#

            <h1>{product.model}</h1>
            {product.image ? (
                <img
                    src={`data:;base64,${product.image}`}
                    alt={product.model}
                    style={{ width: "100%", maxWidth: "400px", height: "auto", objectFit: "contain" }}
                />
            ) : (
                <div>Unable to load image</div>
            )}
            <p>Category: {product.category}</p>
            <p>Brand: {product.brand}</p>
            <p>Colour: {product.colour}</p>
            <p>Energy Rating: {product.energy_rating}</p>
            <p>Release Date: {new Date(product.release_date).toLocaleDateString()}</p>
            <p>Price: €{product.price.toFixed(2)}</p>
            <p>Description: {product.description}</p>
            <button className="action-button">Add to Cart</button>
            <Link to="/products" className="action-button">Back</Link>
        </div>
    );
};