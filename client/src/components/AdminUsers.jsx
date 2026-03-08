import { useState, useEffect } from 'react';
import axios from 'axios';

export const AdminUsers = ({
    setModalItem, 
    setModalType,
    setShowFormModal,
    setFormMode,
    setFormType,
    setSelectedId,
    setUserFormData,
    closeConfirmationModal 
}) => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [userSortBy, setUserSortBy] = useState('name');
    const [userSortOrder, setUserSortOrder] = useState('asc');
    const [userAccessLevelFilter, setUserAccessLevelFilter] = useState('all');
    const [userStatusFilter, setUserStatusFilter] = useState('all');

    const API_URL = 'http://localhost:4000/api';

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
            setShowFormModal(false);
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
            setShowFormModal(false);
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };

    const deleteUser = (userId) => {
        setSelectedId(userId);
        setConfirmationModal({
            show: true,
            title: 'Delete User',
            message: 'Are you sure you want to delete this user? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    const { data } = await axios.delete(`${API_URL}/users/${userId}`,
                        {
                            headers: { authorization: localStorage.token }
                        });
                    console.log('Deleted:', data);
                    fetchUsers();
                    setSelectedId('');
                    closeConfirmationModal();
                } catch (err) {
                    console.error('Error deleting user:', err);
                    closeConfirmationModal();
                }
            }
        });
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

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterAndSortUsers();
    }, [users, userSearchTerm, userSortBy, userSortOrder, userAccessLevelFilter, userStatusFilter]);

    return (
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
                                        onClick={() => {
                                            setModalItem(user);
                                            setModalType('user');
                                        }}
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
                                        onClick={() => deleteUser(user._id)}
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
                                        onClick={() => {
                                            setModalItem(user);
                                            setModalType('user');
                                        }}
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
                                        onClick={() => deleteUser(user._id)}
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
    );
};
