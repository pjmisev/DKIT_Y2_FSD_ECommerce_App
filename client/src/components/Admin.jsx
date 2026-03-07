import { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductCard } from './ProductCard';

export const Admin = props => {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const [productSortBy, setProductSortBy] = useState('model');
    const [productSortOrder, setProductSortOrder] = useState('asc');
    const [productCategoryFilter, setProductCategoryFilter] = useState('all');
    const [productStatusFilter, setProductStatusFilter] = useState('all');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [userSortBy, setUserSortBy] = useState('name');
    const [userSortOrder, setUserSortOrder] = useState('asc');
    const [userAccessLevelFilter, setUserAccessLevelFilter] = useState('all');
    const [userStatusFilter, setUserStatusFilter] = useState('all');
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [orderSearchTerm, setOrderSearchTerm] = useState('');
    const [orderSortBy, setOrderSortBy] = useState('date');
    const [orderSortOrder, setOrderSortOrder] = useState('desc');
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
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

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/products`);
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/users`, {
                headers: { authorization: localStorage.token }
            });
            setUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

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

    const createProduct = async (e) => {
        e.preventDefault();
        const dataToSend = new FormData();

        Object.keys(formData).forEach(key => {
            dataToSend.append(key, formData[key]);
        });

        if (selectedFile) {
            dataToSend.append("image", selectedFile);
        }

        try {
            const { data } = await axios.post(`${API_URL}/products`, dataToSend, {
                headers: {
                    "authorization": localStorage.token,
                }
            });

            console.log('Created:', data);
            fetchProducts();

            setFormData({
                category: '', brand: '', model: '', description: '',
                colour: '', release_date: '', energy_rating: '', price: '',
                status: true, stocking_status: 'In Stock', stock_level: 0
            });
            setSelectedFile(null);
        } catch (err) {
            console.error('Error creating product:', err);
        }
    };

    const updateProduct = async () => {
        if (!selectedId) return;

        const dataToSend = new FormData();

        Object.keys(formData).forEach(key => {
            dataToSend.append(key, formData[key]);
        });

        if (selectedFile) {
            dataToSend.append("image", selectedFile);
        }

        try {
            const { data } = await axios.put(`${API_URL}/products/${selectedId}`, dataToSend, {
                headers: {
                    "authorization": localStorage.token
                }
            });

            console.log('Updated:', data);
            fetchProducts();
            closeFormModal();
            setSelectedFile(null);
        } catch (err) {
            console.error('Error updating product:', err);
        }
    };

    const deleteProduct = async () => {
        if (!selectedId) return;
        
        setConfirmationModal({
            show: true,
            title: 'Delete Product',
            message: 'Are you sure you want to delete this product? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    const { data } = await axios.delete(`${API_URL}/products/${selectedId}`,{
                        headers: { authorization: localStorage.token }
                    });
                    console.log('Deleted:', data);
                    fetchProducts();
                    setSelectedId('');
                    setConfirmationModal({ show: false, title: '', message: '', onConfirm: null });
                } catch (err) {
                    console.error('Error deleting product:', err);
                    setConfirmationModal({ show: false, title: '', message: '', onConfirm: null });
                }
            }
        });
    };



    const loadProductToForm = (product) => {
        setSelectedId(product._id);
        
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        };
        
        setFormData({
            category: product.category,
            brand: product.brand,
            model: product.model,
            description: product.description,
            colour: product.colour,
            release_date: formatDate(product.release_date),
            energy_rating: product.energy_rating,
            price: product.price,
            status: product.status,
            stocking_status: product.stocking_status,
            stock_level: product.stock_level
        });
        setFormMode('edit');
        setFormType('product');
        setShowFormModal(true);
    };

    const openCreateModal = () => {
        setFormData({
            category: '', brand: '', model: '', description: '',
            colour: '', release_date: '', energy_rating: '', price: '',
            status: true, stocking_status: 'In Stock', stock_level: 0
        });
        setSelectedId('');
        setFormMode('create');
        setFormType('product');
        setShowFormModal(true);
    };

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

    const createUser = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${API_URL}/users/register/${userFormData.fname}/${userFormData.lname}/${userFormData.email}/${userFormData.password}`, {
                status: userFormData.status,
                accessLevel: userFormData.accessLevel
            }, {
                headers: {
                    "authorization": localStorage.token,
                }
            });
            console.log('Created user:', data);
            fetchUsers();
            closeFormModal();
        } catch (err) {
            console.error('Error creating user:', err);
        }
    };

    const updateUser = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                fname: userFormData.fname,
                lname: userFormData.lname,
                email: userFormData.email,
                accessLevel: userFormData.accessLevel,
                status: userFormData.status
            };
            
            if (userFormData.password) {
                updateData.password = userFormData.password;
            }

            const { data } = await axios.put(`${API_URL}/users/${selectedId}`, updateData, {
                headers: {
                    "authorization": localStorage.token
                }
            });
            console.log('Updated user:', data);
            fetchUsers();
            closeFormModal();
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };

    const deleteUser = async () => {
        if (!selectedId) return;

        setConfirmationModal({
            show: true,
            title: 'Delete User',
            message: 'Are you sure you want to delete this user? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    const { data } = await axios.delete(`${API_URL}/users/${selectedId}`,
                        {
                            headers: { authorization: localStorage.token }
                        });
                    console.log('Deleted:', data);
                    fetchUsers();
                    setSelectedId('');
                    setConfirmationModal({ show: false, title: '', message: '', onConfirm: null });
                } catch (err) {
                    console.error('Error deleting user:', err);
                    setConfirmationModal({ show: false, title: '', message: '', onConfirm: null });
                }
            }
        });
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

    const filterAndSortProducts = () => {
        let filtered = [...products];

        // Filter by search term
        if (productSearchTerm) {
            filtered = filtered.filter(product => 
                product._id.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                product.brand.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                product.model.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(productSearchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (productCategoryFilter !== 'all') {
            filtered = filtered.filter(product => product.category === productCategoryFilter);
        }

        // Filter by status
        if (productStatusFilter !== 'all') {
            filtered = filtered.filter(product => 
                productStatusFilter === 'active' ? product.status : !product.status
            );
        }

        // Sort products
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (productSortBy) {
                case 'model':
                    aValue = (a.model || '').toLowerCase();
                    bValue = (b.model || '').toLowerCase();
                    break;
                case 'brand':
                    aValue = (a.brand || '').toLowerCase();
                    bValue = (b.brand || '').toLowerCase();
                    break;
                case 'category':
                    aValue = (a.category || '').toLowerCase();
                    bValue = (b.category || '').toLowerCase();
                    break;
                case 'price':
                    aValue = a.price || 0;
                    bValue = b.price || 0;
                    break;
                case 'stock':
                    aValue = a.stock_level || 0;
                    bValue = b.stock_level || 0;
                    break;
                default:
                    return 0;
            }

            if (productSortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredProducts(filtered);
    };

    const filterAndSortUsers = () => {
        let filtered = [...users];

        // Filter by search term
        if (userSearchTerm) {
            filtered = filtered.filter(user => 
                user._id.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                user.fname.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                user.lname.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
            );
        }

        // Filter by access level
        if (userAccessLevelFilter !== 'all') {
            filtered = filtered.filter(user => 
                userAccessLevelFilter === 'admin' ? user.accessLevel === 2 : user.accessLevel === 1
            );
        }

        // Filter by status
        if (userStatusFilter !== 'all') {
            filtered = filtered.filter(user => 
                userStatusFilter === 'active' ? user.status : !user.status
            );
        }

        // Sort users
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (userSortBy) {
                case 'name':
                    aValue = `${a.fname} ${a.lname}`.toLowerCase();
                    bValue = `${b.fname} ${b.lname}`.toLowerCase();
                    break;
                case 'email':
                    aValue = (a.email || '').toLowerCase();
                    bValue = (b.email || '').toLowerCase();
                    break;
                case 'accessLevel':
                    aValue = a.accessLevel || 1;
                    bValue = b.accessLevel || 1;
                    break;
                case 'date':
                    aValue = new Date(a.date_created || 0);
                    bValue = new Date(b.date_created || 0);
                    break;
                default:
                    return 0;
            }

            if (userSortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredUsers(filtered);
    };

    const loadUserToForm = (user) => {
        setSelectedId(user._id);
        setUserFormData({
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            password: '',
            accessLevel: user.accessLevel,
            status: user.status
        });
        setFormMode('edit');
        setFormType('user');
        setShowFormModal(true);
    };

    const openCreateUserModal = () => {
        setUserFormData({
            fname: '',
            lname: '',
            email: '',
            password: '',
            accessLevel: 1,
            status: true
        });
        setSelectedId('');
        setFormMode('create');
        setFormType('user');
        setShowFormModal(true);
    };

    useEffect(() => {
        if (activeTab === 'products') {
            fetchProducts();
        } else if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'orders') {
            fetchOrders();
        }
    }, [activeTab]);

    useEffect(() => {
        filterAndSortOrders();
    }, [orders, orderSearchTerm, orderSortBy, orderSortOrder, orderStatusFilter]);

    useEffect(() => {
        filterAndSortProducts();
    }, [products, productSearchTerm, productSortBy, productSortOrder, productCategoryFilter, productStatusFilter]);

    useEffect(() => {
        filterAndSortUsers();
    }, [users, userSearchTerm, userSortBy, userSortOrder, userAccessLevelFilter, userStatusFilter]);

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
                <>
                    <section className="section-card">
                        <h2 className="section-title">Products</h2>
                        <div className="orders-controls">
                            <div className="search-filter-row">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={productSearchTerm}
                                    onChange={(e) => setProductSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                                <select
                                    value={productCategoryFilter}
                                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="TV">TV</option>
                                    <option value="Laptop">Laptop</option>
                                    <option value="Phone">Phone</option>
                                    <option value="Tablet">Tablet</option>
                                    <option value="Wearable">Wearable</option>
                                </select>
                                <select
                                    value={productStatusFilter}
                                    onChange={(e) => setProductStatusFilter(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="sort-controls">
                                <select
                                    value={productSortBy}
                                    onChange={(e) => setProductSortBy(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="model">Sort by Model</option>
                                    <option value="brand">Sort by Brand</option>
                                    <option value="category">Sort by Category</option>
                                    <option value="price">Sort by Price</option>
                                    <option value="stock">Sort by Stock</option>
                                </select>
                                <button
                                    onClick={() => setProductSortOrder(productSortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="sort-order-btn"
                                >
                                    {productSortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                                <button onClick={fetchProducts} className="refresh-button">
                                    Refresh Products
                                </button>
                                <button onClick={openCreateModal} className="action-button">
                                    Create New Product
                                </button>
                            </div>
                        </div>

                        {filteredProducts?.length === 0 ? (
                            <p>No products found</p>
                        ) : (
                            <>
                                <table className="data-table">
                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Image</th>
                                        <th>Category</th>
                                        <th>Brand</th>
                                        <th>Model</th>
                                        <th>Price</th>
                                        <th>Stock Status</th>
                                        <th>Stock Level</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredProducts?.map((product) => (
                                        <tr key={product._id}>
                                            <td>{product._id}</td>
                                            <td>
                                                <img
                                                src={product.image ? `data:image/png;base64,${product.image}` : '/placeholder.png'}
                                                alt={product.model}
                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                                            </td>
                                            <td>{product.category}</td>
                                            <td>{product.brand}</td>
                                            <td>{product.model}</td>
                                            <td>${product.price}</td>
                                            <td>{product.stocking_status}</td>
                                            <td>{product.stock_level}</td>
                                            <td>
                                                <button
                                                    onClick={() => openModal(product, 'product')}
                                                    className="action-button"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => loadProductToForm(product)}
                                                    className="action-button"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedId(product._id);
                                                        deleteProduct();
                                                    }}
                                                    className="action-button delete-button"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                                <div className="card-grid">
                                    {filteredProducts?.map((product) => (
                                        <div key={product._id} className="data-card">
                                            <div className="card-title">{product.brand} {product.model}</div>
                                            <div className="card-field">
                                                <span className="card-field-label">Category:</span>
                                                <span className="card-field-value">{product.category}</span>
                                            </div>
                                            <div className="card-field">
                                                <span className="card-field-label">Price:</span>
                                                <span className="card-field-value">${product.price}</span>
                                            </div>
                                            <div className="card-field">
                                                <span className="card-field-label">Stock:</span>
                                                <span className="card-field-value">{product.stocking_status}</span>
                                            </div>
                                            <div className="card-actions">
                                                <button
                                                    onClick={() => openModal(product, 'product')}
                                                    className="action-button"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => loadProductToForm(product)}
                                                    className="action-button"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedId(product._id);
                                                        deleteProduct();
                                                    }}
                                                    className="action-button delete-button"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </section>
                </>
            )}

            {activeTab === 'users' && (
                <section className="section-card">
                    <h2 className="section-title">Users</h2>
                    <div className="orders-controls">
                        <div className="search-filter-row">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={userSearchTerm}
                                onChange={(e) => setUserSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <select
                                value={userAccessLevelFilter}
                                onChange={(e) => setUserAccessLevelFilter(e.target.value)}
                                className="form-select"
                            >
                                <option value="all">All Access Levels</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                            <select
                                value={userStatusFilter}
                                onChange={(e) => setUserStatusFilter(e.target.value)}
                                className="form-select"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="sort-controls">
                            <select
                                value={userSortBy}
                                onChange={(e) => setUserSortBy(e.target.value)}
                                className="form-select"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="email">Sort by Email</option>
                                <option value="accessLevel">Sort by Access Level</option>
                                <option value="date">Sort by Date</option>
                            </select>
                            <button
                                onClick={() => setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc')}
                                className="sort-order-btn"
                            >
                                {userSortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                            <button onClick={fetchUsers} className="refresh-button">
                                Refresh Users
                            </button>
                            <button onClick={openCreateUserModal} className="action-button">
                                Create New User
                            </button>
                        </div>
                    </div>

                    {filteredUsers?.length === 0 ? (
                        <p>No users found</p>
                    ) : (
                        <>
                            <table className="data-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Access Level</th>
                                    <th>Status</th>
                                    <th>Date Created</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredUsers?.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user._id}</td>
                                        <td>{user.fname}</td>
                                        <td>{user.lname}</td>
                                        <td>{user.email}</td>
                                        <td>{user.accessLevel === 2 ? 'Admin' : 'User'}</td>
                                        <td>{user.status ? 'Active' : 'Inactive'}</td>
                                        <td>{new Date(user.date_created).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                onClick={() => openModal(user, 'user')}
                                                className="action-button"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => loadUserToForm(user)}
                                                className="action-button"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedId(user._id);
                                                    deleteUser();
                                                }}
                                                className="action-button delete-button"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <div className="card-grid">
                                {filteredUsers?.map((user) => (
                                    <div key={user._id} className="data-card">
                                        <div className="card-title">{user.fname} {user.lname}</div>
                                        <div className="card-field">
                                            <span className="card-field-label">Email:</span>
                                            <span className="card-field-value">{user.email}</span>
                                        </div>
                                        <div className="card-field">
                                            <span className="card-field-label">Role:</span>
                                            <span className="card-field-value">{user.accessLevel === 2 ? 'Admin' : 'User'}</span>
                                        </div>
                                        <div className="card-field">
                                            <span className="card-field-label">Status:</span>
                                            <span className="card-field-value">{user.status ? 'Active' : 'Inactive'}</span>
                                        </div>
                                        <div className="card-actions">
                                            <button
                                                onClick={() => openModal(user, 'user')}
                                                className="action-button"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => loadUserToForm(user)}
                                                className="action-button"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedId(user._id);
                                                    deleteUser();
                                                }}
                                                className="action-button delete-button"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            )}

            {activeTab === 'orders' && (
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
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </section>
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