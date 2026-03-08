import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { AdminProducts } from './AdminProducts';
import { AdminUsers } from './AdminUsers';
import { AdminOrders } from './AdminOrders';

export const Admin = props => {
    const [activeTab, setActiveTab] = useState('products');
    const [modalItem, setModalItem] = useState(null);
    const [modalType, setModalType] = useState('');
    const [confirmationModal, setConfirmationModal] = useState(null);

    const closeConfirmationModal = () => {
        setConfirmationModal(null);
    };

    const closeModal = () => {
        setModalItem(null);
        setModalType('');
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">Admin Panel</h1>

            <div className="tab-container">
                <button 
                    className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    Products
                </button>
                <button 
                    className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
                <button 
                    className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Orders
                </button>
            </div>

            {activeTab === 'products' && (
                <AdminProducts 
                    setModalItem={setModalItem}
                    setModalType={setModalType}
                    closeConfirmationModal={closeConfirmationModal}
                    setConfirmationModal={setConfirmationModal}
                />
            )}

            {activeTab === 'users' && (
                <AdminUsers 
                    setModalItem={setModalItem}
                    setModalType={setModalType}
                    closeConfirmationModal={closeConfirmationModal}
                    setConfirmationModal={setConfirmationModal}
                />
            )}

            {activeTab === 'orders' && (
                <AdminOrders />
            )}

            {/* View Modals */}
            {modalItem && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {modalType === 'product' ? 'Product Details' : 
                                 modalType === 'user' ? 'User Details' : 'Item Details'}
                            </h2>
                            <button className="modal-close" onClick={closeModal}>
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            {modalType === 'product' ? (
                                <div className="modal-view-layout">
                                    <div className="modal-section">
                                        <h3 className="modal-section-title">Basic Information</h3>
                                        <div className="modal-field-grid">
                                            <div className="modal-field">
                                                <span className="modal-field-label">Product ID:</span>
                                                <span className="modal-field-value">{modalItem._id}</span>
                                            </div>
                                            <div className="modal-field">
                                                <span className="modal-field-label">Category:</span>
                                                <span className="modal-field-value">{modalItem.category}</span>
                                            </div>
                                            <div className="modal-field">
                                                <span className="modal-field-label">Brand:</span>
                                                <span className="modal-field-value">{modalItem.brand}</span>
                                            </div>
                                            <div className="modal-field">
                                                <span className="modal-field-label">Model:</span>
                                                <span className="modal-field-value">{modalItem.model}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="modal-section">
                                        <h3 className="modal-section-title">Details</h3>
                                        <div className="modal-field-grid">
                                            <div className="modal-field modal-field-full">
                                                <span className="modal-field-label">Description:</span>
                                                <span className="modal-field-value">{modalItem.description}</span>
                                            </div>
                                            <div className="modal-field">
                                                <span className="modal-field-label">Colour:</span>
                                                <span className="modal-field-value">{modalItem.colour}</span>
                                            </div>
                                            <div className="modal-field">
                                                <span className="modal-field-label">Release Date:</span>
                                                <span className="modal-field-value">{modalItem.release_date}</span>
                                            </div>
                                            <div className="modal-field">
                                                <span className="modal-field-label">Energy Rating:</span>
                                                <span className="modal-field-value">{modalItem.energy_rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="modal-section">
                                        <h3 className="modal-section-title">Pricing & Stock</h3>
                                        <div className="modal-field-grid">
                                            <div className="modal-field">
                                                <span className="modal-field-label">Price:</span>
                                                <span className="modal-field-value modal-price">€{modalItem.price}</span>
                                            </div>
                                            <div className="modal-field">
                                                <span className="modal-field-label">Stock Status:</span>
                                                <span className="modal-field-value">
                                                    <span className={`status-badge ${modalItem.stocking_status.toLowerCase().replace(' ', '-')}`}>
                                                        {modalItem.stocking_status}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="modal-field">
                                                <span className="modal-field-label">Stock Level:</span>
                                                <span className="modal-field-value">{modalItem.stock_level}</span>
                                            </div>
                                            <div className="modal-field">
                                                <span className="modal-field-label">Status:</span>
                                                <span className="modal-field-value">
                                                    <span className={`status-badge ${modalItem.status ? 'active' : 'inactive'}`}>
                                                        {modalItem.status ? 'Active' : 'Inactive'}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {modalItem.image && (
                                        <div className="modal-section">
                                            <h3 className="modal-section-title">Product Image</h3>
                                            <div className="modal-image-container">
                                                <img 
                                                    src={`data:image/png;base64,${modalItem.image}`}
                                                    alt={modalItem.model}
                                                    className="modal-product-image"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : modalType === 'user' ? (
                                <div className="modal-view-layout">
                                    <div className="modal-section">
                                        <h3 className="modal-section-title">User Information</h3>
                                        <div className="modal-field-grid">
                                            <div className="modal-field">
                                                <span className="modal-field-label">User ID:</span>
                                                <span className="modal-field-value">{modalItem._id}</span>
                                            </div>
                                            <div className="modal-field">
                                                <span className="modal-field-label">First Name:</span>
                                                <span className="modal-field-value">{modalItem.fname}</span>
                                            </div>
                                            <div className="modal-field">
                                                <span className="modal-field-label">Last Name:</span>
                                                <span className="modal-field-value">{modalItem.lname}</span>
                                            </div>
                                            <div className="modal-field">
                                                <span className="modal-field-label">Email:</span>
                                                <span className="modal-field-value">{modalItem.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="modal-section">
                                        <h3 className="modal-section-title">Account Details</h3>
                                        <div className="modal-field-grid">
                                            <div className="modal-field">
                                                <span className="modal-field-label">Access Level:</span>
                                                <span className="modal-field-value">
                                                    <span className={`status-badge ${modalItem.accessLevel === 2 ? 'admin' : 'user'}`}>
                                                        {modalItem.accessLevel === 2 ? 'Admin' : 'User'}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="modal-field">
                                                <span className="modal-field-label">Status:</span>
                                                <span className="modal-field-value">
                                                    <span className={`status-badge ${modalItem.status ? 'active' : 'inactive'}`}>
                                                        {modalItem.status ? 'Active' : 'Inactive'}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="modal-field">
                                                <span className="modal-field-label">Date Created:</span>
                                                <span className="modal-field-value">{new Date(modalItem.date_created).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {modalItem.image && (
                                        <div className="modal-section">
                                            <h3 className="modal-section-title">Profile Picture</h3>
                                            <div className="modal-image-container">
                                                <img 
                                                    src={`data:image/*;base64,${modalItem.image}`}
                                                    alt={`${modalItem.fname} ${modalItem.lname}`}
                                                    className="modal-profile-image"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : modalType === 'order' ? (
                                <div className="modal-view-layout">
                                    <div className="modal-section">
                                        <h3 className="modal-section-title">Order Information</h3>
                                        <div className="modal-field-grid">
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
                                                <span className="modal-field-value">
                                                    <span className={`status-badge ${modalItem.status.toLowerCase()}`}>
                                                        {modalItem.status}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="modal-field">
                                                <span className="modal-field-label">Date:</span>
                                                <span className="modal-field-value">{new Date(modalItem.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="modal-section">
                                        <h3 className="modal-section-title">Pricing Details</h3>
                                        <div className="modal-field-grid">
                                            <div className="modal-field">
                                                <span className="modal-field-label">Subtotal:</span>
                                                <span className="modal-field-value">€{modalItem.total_net}</span>
                                            </div>
                                            <div className="modal-field">
                                                <span className="modal-field-label">Delivery Cost:</span>
                                                <span className="modal-field-value">€{modalItem.delivery_cost}</span>
                                            </div>
                                            <div className="modal-field">
                                                <span className="modal-field-label">Total Gross:</span>
                                                <span className="modal-field-value modal-price">€{modalItem.total_gross}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="modal-section">
                                        <h3 className="modal-section-title">Delivery Address</h3>
                                        <div className="modal-field-grid">
                                            <div className="modal-field modal-field-full">
                                                <span className="modal-field-label">Address:</span>
                                                <span className="modal-field-value">
                                                    {modalItem.address_line_1}, {modalItem.address_line_2 && modalItem.address_line_2 + ', '}
                                                    {modalItem.postcode}, {modalItem.county}, {modalItem.country}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="modal-section">
                                        <h3 className="modal-section-title">Products</h3>
                                        <div className="order-products-modal-list">
                                            {modalItem.products?.map((product, index) => (
                                                <div key={index} className="order-product-item">
                                                    <div className="order-product-info">
                                                        <strong>{product.brand} {product.model}</strong>
                                                        <span>€{product.price}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {modalItem.paypalPaymentID && (
                                        <div className="modal-section">
                                            <h3 className="modal-section-title">Payment Information</h3>
                                            <div className="modal-field-grid">
                                                <div className="modal-field">
                                                    <span className="modal-field-label">PayPal Payment ID:</span>
                                                    <span className="modal-field-value">{modalItem.paypalPaymentID}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmationModal && (
                <div className="modal-overlay" onClick={() => setConfirmationModal(null)}>
                    <div className="confirmation-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="confirmation-modal-title">{confirmationModal.title}</h2>
                        <p className="confirmation-modal-message">{confirmationModal.message}</p>
                        <div className="confirmation-modal-actions">
                            <button 
                                onClick={confirmationModal.onConfirm}
                                className="primary-button"
                            >
                                Confirm
                            </button>
                            <button 
                                onClick={() => setConfirmationModal(null)}
                                className="tertiary-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}