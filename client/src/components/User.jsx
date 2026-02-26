import {useEffect, useState} from "react";
import axios from "axios";

export const User = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const API_URL = "http://localhost:4000/api";

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${API_URL}/user`, {
                    headers: {
                        authorization: localStorage.token
                    }
                });

                setUser(response.data);
                setIsLoading(false);
            } catch (err) {
                setError("Failed to load user profile");
                setIsLoading(false);
                console.error('Error:', err);
            }
        };

        if (localStorage.token) {
            fetchUserData();
        } else {
            setError("No token found, please log in.");
            setIsLoading(false);
        }
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div style={{ padding: "20px" }}>
            {/* user is an object, so we access fname */}
            <h1>Welcome, {user?.fname}</h1>
        </div>
    );
};