import { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductCard } from './ProductCard';

export const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [orderSearchTerm, setOrderSearchTerm] = useState('');
    const [orderSortBy, setOrderSortBy] = useState('date');
    const [orderSortOrder, setOrderSortOrder] = useState('desc');
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
    const [modalItem, setModalItem] = useState(null);
    const [modalType, setModalType] = useState('');
    const [orderProducts, setOrderProducts] = useState([]);

    const API_URL = 'http://localhost:4000/api';

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/orders`, {
                headers: { authorization: localStorage.token }
            });
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const { data } = await axios.put(`${API_URL}/orders/${orderId}`, 
                { status: newStatus },
                {
                    headers: { authorization: localStorage.token }
                }
            );
            console.log('Updated order status:', data);
            fetchOrders();
        } catch (err) {
            console.error('Error updating order status:', err);
        }
    };

    const openModal = async (item, type) => {
        setModalItem(item);
        setModalType(type);

        if (type === 'order' && item.products) {
            try {
                const productIds = item.products.map(p => typeof p === 'string' ? p : p._id);
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
        setModalItem(null);
        setModalType('');
    };

    const filterAndSortOrders = () => {
        let filtered = [...orders];

        // Filter by search term
        if (orderSearchTerm) {
            filtered = filtered.filter(order => 
                order._id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                order.fname.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                order.lname.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                order.email.toLowerCase().includes(orderSearchTerm.toLowerCase())
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
                case 'customer':
                    aValue = `${a.fname} ${a.lname}`.toLowerCase();
                    bValue = `${b.fname} ${b.lname}`.toLowerCase();
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

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterAndSortOrders();
    }, [orders, orderSearchTerm, orderSortBy, orderSortOrder, orderStatusFilter]);

    return (
        <>
            <section className="section-card">
            <h2 className="section-title">Orders</h2>
            <div className="orders-controls">
                <div className="search-filter-row">
                    <input
                        type="text"
                        placeholder="Search orders..."
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
                        <option value="customer">Sort by Customer</option>
                    </select>
                    <button
                        onClick={() => setOrderSortOrder(orderSortOrder === 'asc' ? 'desc' : 'asc')}
                        className="sort-order-btn"
                    >
                        {orderSortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                    <button onClick={fetchOrders} className="refresh-button">
                        Refresh Orders
                    </button>
                </div>
            </div>

            {filteredOrders?.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <>
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Email</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredOrders?.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.fname} {order.lname}</td>
                                <td>{order.email}</td>
                                <td>${order.total_gross}</td>
                                <td>
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        onClick={() => openModal(order, 'order')}
                                        className="action-button"
                                    >
                                        View
                                    </button>
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="card-grid">
                        {filteredOrders?.map((order) => (
                            <div key={order._id} className="data-card">
                                <div className="card-title">Order #{order._id.slice(-8)}</div>
                                <div className="card-field">
                                    <span className="card-field-label">Customer:</span>
                                    <span className="card-field-value">{order.fname} {order.lname}</span>
                                </div>
                                <div className="card-field">
                                    <span className="card-field-label">Email:</span>
                                    <span className="card-field-value">{order.email}</span>
                                </div>
                                <div className="card-field">
                                    <span className="card-field-label">Total:</span>
                                    <span className="card-field-value">${order.total_gross}</span>
                                </div>
                                <div className="card-field">
                                    <span className="card-field-label">Status:</span>
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="card-actions">
                                    <button
                                        onClick={() => openModal(order, 'order')}
                                        className="action-button"
                                    >
                                        View Details
                                    </button>
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Returned">Returned</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>

        {modalItem && (
            <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2 className="modal-title">
                            {modalType === 'order' ? 'Order Details' : 'Item Details'}
                        </h2>
                        <button className="modal-close" onClick={closeModal}>
                            ×
                        </button>
                    </div>
                    <div className="modal-body">
                        {modalType === 'order' ? (
                            <>
                                <div className="modal-field">
                                    <span className="modal-field-label">Order ID:</span>
                                    <span className="modal-field-value">{modalItem._id}</span>
                                </div>
                                <div className="modal-field">
                                    <span className="modal-field-label">Customer Name:</span>
                                    <span className="modal-field-value">{modalItem.fname} {modalItem.lname}</span>
                                </div>
                                <div className="modal-field">
                                    <span className="modal-field-label">Email:</span>
                                    <span className="modal-field-value">{modalItem.email}</span>
                                </div>
                                <div className="modal-field">
                                    <span className="modal-field-label">Status:</span>
                                    <span className="modal-field-value">{modalItem.status}</span>
                                </div>
                                <div className="modal-field">
                                    <span className="modal-field-label">Total Net:</span>
                                    <span className="modal-field-value">${modalItem.total_net}</span>
                                </div>
                                <div className="modal-field">
                                    <span className="modal-field-label">Delivery Cost:</span>
                                    <span className="modal-field-value">${modalItem.delivery_cost}</span>
                                </div>
                                <div className="modal-field">
                                    <span className="modal-field-label">Total Gross:</span>
                                    <span className="modal-field-value">${modalItem.total_gross}</span>
                                </div>
                                <div className="modal-field">
                                    <span className="modal-field-label">Address:</span>
                                    <span className="modal-field-value">
                                        {modalItem.address_line_1}, {modalItem.address_line_2 && modalItem.address_line_2 + ', '}
                                        {modalItem.postcode}, {modalItem.county}, {modalItem.country}
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
                                {modalItem.paypalPaymentID && (
                                    <div className="modal-field">
                                        <span className="modal-field-label">PayPal Payment ID:</span>
                                        <span className="modal-field-value">{modalItem.paypalPaymentID}</span>
                                    </div>
                                )}
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        )}
        </>
    );
};
