import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { ACCESS_LEVEL_GUEST, SERVER_HOST } from "../config/global_constants"

export const Logout = ({ onLoginChange }) => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogout = () => {
        setIsLoading(true)
        axios.post(`${SERVER_HOST}/api/users/logout`)
            .then(res => {
                localStorage.clear()
                localStorage.name = "GUEST"
                localStorage.accessLevel = ACCESS_LEVEL_GUEST
                onLoginChange()
                navigate("/")
            })
            .catch(err => {
                console.log("Logout error", err)
                setIsLoading(false)
            })
    }

    const handleCancel = () => {
        navigate("/")
    }

    return (
        <div className="cart-container">
            <div className="confirmation-modal-content" style={{ margin: '50px auto' }}>
                <h2 className="confirmation-modal-title">Confirm Logout</h2>
                <p className="confirmation-modal-message">
                    Are you sure you want to log out? You'll need to sign in again to access your account.
                </p>
                <div className="confirmation-modal-actions">
                    <button
                        onClick={handleLogout}
                        className="primary-button"
                        disabled={isLoading}
                        style={{ backgroundColor: '#ff4444', borderColor: '#ff4444' }}
                    >
                        {isLoading ? 'Logging out...' : 'Yes, Log Out'}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="tertiary-button"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}