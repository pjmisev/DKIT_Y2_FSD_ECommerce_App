import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { SERVER_HOST } from "../config/global_constants"

export const Register = ({ onLoginChange }) => {
    const [fname, setFName] = useState("")
    const [lname, setLName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        axios.post(`${SERVER_HOST}/api/users/register/${fname}/${lname}/${email}/${password}`)
            .then(res => {
                if(res.data) {
                    if (res.data.errorMessage) {
                        alert(res.data.errorMessage)
                    }
                    else {
                        localStorage.name = res.data.name
                        localStorage.accessLevel = res.data.accessLevel
                        localStorage.token = res.data.token
                        onLoginChange()
                        navigate("/")
                    }
                }
            })
            .catch(err => console.log("Register error", err))
    }

    return (
        <div className="register-container">
        <form onSubmit={handleSubmit}>
            <h3>Register</h3>
            <input type="text" placeholder="First Name" value={fname} onChange={e => setFName(e.target.value)} required /><br/>
            <input type="text" placeholder="Last Name" value={lname} onChange={e => setLName(e.target.value)} required /><br/>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br/>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /><br/>
            <button type="submit">Register</button>
        </form>
        </div>
    )
}