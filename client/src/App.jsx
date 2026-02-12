import { BrowserRouter, Routes, Route, Link } from 'react-router';

import Home from './components/Home.jsx';
import Products from './components/Products.jsx';
import Cart from './components/Cart.jsx';
import Test from './components/Test.jsx';

function App() {
    return (
        <BrowserRouter>
            <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
                <Link to="/products" style={{ marginRight: '10px' }}>Products</Link>
                <Link to="/cart" style={{ marginRight: '10px' }}>Cart</Link>
                <Link to="/test">Test</Link>
            </nav>

            <main style={{ padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/test" element={<Test />} />
                    <Route path="*" element={<h2>404 Page Not Found</h2>} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;