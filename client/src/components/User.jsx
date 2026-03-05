import {useEffect, useState} from "react";
import axios from "axios";

export const User = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

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

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.match('image.*')) {
            setUploadError("Please select an image file (PNG, JPG, JPEG)");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError("File size must be less than 5MB");
            return;
        }

        setUploading(true);
        setUploadError("");

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post(`${API_URL}/user/upload-image`, formData, {
                headers: {
                    'authorization': localStorage.token,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setUser(response.data);
        } catch (err) {
            setUploadError(err.response?.data?.message || "Failed to upload image");
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div className="user-container">
            <div className="profile-content">
                <div className="profile-image">
                    {user?.image ? (
                        <img className="pf-img"
                            src={`data:image/jpeg;base64,${user.image}`}
                            alt="Profile"
                        />
                    ) : (
                        <div className="letter-img">
                            {user?.fname?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    )}
                    
                    <label htmlFor="image-upload" className="img-upl">
                        {uploading ? "..." : "📷"}
                    </label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        style={{ display: "none" }}
                    />
                </div>
                
                <div>
                    <h1>Welcome, {user?.fname}</h1>
                    <p>{user?.email}</p>
                </div>
            </div>

            {uploadError && (
                <div className="upload-error">
                    {uploadError}
                </div>
            )}

            {uploading && (
                <div className="uploading-image">
                    Uploading image...
                </div>
            )}
        </div>
    );
};