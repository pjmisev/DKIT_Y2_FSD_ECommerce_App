import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"

export const Login = ({ onLoginChange }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        axios.post(`${SERVER_HOST}/api/users/login/${email}/${password}`)
            .then(res => {
                if(res.data) {
                    if (res.data.errorMessage) {
                        alert(res.data.errorMessage)
                    }
                    else {
                        localStorage.name = res.data.name
                        localStorage.accessLevel = res.data.accessLevel
                        localStorage.token = res.data.token
                        
                        // Fetch user data to get profile image
                        axios.get(`${SERVER_HOST}/api/user`, {
                            headers: {
                                authorization: res.data.token
                            }
                        }).then(userRes => {
                            if (userRes.data && userRes.data.image) {
                                localStorage.setItem("userImage", userRes.data.image);
                            }
                            onLoginChange();
                        }).catch(err => {
                            console.log('Error fetching user data:', err);
                            onLoginChange();
                        });
                        
                        navigate("/")
                    }
                }
            })
            .catch(err => console.log("Login error", err))
    }

    return (
        <div className="login-container">
        <form onSubmit={handleSubmit}>
            <h3>Login</h3>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            /><br/>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            /><br/>
            <button type="submit">Login</button>
        </form>
        </div>
    )
}