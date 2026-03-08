import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { AdminProducts } from './AdminProducts';
import { AdminUsers } from './AdminUsers';
import { AdminOrders } from './AdminOrders';

export const Admin = props => {
    const [activeTab, setActiveTab] = useState('products');

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
                <AdminProducts />
            )}

            {activeTab === 'users' && (
                <AdminUsers />
            )}

            {activeTab === 'orders' && (
                <AdminOrders />
            )}

        </div>
    );
}