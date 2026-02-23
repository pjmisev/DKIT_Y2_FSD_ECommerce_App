import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router';

import { Home } from './components/Home.jsx';
import { Products } from './components/Products.jsx';
import { Cart } from './components/Cart.jsx';
import { Test } from './components/Test.jsx';

import { Login } from './components/Login.jsx';
import { Register } from './components/Register.jsx';
import { Logout } from './components/Logout.jsx';
import { DisplayProduct } from './components/DisplayProduct.jsx';
import { User } from './components/User.jsx';

import { ACCESS_LEVEL_GUEST } from './config/global_constants';

if (typeof localStorage.accessLevel === "undefined") {
    localStorage.name = "GUEST"
    localStorage.accessLevel = ACCESS_LEVEL_GUEST
    localStorage.token = null
}

function App() {
    const [userLevel, setUserLevel] = useState(parseInt(localStorage.accessLevel));

    const handleLoginState = () => {
        setUserLevel(parseInt(localStorage.accessLevel));
    }

    return (
        <BrowserRouter>
            <nav
                style={{
                    padding: '10px',
                    borderBottom: '1px solid #ccc',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    backgroundColor: '#151414',
                    zIndex: 1000,
                }}
            >
                <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
                <Link to="/products" style={{ marginRight: '10px' }}>Products</Link>
                <Link to="/cart" style={{ marginRight: '10px' }}>Cart</Link>
                {
                    userLevel > ACCESS_LEVEL_GUEST
                        ? (
                            <Link to="/logout" style={{ marginRight: '10px' }}>Logout</Link>
                        )
                        : (
                            <>
                                <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
                                <Link to="/register" style={{ marginRight: '10px' }}>Register</Link>
                            </>
                        )
                }
                <Link to={"/user"} style={{ marginRight: '10px' }}>User</Link>
                <Link to="/test">Test</Link>
            </nav>

            <main style={{ padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/test" element={<Test />} />
                    <Route path="/login" element={<Login onLoginChange={handleLoginState} />} />
                    <Route path="/register" element={<Register onLoginChange={handleLoginState} />} />
                    <Route path="/logout" element={<Logout onLoginChange={handleLoginState} />} />
                    <Route path="/products/:id" element={<DisplayProduct />} />
                    <Route path="/user" element={<User />} />
                    <Route path="*" element={<h2>404 Page Not Found</h2>} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;