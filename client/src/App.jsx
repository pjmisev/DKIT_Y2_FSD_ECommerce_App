import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import {SANDBOX_CLIENT_ID, SERVER_HOST} from "./config/global_constants"
import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js"


import { Home } from './components/Home.jsx';
import { Products } from './components/Products.jsx';
import { Cart } from './components/Cart.jsx';

import { Login } from './components/Login.jsx';
import { Register } from './components/Register.jsx';
import { Logout } from './components/Logout.jsx';
import { DisplayProduct } from './components/DisplayProduct.jsx';
import { User } from './components/User.jsx';
import { BuyProduct } from "./components/BuyProduct.jsx";
import { PayPalMessage } from "./components/PayPalMessage.jsx";

import {ACCESS_LEVEL_ADMIN, ACCESS_LEVEL_GUEST} from './config/global_constants';
import { Admin } from "./components/Admin.jsx";

if (typeof localStorage.accessLevel === "undefined") {
    localStorage.name = "GUEST"
    localStorage.accessLevel = ACCESS_LEVEL_GUEST
    localStorage.token = null
}

function App() {
    const [userLevel, setUserLevel] = useState(parseInt(localStorage.accessLevel));
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(localStorage.userImage || null);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleLoginState = () => {
        setUserLevel(parseInt(localStorage.accessLevel));
        setProfileImage(localStorage.userImage || null);
    };

    useEffect(() => {
        const handleStorageChange = () => {
            setProfileImage(localStorage.userImage || null);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <PayPalScriptProvider options={{ "client-id": SANDBOX_CLIENT_ID, currency: "EUR" }}>
        <BrowserRouter>
            <nav className="navbar">
                <div className="nav-left">
                    <Link to="/" className="logo">Sustiances</Link>
                    <div className="desktop-links">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/products" className="nav-link">Products</Link>


                        {userLevel === ACCESS_LEVEL_ADMIN && (
                            <Link to="/admin" className="nav-link">Admin</Link>
                        )}
                    </div>
                </div>

                <div className="nav-right desktop-links">
                    <Link to="/cart" className="nav-link">Cart</Link>

                    {userLevel > ACCESS_LEVEL_GUEST ? (
                        <>
                            <Link to="/user" className="app-user-img">
                                {profileImage ? (
                                    <img src={`data:image/*;base64,${profileImage}`} alt="Profile" className="profile-nav-img" />
                                ) : (
                                    <span className="profile-fallback">U</span> // Fallback icon
                                )}
                            </Link>
                            <Link to="/logout" className="nav-link">Logout</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link">Register</Link>
                        </>
                    )}
                </div>

                <button className="hamburger-btn" onClick={toggleMenu}>
                    ☰
                </button>

                {isMobileMenuOpen && (
                    <div className="mobile-menu">
                        <Link to="/" onClick={closeMenu}>Home</Link>
                        <Link to="/products" onClick={closeMenu}>Products</Link>
                        <Link to="/cart" onClick={closeMenu}>Cart</Link>

                        {userLevel === ACCESS_LEVEL_ADMIN && (
                            <Link to="/admin" onClick={closeMenu}>Admin</Link>
                        )}

                        <hr className="mobile-divider" />

                        {userLevel > ACCESS_LEVEL_GUEST ? (
                            <>
                                <Link to="/user" onClick={closeMenu}>Profile</Link>
                                <Link to="/logout" onClick={closeMenu}>Logout</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={closeMenu}>Login</Link>
                                <Link to="/register" onClick={closeMenu}>Register</Link>
                            </>
                        )}
                    </div>
                )}
            </nav>

            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login onLoginChange={handleLoginState} />} />
                    <Route path="/register" element={<Register onLoginChange={handleLoginState} />} />
                    <Route path="/logout" element={<Logout onLoginChange={handleLoginState} />} />
                    <Route path="/products/:id" element={<DisplayProduct />} />
                    <Route path="/PayPalMessage/:messageType/:payPalOrderID" element={<PayPalMessage />} />
                    <Route path="/user" element={<User />} />
                    <Route path="*" element={<h2>404 Page Not Found</h2>} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </main>
        </BrowserRouter>
            </PayPalScriptProvider>
    );
}

export default App;