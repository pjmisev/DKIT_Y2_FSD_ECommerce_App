import { useState, useEffect } from 'react';
import axios from 'axios';

export const AdminHome = props => {
    const [products, setProducts] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [singleProduct, setSingleProduct] = useState(null);
    const [formData, setFormData] = useState({
        category: '',
        brand: '',
        model: '',
        description: '',
        colour: '',
        release_date: '',
        energy_rating: '',
        price: ''
    });

    const API_URL = 'http://localhost:4000/api';

    // GET all products
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/products`);
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    // GET single product
    const fetchProductById = async () => {
        if (!selectedId) return;
        try {
            const { data } = await axios.get(`${API_URL}/products/${selectedId}`);
            setSingleProduct(data);
        } catch (err) {
            console.error('Error fetching product:', err);
        }
    };

    const handleFileChange = e =>
    {
        setSelectedFile(e.target.files[0])
    }

    const [selectedFile, setSelectedFile] = useState(null)

    // POST new product
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
                colour: '', release_date: '', energy_rating: '', price: ''
            });
            setSelectedFile(null);
        } catch (err) {
            console.error('Error creating product:', err);
        }
    };

    // PUT update product
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

            setSelectedFile(null);
        } catch (err) {
            console.error('Error updating product:', err);
        }
    };

    // DELETE product
    const deleteProduct = async () => {
        if (!selectedId) return;
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const { data } = await axios.delete(`${API_URL}/products/${selectedId}`);
            console.log('Deleted:', data);
            fetchProducts();
            setSelectedId('');
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    // Load product into form for editing
    const loadProductToForm = (product) => {
        setSelectedId(product._id);
        setFormData({
            category: product.category,
            brand: product.brand,
            model: product.model,
            description: product.description,
            colour: product.colour,
            release_date: product.release_date,
            energy_rating: product.energy_rating,
            price: product.price
        });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        color: 'black'
    };

    const thStyle = {
        border: '1px solid #ddd',
        padding: '12px',
        textAlign: 'left',
        backgroundColor: '#4CAF50',
        color: 'white'
    };

    const tdStyle = {
        border: '1px solid #ddd',
        padding: '8px'
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', backgroundColor: 'white', color: 'black', minHeight: '100vh' }}>
            <h1 style={{ color: 'black' }}>Product API Tester</h1>

            {/* GET All Products */}
            <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', backgroundColor: 'white' }}>
                <h2 style={{ color: 'black' }}>GET /products</h2>
                <button onClick={fetchProducts} style={{ padding: '10px 20px', marginBottom: '15px', cursor: 'pointer' }}>
                    Refresh Products
                </button>

                {products?.length === 0 ? (
                    <p style={{ color: 'black' }}>No products found</p>
                ) : (
                    <table style={tableStyle}>
                        <thead>
                        <tr>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Category</th>
                            <th style={thStyle}>Brand</th>
                            <th style={thStyle}>Model</th>
                            <th style={thStyle}>Description</th>
                            <th style={thStyle}>Colour</th>
                            <th style={thStyle}>Release Date</th>
                            <th style={thStyle}>Energy Rating</th>
                            <th style={thStyle}>Price</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products?.map((product) => (
                            <tr key={product._id}>
                                <td style={tdStyle}>{product._id}</td>
                                <td style={tdStyle}>{product.category}</td>
                                <td style={tdStyle}>{product.brand}</td>
                                <td style={tdStyle}>{product.model}</td>
                                <td style={tdStyle}>{product.description}</td>
                                <td style={tdStyle}>{product.colour}</td>
                                <td style={tdStyle}>{product.release_date}</td>
                                <td style={tdStyle}>{product.energy_rating}</td>
                                <td style={tdStyle}>${product.price}</td>
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => loadProductToForm(product)}
                                        style={{ padding: '5px 10px', marginRight: '5px', cursor: 'pointer' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedId(product._id);
                                            setTimeout(() => deleteProduct(), 0);
                                        }}
                                        style={{ padding: '5px 10px', backgroundColor: '#ff4444', color: 'white', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </section>

            {/* GET Single Product */}
            <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', backgroundColor: 'white' }}>
                <h2 style={{ color: 'black' }}>GET /products/:id</h2>
                <input
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    placeholder="Product ID"
                    style={{ marginRight: '10px', padding: '8px', color: 'black', backgroundColor: 'white', border: '1px solid #ddd' }}
                />
                <button onClick={fetchProductById} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                    Fetch Product
                </button>
                {singleProduct && (
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f5f5f5', color: 'black' }}>
                        <pre style={{ color: 'black' }}>{JSON.stringify(singleProduct, null, 2)}</pre>
                    </div>
                )}
            </section>

            {/* POST/PUT Form */}
            <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', backgroundColor: 'white' }}>
                <h2 style={{ color: 'black' }}>
                    {selectedId ? `UPDATE Product (ID: ${selectedId})` : 'CREATE New Product'}
                </h2>
                <form onSubmit={createProduct} style={{ display: 'grid', gap: '10px' }}>
                    <input
                        placeholder="Category"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        style={{ padding: '8px', color: 'black', backgroundColor: 'white', border: '1px solid #ddd' }}
                    />
                    <input
                        placeholder="Brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        style={{ padding: '8px', color: 'black', backgroundColor: 'white', border: '1px solid #ddd' }}
                    />
                    <input
                        placeholder="Model"
                        value={formData.model}
                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                        style={{ padding: '8px', color: 'black', backgroundColor: 'white', border: '1px solid #ddd' }}
                    />
                    <input
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        style={{ padding: '8px', color: 'black', backgroundColor: 'white', border: '1px solid #ddd' }}
                    />
                    <input
                        placeholder="Colour"
                        value={formData.colour}
                        onChange={(e) => setFormData({...formData, colour: e.target.value})}
                        style={{ padding: '8px', color: 'black', backgroundColor: 'white', border: '1px solid #ddd' }}
                    />
                    <input
                        placeholder="Release Date (YYYY-MM-DD)"
                        value={formData.release_date}
                        onChange={(e) => setFormData({...formData, release_date: e.target.value})}
                        style={{ padding: '8px', color: 'black', backgroundColor: 'white', border: '1px solid #ddd' }}
                    />
                    <input
                        placeholder="Energy Rating (A-G)"
                        value={formData.energy_rating}
                        onChange={(e) => setFormData({...formData, energy_rating: e.target.value})}
                        style={{ padding: '8px', color: 'black', backgroundColor: 'white', border: '1px solid #ddd' }}
                    />
                    <input
                        placeholder="Price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        style={{ padding: '8px', color: 'black', backgroundColor: 'white', border: '1px solid #ddd' }}
                    />
                    <input
                        type = "file"
                        onChange = {handleFileChange}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
                            Create Product (POST)
                        </button>
                        <button
                            type="button"
                            onClick={updateProduct}
                            style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}
                            disabled={!selectedId}
                        >
                            Update Product (PUT)
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedId('');
                                setFormData({
                                    category: '',
                                    brand: '',
                                    model: '',
                                    description: '',
                                    colour: '',
                                    release_date: '',
                                    energy_rating: '',
                                    price: ''
                                });
                            }}
                            style={{ padding: '10px 20px', backgroundColor: '#999', color: 'white', border: 'none', cursor: 'pointer' }}
                        >
                            Clear Form
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}