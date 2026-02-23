import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export const DisplayProduct = () => {
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null); // State to store product details
    const [isLoading, setIsLoading] = useState(true); // State for loading indicator
    const [error, setError] = useState(""); // State for error handling

    const API_URL = "http://localhost:4000/api"; // Backend API URL for fetching products

    useEffect(() => {
        // Fetch product details by ID
        axios
            .get(`${API_URL}/products/${id}`)
            .then((response) => {
                setProduct(response.data); // Store product details in state
                setError(""); // Clear any previous errors
            })
            .catch((err) => {
                console.error("Error fetching product details:", err);
                setError("Failed to fetch product details. Please try again later.");
            })
            .finally(() => {
                setIsLoading(false); // Stop loading
            });
    }, [id]); // Re-run when ID changes

    if (isLoading) {
        return <div>Loading product details...</div>;
    }

    if (error) {
        return <div style={{ color: "red" }}>{error}</div>;
    }

    // Render product details
    return (
        <div style={{ padding: "20px" }}>
            <h1>{product.model}</h1>
            {product.image ? (
                <img
                    src={`data:;base64,${product.image}`}
                    alt={product.model}
                    style={{ width: "100%", maxWidth: "400px", height: "auto", objectFit: "contain" }}
                />
            ) : (
                <img
                    src="/images/placeholder.jpg"
                    alt="Placeholder"
                    style={{ width: "100%", maxWidth: "400px" }}
                />
            )}
            <p>Category: {product.category}</p>
            <p>Brand: {product.brand}</p>
            <p>Colour: {product.colour}</p>
            <p>Energy Rating: {product.energy_rating}</p>
            <p>Release Date: {new Date(product.release_date).toLocaleDateString()}</p>
            <p>Price: €{product.price.toFixed(2)}</p>
            <p>Description: {product.description}</p>
        </div>
    );
};