import { BrowserRouter, Routes, Route, Link } from 'react-router';

import Home from './pages/home';
import Products from './pages/products';
import Cart from './pages/cart';

function App() {
    return (
        <BrowserRouter>
            <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
                <Link to="/products" style={{ marginRight: '10px' }}>Products</Link>
                <Link to="/cart">Cart</Link>
            </nav>

            <main style={{ padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="*" element={<h2>404 Page Not Found</h2>} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;