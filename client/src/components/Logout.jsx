import React, { useEffect } from "react"
import { useNavigate } from "react-router"
import axios from "axios"
import { ACCESS_LEVEL_GUEST, SERVER_HOST } from "../config/global_constants"

export const Logout = ({ onLoginChange }) => {
    const navigate = useNavigate()

    const handleLogout = () => {
        axios.post(`${SERVER_HOST}/users/logout`)
            .then(res => {
                localStorage.clear()
                localStorage.name = "GUEST"
                localStorage.accessLevel = ACCESS_LEVEL_GUEST
                onLoginChange()
                navigate("/")
            })
            .catch(err => console.log("Logout error", err))
    }

    return (
        <div>
            <h3>Are you sure you want to log out?</h3>
            <button onClick={handleLogout} style={{color:'red'}}>Yes, Log me out</button>
        </div>
    )
}