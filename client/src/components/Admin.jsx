import { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductCard } from './ProductCard';
import { AdminProducts } from './AdminProducts';
import { AdminUsers } from './AdminUsers';
import { AdminOrders } from './AdminOrders';

export const Admin = props => {
    const [activeTab, setActiveTab] = useState('products');
    const [modalItem, setModalItem] = useState(null);
    const [modalType, setModalType] = useState('');
    const [confirmationModal, setConfirmationModal] = useState({
        show: false,
        title: '',
        message: '',
        onConfirm: null
    });

    const openModal = (item, type) => {
        setModalItem(item);
        setModalType(type);
    };

    const closeModal = () => {
        setModalItem(null);
        setModalType('');
    };

    const closeConfirmationModal = () => {
        setConfirmationModal({ show: false, title: '', message: '', onConfirm: null });
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
                    openModal={openModal}
                    setModalItem={setModalItem}
                    setModalType={setModalType}
                    confirmationModal={confirmationModal}
                    closeConfirmationModal={closeConfirmationModal}
                />
            )}

            {activeTab === 'users' && (
                <AdminUsers 
                    openModal={openModal}
                    setModalItem={setModalItem}
                    setModalType={setModalType}
                    confirmationModal={confirmationModal}
                    closeConfirmationModal={closeConfirmationModal}
                />
            )}

            {activeTab === 'orders' && (
                <AdminOrders 
                    openModal={openModal}
                    setModalItem={setModalItem}
                    setModalType={setModalType}
                />
            )}

            {modalItem && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {modalType === 'product' ? 'Product Details' : 
                                 modalType === 'user' ? 'User Details' : 'Order Details'}
                            </h2>
                            <button className="modal-close" onClick={closeModal}>
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            {modalType === 'product' ? (
                                <>
                                    <div className="modal-field">
                                        <span className="modal-field-label">ID:</span>
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
                                    <div className="modal-field">
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
                                    <div className="modal-field">
                                        <span className="modal-field-label">Price:</span>
                                        <span className="modal-field-value">${modalItem.price}</span>
                                    </div>
                                    <div className="modal-field">
                                        <span className="modal-field-label">Status:</span>
                                        <span className="modal-field-value">{modalItem.status ? 'Active' : 'Inactive'}</span>
                                    </div>
                                    <div className="modal-field">
                                        <span className="modal-field-label">Stocking Status:</span>
                                        <span className="modal-field-value">{modalItem.stocking_status}</span>
                                    </div>
                                    <div className="modal-field">
                                        <span className="modal-field-label">Stock Level:</span>
                                        <span className="modal-field-value">{modalItem.stock_level}</span>
                                    </div>
                                </>
                            ) : modalType === 'user' ? (
                                <>
                                    <div className="modal-field">
                                        <span className="modal-field-label">ID:</span>
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
                                    <div className="modal-field">
                                        <span className="modal-field-label">Access Level:</span>
                                        <span className="modal-field-value">{modalItem.accessLevel === 2 ? 'Admin' : 'User'}</span>
                                    </div>
                                    <div className="modal-field">
                                        <span className="modal-field-label">Status:</span>
                                        <span className="modal-field-value">{modalItem.status ? 'Active' : 'Inactive'}</span>
                                    </div>
                                    <div className="modal-field">
                                        <span className="modal-field-label">Date Created:</span>
                                        <span className="modal-field-value">{new Date(modalItem.date_created).toLocaleString()}</span>
                                    </div>
                                </>
                            ) : modalType === 'order' ? (
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
                                            {modalItem.products?.map((product, index) => (
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

            {confirmationModal.show && (
                <div className="modal-overlay" onClick={closeConfirmationModal}>
                    <div className="confirmation-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="confirmation-modal-title">{confirmationModal.title}</h2>
                        <p className="confirmation-modal-message">{confirmationModal.message}</p>
                        <div className="confirmation-modal-actions">
                            <button
                                onClick={() => {
                                    if (confirmationModal.onConfirm) {
                                        confirmationModal.onConfirm();
                                    }
                                }}
                                className="primary-button"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={closeConfirmationModal}
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