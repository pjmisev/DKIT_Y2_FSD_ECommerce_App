import { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductCard } from './ProductCard';
import { AdminProducts } from './AdminProducts';
import { AdminUsers } from './AdminUsers';
import { AdminOrders } from './AdminOrders';

export const Admin = props => {
    const [activeTab, setActiveTab] = useState('products');
    const [selectedId, setSelectedId] = useState('');
    const [singleProduct, setSingleProduct] = useState(null);
    const [modalItem, setModalItem] = useState(null);
    const [modalType, setModalType] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [formType, setFormType] = useState('product');
    const [confirmationModal, setConfirmationModal] = useState({
        show: false,
        title: '',
        message: '',
        onConfirm: null
    });
    const [formData, setFormData] = useState({
        category: '',
        brand: '',
        model: '',
        description: '',
        colour: '',
        release_date: '',
        energy_rating: '',
        price: '',
        status: true,
        stocking_status: 'In Stock',
        stock_level: 0
    });
    const [userFormData, setUserFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        password: '',
        accessLevel: 1,
        status: true
    });

    const API_URL = 'http://localhost:4000/api';

    const fetchProductById = async () => {
        if (!selectedId) return;
        try {
            const { data } = await axios.get(`${API_URL}/products/${selectedId}`);
            setSingleProduct(data);
        } catch (err) {
            console.error('Error fetching product:', err);
        }
    };

    const handleFileChange = e => {
        setSelectedFile(e.target.files[0]);
    };

    const [selectedFile, setSelectedFile] = useState(null);

    const openModal = (item, type) => {
        setModalItem(item);
        setModalType(type);
    };

    const closeModal = () => {
        setModalItem(null);
        setModalType('');
    };

    const closeFormModal = () => {
        setShowFormModal(false);
        setSelectedId('');
        setSelectedFile(null);
    };

    const closeConfirmationModal = () => {
        setConfirmationModal({ show: false, title: '', message: '', onConfirm: null });
    };

    useEffect(() => {
        fetchProductById();
    }, [selectedId]);

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
                    setShowFormModal={setShowFormModal}
                    setFormMode={setFormMode}
                    setFormType={setFormType}
                    setSelectedId={setSelectedId}
                    setFormData={setFormData}
                    confirmationModal={confirmationModal}
                    closeConfirmationModal={closeConfirmationModal}
                />
            )}

            {activeTab === 'users' && (
                <AdminUsers 
                    openModal={openModal}
                    setModalItem={setModalItem}
                    setModalType={setModalType}
                    setShowFormModal={setShowFormModal}
                    setFormMode={setFormMode}
                    setFormType={setFormType}
                    setSelectedId={setSelectedId}
                    setUserFormData={setUserFormData}
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

            {showFormModal && (
                <div className="modal-overlay" onClick={closeFormModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {formType === 'product' 
                                    ? (formMode === 'edit' ? `UPDATE Product (ID: ${selectedId})` : 'CREATE New Product')
                                    : (formMode === 'edit' ? `UPDATE User (ID: ${selectedId})` : 'CREATE New User')
                                }
                            </h2>
                            <button className="modal-close" onClick={closeFormModal}>
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            {formType === 'product' ? (
                                <form onSubmit={formMode === 'create' ? createProduct : updateProduct} className="form-modal-grid">
                                    <input
                                        placeholder="Category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="form-input"
                                    />
                                    <input
                                        placeholder="Brand"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                                        className="form-input"
                                    />
                                    <input
                                        placeholder="Model"
                                        value={formData.model}
                                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                                        className="form-input"
                                    />
                                    <input
                                        placeholder="Description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="form-input"
                                    />
                                    <input
                                        placeholder="Colour"
                                        value={formData.colour}
                                        onChange={(e) => setFormData({...formData, colour: e.target.value})}
                                        className="form-input"
                                    />
                                    <input
                                        placeholder="Release Date (YYYY-MM-DD)"
                                        value={formData.release_date}
                                        onChange={(e) => setFormData({...formData, release_date: e.target.value})}
                                        className="form-input"
                                    />
                                    <input
                                        placeholder="Energy Rating (A-G)"
                                        value={formData.energy_rating}
                                        onChange={(e) => setFormData({...formData, energy_rating: e.target.value})}
                                        className="form-input"
                                    />
                                    <input
                                        placeholder="Price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        className="form-input"
                                    />
                                    <select
                                        value={formData.stocking_status}
                                        onChange={(e) => setFormData({...formData, stocking_status: e.target.value})}
                                        className="form-select"
                                    >
                                        <option value="In Stock">In Stock</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                        <option value="Limited Stock">Limited Stock</option>
                                    </select>
                                    <input
                                        placeholder="Stock Level"
                                        type="number"
                                        value={formData.stock_level}
                                        onChange={(e) => setFormData({...formData, stock_level: parseInt(e.target.value) || 0})}
                                        className="form-input"
                                    />
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="form-input"
                                        style={{ gridColumn: '1 / -1' }}
                                    />
                                    <div className="form-modal-actions">
                                        <button type="submit" className="primary-button">
                                            {formMode === 'create' ? 'Create Product' : 'Update Product'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeFormModal}
                                            className="tertiary-button"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={formMode === 'create' ? createUser : updateUser} className="form-modal-grid">
                                    <input
                                        placeholder="First Name"
                                        value={userFormData.fname}
                                        onChange={(e) => setUserFormData({...userFormData, fname: e.target.value})}
                                        className="form-input"
                                    />
                                    <input
                                        placeholder="Last Name"
                                        value={userFormData.lname}
                                        onChange={(e) => setUserFormData({...userFormData, lname: e.target.value})}
                                        className="form-input"
                                    />
                                    <input
                                        placeholder="Email"
                                        type="email"
                                        value={userFormData.email}
                                        onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                                        className="form-input"
                                        style={{ gridColumn: '1 / -1' }}
                                    />
                                    <input
                                        placeholder="Password"
                                        type="password"
                                        value={userFormData.password}
                                        onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                                        className="form-input"
                                        style={{ gridColumn: '1 / -1' }}
                                    />
                                    <select
                                        value={userFormData.accessLevel}
                                        onChange={(e) => setUserFormData({...userFormData, accessLevel: parseInt(e.target.value)})}
                                        className="form-select"
                                    >
                                        <option value={1}>User</option>
                                        <option value={2}>Admin</option>
                                    </select>
                                    <select
                                        value={userFormData.status}
                                        onChange={(e) => setUserFormData({...userFormData, status: e.target.value === 'true'})}
                                        className="form-select"
                                    >
                                        <option value={true}>Active</option>
                                        <option value={false}>Inactive</option>
                                    </select>
                                    <div className="form-modal-actions">
                                        <button type="submit" className="primary-button">
                                            {formMode === 'create' ? 'Create User' : 'Update User'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeFormModal}
                                            className="tertiary-button"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
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