import { useState, useEffect } from 'react';
import axios from 'axios';

export const AdminProducts = ({
    setModalItem, 
    setModalType,
    closeConfirmationModal 
}) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const [productSortBy, setProductSortBy] = useState('model');
    const [productSortOrder, setProductSortOrder] = useState('asc');
    const [productCategoryFilter, setProductCategoryFilter] = useState('all');
    const [productStatusFilter, setProductStatusFilter] = useState('all');
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedId, setSelectedId] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [formType, setFormType] = useState('product');
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

    const API_URL = 'http://localhost:4000/api';

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/products`);
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

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
            setShowFormModal(false);
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
            setShowFormModal(false);
            setSelectedFile(null);
        } catch (err) {
            console.error('Error updating product:', err);
        }
    };

    const deleteProduct = (productId) => {
        setSelectedId(productId);
        setConfirmationModal({
            show: true,
            title: 'Delete Product',
            message: 'Are you sure you want to delete this product? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    const { data } = await axios.delete(`${API_URL}/products/${productId}`,{
                        headers: { authorization: localStorage.token }
                    });
                    console.log('Deleted:', data);
                    fetchProducts();
                    setSelectedId('');
                    closeConfirmationModal();
                } catch (err) {
                    console.error('Error deleting product:', err);
                    closeConfirmationModal();
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

    const handleFileChange = e => {
        setSelectedFile(e.target.files[0]);
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

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterAndSortProducts();
    }, [products, productSearchTerm, productSortBy, productSortOrder, productCategoryFilter, productStatusFilter]);

    return (
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
                                        onClick={() => {
                                            setModalItem(product);
                                            setModalType('product');
                                        }}
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
                                        onClick={() => deleteProduct(product._id)}
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
                                        onClick={() => {
                                            setModalItem(product);
                                            setModalType('product');
                                        }}
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
                                        onClick={() => deleteProduct(product._id)}
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

        {showFormModal && formType === 'product' && (
            <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2 className="modal-title">
                            {formMode === 'edit' ? `UPDATE Product (ID: ${selectedId})` : 'CREATE New Product'}
                        </h2>
                        <button className="modal-close" onClick={() => setShowFormModal(false)}>
                            ×
                        </button>
                    </div>
                    <div className="modal-body">
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
                                    onClick={() => setShowFormModal(false)}
                                    className="tertiary-button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};
