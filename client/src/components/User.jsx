import {useEffect, useState} from "react";
import axios from "axios";
import { ProductCard } from './ProductCard';

export const User = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [orderSearchTerm, setOrderSearchTerm] = useState('');
    const [orderSortBy, setOrderSortBy] = useState('date');
    const [orderSortOrder, setOrderSortOrder] = useState('desc');
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderProducts, setOrderProducts] = useState([]);
    const [returningOrder, setReturningOrder] = useState(false);
    const [returnMessage, setReturnMessage] = useState("");

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

        const fetchUserOrders = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/orders`, {
                    headers: {
                        authorization: localStorage.token
                    }
                });

                setOrders(response.data);
            } catch (err) {
                console.error('Error fetching orders:', err);
            }
        };

        if (localStorage.token) {
            fetchUserData();
            fetchUserOrders();
        } else {
            setError("No token found, please log in.");
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        filterAndSortOrders();
    }, [orders, orderSearchTerm, orderSortBy, orderSortOrder, orderStatusFilter]);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.match('image.*')) {
            setUploadError("Please select an image file (PNG, JPG, JPEG)");
            return;
        }

        // Validate file size (max 3MB)
        if (file.size > 3 * 1024 * 1024) {
            setUploadError("File size must be less than 3MB");
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
            localStorage.setItem("userImage", response.data.image);
            window.dispatchEvent(new Event("storage"));

        } catch (err) {
            setUploadError(err.response?.data?.message || "Failed to upload image");
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const openOrderModal = async (order) => {
        setSelectedOrder(order);
        setReturnMessage("");
        
        // Fetch product details for the order
        if (order.products) {
            try {
                const productIds = order.products.map(p => typeof p === 'string' ? p : p._id);
                const { data } = await axios.post(`${API_URL}/products/by-ids`, { productIds }, {
                    headers: { authorization: localStorage.token }
                });
                setOrderProducts(data);
            } catch (err) {
                console.error('Error fetching product details:', err);
                setOrderProducts([]);
            }
        } else {
            setOrderProducts([]);
        }
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setReturnMessage("");
    };

    const handleReturnOrder = async (orderId) => {
        setReturningOrder(true);
        setReturnMessage("");
        
        try {
            const response = await axios.post(`${API_URL}/orders/${orderId}/return`, {}, {
                headers: {
                    authorization: localStorage.token
                }
            });
            
            if (response.data.success) {
                setReturnMessage("Order returned successfully! Stock has been restored.");
                // Update the order in the local state
                setOrders(orders.map(order => 
                    order._id === orderId 
                        ? {...order, status: "Returned"}
                        : order
                ));
                // Update the selected order
                setSelectedOrder({...selectedOrder, status: "Returned"});
            } else {
                setReturnMessage("Failed to process return. Please try again.");
            }
        } catch (err) {
            setReturnMessage(err.response?.data?.message || "An error occurred while processing the return.");
        } finally {
            setReturningOrder(false);
        }
    };

    const filterAndSortOrders = () => {
        let filtered = [...orders];

        // Filter by search term
        if (orderSearchTerm) {
            filtered = filtered.filter(order => 
                order._id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                order.status.toLowerCase().includes(orderSearchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (orderStatusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === orderStatusFilter);
        }

        // Sort orders
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (orderSortBy) {
                case 'date':
                    aValue = new Date(a.createdAt || 0);
                    bValue = new Date(b.createdAt || 0);
                    break;
                case 'total':
                    aValue = a.total_gross || 0;
                    bValue = b.total_gross || 0;
                    break;
                case 'status':
                    aValue = a.status || '';
                    bValue = b.status || '';
                    break;
                default:
                    return 0;
            }

            if (orderSortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredOrders(filtered);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div className="user-container">

            <div className="profile-content">
                <div>

                    <div className="profile-image">

                        <h1>Welcome, {user?.fname} {user?.lname}</h1>

                        <div className="flex-pfp">
                        {user?.image ? (
                            <img className="pf-img"
                                 src={`data:image/*;base64,${user.image}`}
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
                    </div>

                    <h2>Account Details:</h2>
                    <p>Name: {user?.fname} {user?.lname}</p>
                    <p>Email: {user?.email}</p>

                    {/*<p>Date of Creation: {user.date_created}</p>*/}


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

            {/* Orders Section */}
            <div className="user-orders-section">
                <h2>Your Orders</h2>
                <div className="orders-controls">
                    <div className="search-filter-row">
                        <input
                            type="text"
                            placeholder="Search your orders..."
                            value={orderSearchTerm}
                            onChange={(e) => setOrderSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <select
                            value={orderStatusFilter}
                            onChange={(e) => setOrderStatusFilter(e.target.value)}
                            className="form-select"
                        >
                            <option value="all">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Returned">Returned</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="sort-controls">
                        <select
                            value={orderSortBy}
                            onChange={(e) => setOrderSortBy(e.target.value)}
                            className="form-select"
                        >
                            <option value="date">Sort by Date</option>
                            <option value="total">Sort by Total</option>
                            <option value="status">Sort by Status</option>
                        </select>
                        <button
                            onClick={() => setOrderSortOrder(orderSortOrder === 'asc' ? 'desc' : 'asc')}
                            className="sort-order-btn"
                        >
                            {orderSortOrder === 'asc' ? '↑' : '↓'}
                        </button>
                    </div>
                </div>
                {filteredOrders?.length === 0 ? (
                    <p>{orders?.length === 0 ? "You haven't placed any orders yet." : "No orders found matching your criteria."}</p>
                ) : (
                    <div className="orders-grid">
                        {filteredOrders?.map((order) => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <h3>Order #{order._id.slice(-8)}</h3>
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="order-info">
                                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p><strong>Total:</strong> ${order.total_gross}</p>
                                    <p><strong>Items:</strong> {order.products?.length || 0}</p>
                                </div>
                                <button 
                                    onClick={() => openOrderModal(order)}
                                    className="action-button"
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Order Details</h2>
                            <button className="modal-close" onClick={closeModal}>
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-field">
                                <span className="modal-field-label">Order ID:</span>
                                <span className="modal-field-value">{selectedOrder._id}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-field-label">Customer Name:</span>
                                <span className="modal-field-value">{selectedOrder.fname} {selectedOrder.lname}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-field-label">Email:</span>
                                <span className="modal-field-value">{selectedOrder.email}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-field-label">Status:</span>
                                <span className="modal-field-value">{selectedOrder.status}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-field-label">Total Net:</span>
                                <span className="modal-field-value">${selectedOrder.total_net}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-field-label">Delivery Cost:</span>
                                <span className="modal-field-value">${selectedOrder.delivery_cost}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-field-label">Total Gross:</span>
                                <span className="modal-field-value">${selectedOrder.total_gross}</span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-field-label">Address:</span>
                                <span className="modal-field-value">
                                            {selectedOrder.address_line_1}, {selectedOrder.address_line_2 && selectedOrder.address_line_2 + ', '}
                                    {selectedOrder.postcode}, {selectedOrder.county}, {selectedOrder.country}
                                        </span>
                            </div>
                            <div className="modal-field">
                                <span className="modal-field-label">Products:</span>
                                <div className="order-products-grid">
                                    {orderProducts.map((product, index) => (
                                        <div key={index} className="order-product-card-wrapper">
                                            <ProductCard product={product} addToCart={() => {}} />
                                            <div className="order-product-price-overlay">
                                                ${product.price}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {selectedOrder.paypalPaymentID && (
                                <div className="modal-field">
                                    <span className="modal-field-label">PayPal Payment ID:</span>
                                    <span className="modal-field-value">{selectedOrder.paypalPaymentID}</span>
                                </div>
                            )}
                            {returnMessage && (
                                <div className={returnMessage.includes('successfully') ? '' : 'upload-error'} 
                                     style={returnMessage.includes('successfully') ? {color: '#4caf50', padding: '10px', textAlign: 'center'} : {}}>
                                    {returnMessage}
                                </div>
                            )}
                            {(selectedOrder.status === "Paid" || selectedOrder.status === "Delivered") && (
                                <div className="modal-actions">
                                    <button
                                        onClick={() => handleReturnOrder(selectedOrder._id)}
                                        disabled={returningOrder}
                                        className="delete-button"
                                    >
                                        {returningOrder ? "Processing Return..." : "Return Order"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};